var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var twitter = require('twitter');
var apiKeys = require('./api-keys');
var twit = new twitter(apiKeys);

var stream = null;

var locations = {
  SF: {
    sw: {
      lng: '-122.75',
      lat: '36.8',
    },
    ne: {
      lng: '-121.75',
      lat: '37.8',
    }
  }
};

const locateString = (location) => {
  return `${location.sw.lng},${location.sw.lat},${location.ne.lng},${location.ne.lat}`;
};

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
      // Connect to twitter stream with filter for SF
      // SF: '-122.75,36.8,-121.75,37.8'
      // NYC: '-74,40,-73,41'
      twit.stream('statuses/filter', {'locations': locateString(locations.SF)}, function(s) {
        stream = s;
        s.on('data', function(data) {
          console.log('data', data);
          // if (data.coordinates) {
            //If so then build up some nice json and send out to web sockets
          var outputPoint = data;

          socket.broadcast.emit('twitter-stream', outputPoint);

          //Send out to web sockets channel.
          socket.emit('twitter-stream', outputPoint);
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
  socket.emit('connected', locations.SF);
});
