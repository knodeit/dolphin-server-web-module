'use strict';

var paths = {
    js: [
        './*.js',
        './factories/**/*.js'
    ]
};

module.exports = function (grunt) {
    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: {
                src: paths.js,
                options: {
                    jshintrc: true
                }
            }
        }
    });

    //Load NPM tasks
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    //Default task(s).
    grunt.registerTask('default', ['jshint']);
};
