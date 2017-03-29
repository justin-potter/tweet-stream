import twitter from 'twitter';
import express from 'express';
import apiKeys from './api-keys';

const app = express();
const twit = new twitter(apiKeys);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000);
console.log('Listening on port 3000');

twit.stream('statuses/filter', {'locations': '-122.75,36.8,-121.75,37.8,-74,40,-73,41'}, function(stream) {
  stream.on('data', function (data) {
    console.log(data);
  });
});