//Express Local server 
var express = require('express');
var app = express();
const request = require('request');
var bodyParser = require('body-parser');
var oppColorChange = require('./js/oppColorChange.js');
var defaultImg ={url: "https://images.unsplash.com/photo-1496003537615-40de4d373d18?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=cc05ad203446836b834ee8b944341c5b&auto=format&fit=crop&w=1950&q=80",
                name: "Ara Ghafoory",
                link:"https://unsplash.com/@araghafoory"};

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname));
app.set('views', "views");
app.set('view engine', 'ejs');



app.get('/', function (req, res) {
  res.render('../index', {condition: condition, unsplashData: unsplashData, quote: quote});
  //dom manipulation, you need to somehow load jquery or the document
});

app.listen(3000, function () {
  console.log('Example app listening at http://127.0.0.1:3000/');
});

//Weather API from Yahoo! 
//-----------------------------------------------------------------------------
var YQL = require('yql');
var query = new YQL("select item.condition from weather.forecast where u='c' and woeid=12590119");
var condition;
 //run the main weather query
 query.exec(function(err, data) {
  condition = data.query.results.channel.item.condition;
  //use condition.temp and condition.text
  console.log('The current weather is ' + condition.temp + ' degrees. Its ' + condition.text +'.');    
});

//Unsplash API
//-----------------------------------------------------------------------------

//var apiKeyUnsplash = "fe7c436b0f520f6477593a26ea6222f5fc548eb6871ddea682184e753182e0e0";
//export UNSPLASHAPIKEY environment variable
var unsplashURL = 'https://api.unsplash.com/photos/random?featured=true&count=5&client_id='+process.env.UNSPLASHAPIKEY;

var unsplashData = {
    photoURLs: [],
    orgColor: [],
    oppColor: [],
    name: [],
    userLink: []
};


request(unsplashURL, (err, response, body) => { 
  if (!err && response.statusCode === 200){
     // console.log(body); // show the page
      var result = JSON.parse(body); //this takes the response and changes it from a string to an object
      result.forEach(element => {
        unsplashData.photoURLs.push(element['urls']['raw']);
        unsplashData.orgColor.push(element['color']);
        unsplashData.oppColor.push(oppColorChange.hexToComplimentary(element['color']));
        unsplashData.name.push(element['user']['name']);
        unsplashData.userLink.push(element['links']['html']);
      });
      console.log(unsplashData.photoURLs);
  } else {
      unsplashData.photoURLs.push(defaultImg.url);
      unsplashData.name.push(defaultImg.name);
      unsplashData.userLink.push(defaultImg.link);
      console.log("Photos error:" + err);
  }
});

//Quote API
//-----------------------------------------------------------------------------

var quoteURL = "http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1";
var quote = {
    author: String,
    text: String
};

request(quoteURL, (err, response, body) =>{
    if(!err && response.statusCode === 200){
        var result = JSON.parse(body);
        quote.author = result[0].title;
        quote.text = result[0].content;
        //Scrub the p tags off of the received quote
        // var arr = quote.text.split("");
        // arr.splice(0, 3);
        // arr.splice(-6);
        // quote.text = arr.join("");
        console.log(quote);
    } else {
        console.log("Quote error:" + err);
    }
});


 
  