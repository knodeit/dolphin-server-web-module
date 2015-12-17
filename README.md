### Installation
```npm install dolphin-server-web-package```


### WebServerConfigurationFactory

The factory has default properties and methods:
* events (start, end) work via promises
* host
* port

methods:
* getApp - return app object of express
* getHttp - return http object
* addModule - registration custom module
* addPromise - web server will wait for your resolve then will execute own logic
* addMiddlewareBefore - adding middleware before all routes
* addMiddlewareAfter - adding middleware after all routes
* addStaticSource - requires object with keys: url and path


When you call "addModule" the web server will read all routes and middleware in the following folders:
```
package_folder
   server
      routes
      middleware
         before
         after
```

Each file must resolve WebServerConfigurationFactory to get app object or other objects.
```
module.exports = function (WebServerConfigurationFactory) {
    var app = WebServerConfigurationFactory.getApp();
    app.get('*');
};
```