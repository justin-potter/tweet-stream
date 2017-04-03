
  // Storage for WebSocket connections
  var socket = io();

//   // This listens on the "twitter-steam" channel and data is
//   // received everytime a new tweet is receieved.
//   socket.on('twitter-stream', function (data) {

//     console.log(data);

//   });

//   // Listens for a success response from the server to
//   // say the connection was successful.
  socket.on('connected', function(r) {
    console.log('connected');
    //Now that we are connected to the server let's tell
    //the server we are ready to start receiving tweets.
    socket.emit('start tweets');
  });