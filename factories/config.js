/**
 * Created by Vadim on 12/9/15.
 */
'use strict';

var express = require('express');
var http = require('http');
var morgan = require('morgan');

var modules = [];
var app = express();
var server = http.createServer(app);

module.exports = {
    name: 'Configuration',
    entity: {
        middleware: {
            before: [morgan('combined')],
            after: []
        },
        host: process.env.HOST || process.env.HOSTNAME || 'localhost',
        port: process.env.PORT || 3000,
        showStackError: true,
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
        }
    }
};