//Express Local server 
var express = require('express');
var app = express();
const request = require('request');
var bodyParser = require('body-parser');
require('dotenv').config({path: 'dotenv/process.env'}); //loads the environment variables
//const requestIp = require('request-ip'); // gathers the ip address

//Site specific variables
var YQL = require('yql');
var oppColorChange = require('./js/oppColorChange.js');
var defaultImg ={url: "https://images.unsplash.com/photo-1510519138101-570d1dca3d66?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=45fbe9046945ce711c299b8c6d26d998&auto=format&fit=crop&w=1931&q=80",
                name: "Nikita Kachanovsky",
                link:"https://unsplash.com/@nkachanovskyyy"};



app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname));
app.set('views', "views");
app.set('view engine', 'ejs');

// Add the find location middleware before starting the server - works
// const ipMiddleware = function(req, res, next) {
//     console.log("In ipMiddleware");
//     req.clientIp = requestIp.getClientIp(req);
//     next();
// }
//app.use(ipMiddleware);


//Creating location middleware that takes the IP address and find the location info
//attaching to the req object DOES NOT WORK - no middleware! 

// Route the user to the index file when / is visited
app.get('/', function (req, res) {
    //create the index page
    res.render('../index', {condition: condition, unsplashData: unsplashData, quote: quote});
});

//Start the server on port 3000
app.listen(3000, function () {
    console.log('Example app listening at http://127.0.0.1:3000/');
  });

//IP Location API function 

// var getLoc = function (ip){
//     if (ip === "::ffff:127.0.0.1" || "127.0.0.1"){
//         console.log("You are in local environment");
//         ip = "73.166.205.170";
//     }
//     var ipStackURL = "http://api.ipstack.com/"+ip+"?access_key="+process.env.IPSTACKKEY;
//     request(ipStackURL, (err, response, body) => {
//         if(!err && response.statusCode === 200){
//             console.log("IpStack API Loaded");
//             var results = JSON.parse(body);//success getting data
//             return results;
//             //req.city = results.city;
//             // req.region = results.region_code;
//             // req.locale = results.city + ", " + results.region_code;//get the locale text
//             // req.lat = results.latitude;
//             // req.long = results.logitude;
//         } else {
//             console.log("IpStack " + err);
//         }
//     });
//     console.log(reqres);
// }

//Weather API 
//-----------------------------------------------------------------------------
var query = "select item.condition from weather.forecast where u='c' and woeid in (select woeid from geo.places where text='Houston, TX')";
var weatherQuery = new YQL(query); 
var condition = {
    temp: String,
    text: String,
    city: String
}
var getWeather =  weatherQuery.exec(function(err, data) {
    if(!err){
        condition.temp = data.query.results.channel[0].item.condition.temp;
        condition.text = data.query.results.channel[0].item.condition.text;
        condition.city = "Houston";
        console.log('Weather API loaded: ' + condition.temp + ' degrees.');  
    } else {
        console.log("Weather "+err); 
        condition.temp = '23';
        condition.text = 'Room Temperature';
        condition.city = 'Inside';
    }
});


//Unsplash API
//-----------------------------------------------------------------------------

//var apiKeyUnsplash = "fe7c436b0f520f6477593a26ea6222f5fc548eb6871ddea682184e753182e0e0";
//export UNSPLASHAPIKEY environment variable
var unsplashURL = 'https://api.unsplash.com/photos/random?featured=true&count=5&client_id=XXX'+process.env.UNSPLASHAPIKEY;
// this variable is sent back to the index file
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
      console.log("Photo's API loaded");
  } else {
      unsplashData.photoURLs.push(defaultImg.url);
      unsplashData.name.push(defaultImg.name);
      unsplashData.userLink.push(defaultImg.link);
      console.log("Photos Error: " + err);
  }
});

//Quote API
//-----------------------------------------------------------------------------

var quoteURL = "http://XXXquotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1";
// this variable is sent back to the index file
var quote = {
    author: String,
    text: String
};

request(quoteURL, (err, response, body) => {
    if(!err && response.statusCode === 200){
        var result = JSON.parse(body);
        quote.author = result[0].title;
        quote.text = result[0].content;
        //Scrub the p tags off of the received quote
        // var arr = quote.text.split("");
        // arr.splice(0, 3);
        // arr.splice(-6);
        // quote.text = arr.join("");
        console.log("Quote API Loaded");
    } else {
        quote.text = "<p>Get off your ass, and sit down, and code!<p>";
        quote.author = "Conscious Voice"
        console.log("Quote " + err);
    }
});


 
  