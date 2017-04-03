var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var twitter = require('twitter');
var apiKeys = require('./api-keys');
var twit = new twitter(apiKeys);

var stream = null;

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

//Use the default port (for beanstalk) or default to 8081 locally
http.listen(process.env.PORT || 8081);
console.log('Listening on port 8081');

//Setup rotuing for app
app.use(express.static(__dirname + '/public'));

//Setup web sockets
io.on('connection', function (socket) {

  //New socket.io connection
  socket.on('start tweets', function() {

    if (stream === null) {
      // Connect to twitter stream with filter for SF & NYC
      twit.stream('statuses/filter', {'locations': '-180,-90,180,90'}, function(s) {
        stream = s;
        s.on('data', function(data) {
          console.log('data', data);
          // if (data.coordinates) {
          //   //If so then build up some nice json and send out to web sockets
          //   var outputPoint = {
          //     lat: data.coordinates.coordinates[0],
          //     lng: data.coordinates.coordinates[1]
          //   };

          //   socket.broadcast.emit('twitter-stream', outputPoint);

          //   //Send out to web sockets channel.
          //   socket.emit('twitter-stream', outputPoint);
          // }
        });
      });
    }
  });

  socket.on('error', function (error) {
    console.log('error ', err);
  });

    // Emits signal to the client telling them that the
    // they are connected and can start receiving Tweets
  socket.emit('connected');
});
