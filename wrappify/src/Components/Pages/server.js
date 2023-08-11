
const express = require('express');
const request = require('request'); // or any HTTP client library
const app = express();
const PORT = 3001;

app.post('/refresh_token', (req, res) => {
  const refreshToken = req.body.refreshToken; 
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (new Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    },
    json: true
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      res.send({
        'access_token': body.access_token
      });
    } else {
      res.sendStatus(500);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});