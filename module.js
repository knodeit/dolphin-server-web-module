/**
 * Created by Vadim on 12/3/15.
 */
'use strict';
var Q = require('q');
var PathUtil = require('path');
var Dolphin = require('dolphin-core');
var Module = require('dolphin-core-modules').Module;
var FSUtil = require('dolphin-core-utils').FS;
var Logger = require('dolphin-logger');
var express = require('express');

var SERVER_FOLDER = 'server';
var ROUTES_FOLDER = 'routes';
var MIDDLEWARE_FOLDER = 'middleware';
var ws = new Module('WebServer', __dirname);

function _resolveFiles(path) {
    var deferred = Q.defer();
    FSUtil.readDir(path).then(function (files) {
        if (files.length === 0) {
            return deferred.resolve();
        }

        for (var i in files) {
            Dolphin.resolveObjects(require(files[i]));
        }
        deferred.resolve();
    });
    return deferred.promise;
}

ws.resolveMiddleware = function (module, action) {
    return _resolveFiles(module.resolvePath(PathUtil.join(SERVER_FOLDER, MIDDLEWARE_FOLDER, action, '/**/*.js')));
};

ws.resolveRoutes = function (module) {
    return _resolveFiles(module.resolvePath(PathUtil.join(SERVER_FOLDER, ROUTES_FOLDER, '/**/*.js')));
};

ws.run(function (WebServerConfigurationFactory) {
    //event start
    WebServerConfigurationFactory.events._startEvent.resolve();

    //init sources
    var staticSources = WebServerConfigurationFactory.getStaticSources();
    staticSources.forEach(function (source) {
        WebServerConfigurationFactory.getApp().use(source.url, express.static(source.path));
    });

    //wait for other modules
    var promises = WebServerConfigurationFactory.getPromises();
    Q.all(promises).then(function () {
        var funcs = [];
        var modules = WebServerConfigurationFactory.getModules();

        //load default
        WebServerConfigurationFactory.getMiddleware().before.forEach(function (middleware) {
            WebServerConfigurationFactory.getApp().use(middleware);
        });

        for (var i in modules) {
            funcs.push(ws.resolveMiddleware(modules[i], 'before'));
        }
        //load before all middleware
        Q.all(funcs).then(function () {
            funcs = [];
            for (i in modules) {
                funcs.push(ws.resolveRoutes(modules[i]));
            }

            //load all routes
            Q.all(funcs).then(function () {
                funcs = [];
                for (i in modules) {
                    funcs.push(ws.resolveMiddleware(modules[i], 'after'));
                }

                //load after all middleware
                Q.all(funcs).then(function () {

                    //load default
                    WebServerConfigurationFactory.getMiddleware().after.forEach(function (middleware) {
                        WebServerConfigurationFactory.getApp().use(middleware);
                    });

                    WebServerConfigurationFactory.getHttp().listen(WebServerConfigurationFactory.port, WebServerConfigurationFactory.host, function () {
                        Logger.info('Web server started on:', WebServerConfigurationFactory.host + ':' + WebServerConfigurationFactory.port);

                        //event end, notify all modules
                        setTimeout(function () {
                            WebServerConfigurationFactory._endEvent.end.resolve();
                        }, 0);
                    });
                });
            });
        });
    });
});