
  // Storage for WebSocket connections
  const socket = io();
  const tweets = [];

  var map;
  var bounds;


  const setmap = (mapInstance) => {
    map = mapInstance;
    if (bounds) {
      map.setBounds(bounds.sw, bounds.ne);
    }
  };

  // This listens on the "twitter-steam" channel and data is
  // received everytime a new tweet is receieved.

  socket.on('twitter-stream', function (tweet) {

    tweets.push(tweet);
    console.log(tweet);

    if (tweet.coordinates !== null && map) {
      let tweetLocation = {
        lat: tweet.coordinates.coordinates[0],
        lng: tweet.coordinates.coordinates[1],
      };

      let tweetLatLng = new google.maps.LatLng(tweetLocation.lng, tweetLocation.lat);

      let marker = new google.maps.InfoWindow({
        position: tweetLatLng,
        disableAutoPan: true,
        // map: map.map,
        maxWidth: 200,
        content: tweet.text,
      });

      marker.open(map.map);
    //   var tweetLocation = new google.maps.LatLng(location.lng,location.lat);
    //   liveTweets.push(tweetLocation);

    //   //Flash a dot onto the map quickly
    //   var image = "css/small-dot-icon.png";
    //   var marker = new google.maps.Marker({
    //     position: tweetLocation,
    //     map: map,
    //     icon: image
    //   });
    //   setTimeout(function(){
    //     marker.setMap(null);
    //   },2000);
    }
  });

//   // Listens for a success response from the server to
//   // say the connection was successful.
  socket.on('connected', function(reply) {
    console.log('connected', reply);
    bounds = reply;
    if (map) {
      map.setBounds(bounds.sw, bounds.ne);
    }
    //Now that we are connected to the server let's tell
    //the server we are ready to start receiving tweets.
    socket.emit('start tweets');
  });
