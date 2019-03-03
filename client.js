var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://127.0.0.1');
client.on('connect', function () {
setInterval(function() {
	var temp = {temperature: Math.floor(Math.random() * Math.floor(100))}
	client.publish('kitchen', JSON.stringify(temp));
	console.log('Message Sent');
}, 2000);
})
