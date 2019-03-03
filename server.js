/*
// Copyright (c) 2018 Intel Corporation
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
*/

var express = require('express');
var app = express();
var http = require('http');
var net = require('net');
var path = require('path');
var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var os = require('os');
var routes = require('./routes/index');
var port = process.env.PORT || 3000;
var server = http.createServer(app).listen(port);
var io = require('socket.io').listen(server, { log: false });
var mosca = require('mosca');
var mqtt = require('mqtt')

var mqttServer = new mosca.Server({ port:1883 });
var mqttClient  = mqtt.connect('mqtt://127.0.0.1')


var publicPath = path.join(__dirname, 'public')
var sockets = []
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(publicPath));
app.use('/', routes);

//-----------------------------------------------------------------------------------------------------
//  
//-----------------------------------------------------------------------------------------------------

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//-----------------------------------------------------------------------------------------------------
//  mqtt
//-----------------------------------------------------------------------------------------------------
mqttServer.on('ready', function(){
    console.log("ready");
});


mqttClient.on('connect', function () {
    getSources().forEach(function(source) {
        mqttClient.subscribe(source)

    })
})

mqttClient.on('message', function (topic, message) {
    var message = JSON.parse(message);
    var keys = Object.keys(message);
    for (var i = 0; i < keys.length; i++) {
        var id = keys[i]+"_"+topic;
        var resource = getResourceById(id)
        if(resource && currentResource && currentResource.id == id) {
            var data = new Object();
            data.ts = new Date().getTime();
            data.value = message[keys[i]];
            data.id = id;
            sockets.forEach(function(socket) {
                socket.emit('data', data)
            })
        }
    }
})


//-----------------------------------------------------------------------------------------------------
//  Resources management
//-----------------------------------------------------------------------------------------------------
var resources = JSON.parse(fs.readFileSync('./resources.js'));
var currentResource = null;

function addResources(socket) {
    resources.forEach(function(resource) {
        resource.id = resource.name+"_"+resource.source;
        socket.emit("add",  resource);
    })
}

function getResourceById(id) {
    for (var i=0; i<resources.length; i++) {
        if ( resources[i].id == id ) {
            return resources[i];
        }
    }
    return null;
}

function getSources() {
    var sources = [];
    resources.forEach(function(resource) {
        if ( resource.source ) {
            sources.push(resource.source)
        }
    })
    function onlyUnique(value, index, self) { 
        return self.indexOf(value) === index;
    }

    return sources.filter(onlyUnique)
}

//-----------------------------------------------------------------------------------------------------
//  Clients's Connection 
//-----------------------------------------------------------------------------------------------------


io.sockets.on('connection', function(socket) {

    console.log('New connection from :  ' + socket.handshake.address);
    
    addResources(socket)
    sockets.push(socket)
    
    socket.on('selectResource', function(id) {
        currentResource = getResourceById(id);
    })
    socket.on('disconnect', function () {
        sockets.splice( sockets.indexOf(socket),1);
    })

});



module.exports = app;

console.log('Express server listening on port ' + server.address().port);




