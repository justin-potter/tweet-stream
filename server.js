var twitter = require('twitter');
var express = require('express');
var apiKeys = require('./api-keys');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var twit = new twitter(apiKeys);

var stream = null;

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

//Use the default port (for beanstalk) or default to 8081 locally
server.listen(process.env.PORT || 8081);
console.log('Listening on port 8081');

//Setup rotuing for app
app.use(express.static(__dirname + '/public'));

//Setup web sockets
io.sockets.on('connection', function (socket) {

  //New socket.io connection
  socket.on('start tweets', function() {

    if (stream === null) {
      // Connect to twitter stream with filter for SF & NYC
      twit.stream('statuses/filter', {'locations': '-122.75,36.8,-121.75,37.8,-74,40,-73,41'}, function(s) {
        stream = s;
        stream.on('data', function(data) {
          if (data.coordinates) {
            //If so then build up some nice json and send out to web sockets
            var outputPoint = {
              lat: data.coordinates.coordinates[0],
              lng: data.coordinates.coordinates[1]
            };

            socket.broadcast.emit('twitter-stream', outputPoint);

            //Send out to web sockets channel.
            socket.emit('twitter-stream', outputPoint);
          }
        });
      });
    }
  });
    // Emits signal to the client telling them that the
    // they are connected and can start receiving Tweets
  socket.emit('connected');
});
