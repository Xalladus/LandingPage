//Express Local server 
var express = require('express');
var app = express();
app.use(express.static(__dirname));

app.get('/', function (req, res) {
  res.render('index');
});

app.listen(3000, function () {
  console.log('Example app listening at http://127.0.0.1:3000/');
});

//background starter

const request = require('request');


apiKey = "client_id=fe7c436b0f520f6477593a26ea6222f5fc548eb6871ddea682184e753182e0e0";
reqURL = 'https://api.unsplash.com/photos/random?featured=true&count=5&'+apiKey;


request(reqURL, (err, response, body) => { 
  if (!err && response.statusCode === 200){
     // console.log(body); // show the page
      var result = JSON.parse(body); //this takes the response and changes it from a string to an object
      var photoURLs = [];
      for (var i = 0, i < 5, i++) {
        photoURLs[i] = result[i]['urls']['raw'];
      }
      
  } else {
      console.log("Something went wrong:" + err);
  }
  });

