//>>excludeStart("configExclude", pragmas.configExclude)
//this is only needed in a development enviroment
//with the built version this is not needed
requirejs.config({
    paths: {
        jquery: "../libraries/zepto.custom",
        backbone: "../libraries/backbone",
        underscore: "../libraries/lodash",
        css: "../libraries/css",
        text: "../libraries/text",
        socket: "../libraries/socket.io",
        radio: '../libraries/Radio'
    },
    shim: {
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    }
});
//>>excludeEnd("configExclude")

require(["backbone", "Router", "SocketAdapter"], function (Backbone, Router, Socket) {
    var router = new Router({
        el: $("#APP")
    });
    Backbone.history.start();
});