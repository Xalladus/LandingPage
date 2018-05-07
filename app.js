//Express Local server 
var express = require('express');
var app = express();
const request = require('request');
app.use(express.static(__dirname));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('../index', {condition: condition});
});

app.listen(3000, function () {
  console.log('Example app listening at http://127.0.0.1:3000/');
});

//Weather API from Yahoo!   
var YQL = require('yql');
var query = new YQL("select item.condition from weather.forecast where u='c' and woeid=12590119");
var condition;
 //run the main weather query
 query.exec(function(err, data) {
  condition = data.query.results.channel.item.condition;
  console.log(condition);
  //use condition.temp and condition.text
  console.log('The current weather is ' + condition.temp + ' degrees. Its ' + condition.text +'.');    
});

//background starter

// const request = require('request');


// apiKey = "client_id=fe7c436b0f520f6477593a26ea6222f5fc548eb6871ddea682184e753182e0e0";
// reqURL = 'https://api.unsplash.com/photos/random?featured=true&count=5&'+apiKey;


// request(reqURL, (err, response, body) => { 
//   if (!err && response.statusCode === 200){
//      // console.log(body); // show the page
//       var result = JSON.parse(body); //this takes the response and changes it from a string to an object
//       var photoURLs = [];
//       result.forEach(element => {
//         photoURLs.push(element['urls']['raw']);
//       });
//       console.log(photoURLs);
//   } else {
//       console.log("Photos error:" + err);
//   }
//   });

  