//Express Local server 
var express = require('express');
var app = express();
const request = require('request');
var bodyParser = require('body-parser');
require('dotenv').config({path: 'dotenv/process.env'}); //loads the environment variables
const requestIp = require('request-ip'); // gathers the ip address

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

//Add the find location middleware before starting the server - works
// const ipMiddleware = function(req, res, next) {
//     console.log("In ipMiddleware");
//     req.clientIp = requestIp.getClientIp(req);
//     next();
// }
// app.use(ipMiddleware);


//Creating location middleware that takes the IP address and find the location info
//attaching to the req object DOES NOT WORK - no middleware! 
// 1) You get the IP address from the client
// 2) You scrub the IP address and get a new one. 
// 3) Get the location based off of that IP address


// Route the user to the index file when / is visited
app.get('/', async function (req, res) { //makes the callback function an async function
    //-------------------- Works 
    let clientIp
    try{
        clientIp = await requestIp.getClientIp(req); // gets the IP address
    } catch (err){
        console.log(err);
    }
    //--------------------  
    let newIp
    try{
       newIp = await scrubIp(clientIp);// change Ip address if local
    } catch (err){
        console.log(err);
    }
    //---------------------
    let locateClient
    try {
        locateClient = await getLoc(newIp);
        //console.log(location); // works with the correct data being sent to the index page as well. 
    } catch (err){
        console.log(err);
    }
    //--------------------  
    let condition 
    try {
        condition = await getWeather(locateClient);
        console.log("Condition: "+condition);
    } catch (err){
        console.log(err);
    }
    //------------------------
    let resRender 
    try {
        res.render('../index', {condition: condition, unsplashData: unsplashData, quote: quote});
    } catch(err) {
        console.log(err); 
    }    
});

//Start the server on port 3000
app.listen(3000, function () {
    console.log('Example app listening at http://127.0.0.1:3000/');
  });


//Location Function
//Returns a new local IP, using a regular callback, nothing fancy here
var scrubIp = function(ip){
    if (ip === "::ffff:127.0.0.1" || "127.0.0.1"){
        console.log("You are in local environment");
        ip = "192.41.148.220";//Forced in for testing, goes to Canadian city.
    } else if (ip === null) {
        console.log("IP address was null");
    }
    return ip;
}

//Creating a function with a Promise callback which should solve your issues
var getLoc = function(ip){
    return new Promise((resolve, reject)=>{
        var ipStackURL = "http://api.ipstack.com/"+ip+"?access_key="+process.env.IPSTACKKEY;
        request(ipStackURL, (err, response, body) => {
            if (!err) {
                resolve(JSON.parse(body));//return this data
            } else {
                reject (err);
            }
        })
    })
}


//Weather API 
//-----------------------------------------------------------------------------
// var getWeather = function (data) {
//     return new Promise((resolve, reject)=>{
//         let weatherData = {
//             city: data.city,
//             region: data.region_code,
//             locale: data.city +", "+data.region_code,
//             lat: data.latitude, 
//             long: data.longitude,
//             temp: String,
//             text: String,
//             status: String
//         };
       
//         var query = "select item.condition from weather.forecast where u='c' and woeid in (select woeid from geo.places where text='Houston, TX')";
//         var weatherQuery = new YQL(query); 
//         var queryExec =  weatherQuery.exec(function(err, data) {
//             if(!err){
//                 console.log("DATA:" +JSON.parse(data));
//                 weatherData.temp = data.query.results.channel[0].item.condition.temp;
//                 weatherData.text = data.query.results.channel[0].item.condition.text;
//                 weatherData.status = "You got the weather!"
//                 resolve(weatherData);
//             } else {
//                 console.log("Weather err:" + err);
//                 weatherData.temp = '23';
//                 weatherData.text = 'Room Temperature';
//                 weatherData.city = 'Inside';
//                 weatherData.status = "You could not get the weather!"
//                 reject(weatherData);
//             }
//         })
//     })
    
// }
//Weather API 
//-----------------------------------------------------------------------------
var getWeather = function (data) {
    let weatherData = {
        city: data.city,
        region: data.region_code,
        locale: data.city +", "+data.region_code,
        lat: data.latitude, 
        long: data.longitude,
        temp: '23',
        text: 'Room Temperature',
        status: 'Yippie'
    };  
     return(weatherData);
    // var query = "select item.condition from weather.forecast where u='c' and woeid in (select woeid from geo.places where text='Houston, TX')";
    // var weatherQuery = new YQL(query); 
    // var queryExec =  weatherQuery.exec(function(err, data) {
    //         if(!err){
    //             console.log("DATA:" +data.query.results.channel[0].item.condition.temp);
    //             weatherData.temp = data.query.results.channel[0].item.condition.temp;
    //             weatherData.text = data.query.results.channel[0].item.condition.text;
    //             weatherData.status = "You got the weather!"
    //             return(weatherData);
    //         } else {
    //             console.log("Weather err:" + err);
    //             weatherData.temp = '23';
    //             weatherData.text = 'Room Temperature';
    //             weatherData.city = 'Inside';
    //             weatherData.status = "You could not get the weather!"
    //             return(weatherData);
    //         }
    // });
}
    

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


 
  