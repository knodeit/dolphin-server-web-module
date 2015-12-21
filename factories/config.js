/**
 * Created by Vadim on 12/9/15.
 */
'use strict';
var Q = require('q');
var express = require('express');
var http = require('http');
var morgan = require('morgan');

var modules = [];
var middleware = {
    before: [morgan('combined')],
    after: []
};
var staticSources = [];
var promises = [];
var app = express();
var server = http.createServer(app);
var startEvent = Q.defer();
var endEvent = Q.defer();

module.exports = {
    name: 'Configuration',
    entity: {
        events: {
            _startEvent: startEvent,
            _endEvent: endEvent,
            start: startEvent.promise,
            end: endEvent.promise
        },
        host: process.env.HOST || process.env.HOSTNAME || 'localhost',
        port: process.env.PORT || 3000,
        getApp: function () {
            return app;
        },
        getHttp: function () {
            return server;
        },
        addModule: function (module) {
            modules.push(module);
        },
        getModules: function () {
            return modules;
        },
        addPromise: function (promise) {
            promises.push(promise);
        },
        getPromises: function () {
            return promises;
        },
        addMiddlewareBefore: function (middleware) {
            middleware.before.push(middleware);
        },
        addMiddlewareAfter: function (middleware) {
            middleware.after.push(middleware);
        },
        getMiddleware: function () {
            return middleware;
        },
        addStaticSource: function (source) {
            staticSources.push(source);
        },
        getStaticSources: function () {
            return staticSources;
        }
    }
};