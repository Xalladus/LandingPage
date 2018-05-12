//Express Local server 
var express = require('express');
var app = express();
const request = require('request');
var bodyParser = require('body-parser');
require('dotenv').config({path: 'dotenv/process.env'}); //loads the environment variables
const requestIp = require('request-ip'); // gathers the ip address

//Site specific variables
var oppColorChange = require('./js/oppColorChange.js');
var defaultImg ={url: "https://images.unsplash.com/photo-1510519138101-570d1dca3d66?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=45fbe9046945ce711c299b8c6d26d998&auto=format&fit=crop&w=1931&q=80",
                name: "Nikita Kachanovsky",
                link:"https://unsplash.com/@nkachanovskyyy"};



app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname));
app.set('views', "views");
app.set('view engine', 'ejs');


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
        locateClient = await getLoc(newIp); //Get the lat and long for the client
    } catch (err){
        console.log(err);
    }
    //--------------------  
    let condition 
    try {
        condition = await getWeather(locateClient); //Get the weather data 
    } catch (err){
        console.log(err);
    }
    res.render('../index', {condition: condition, unsplashData: unsplashData, quote: quote});    
});

//Start the server on port 3000
app.listen(3000, function () {
    console.log('Example app listening at http://127.0.0.1:3000/');
  });



//Returns a new local IP, using a regular callback, nothing fancy here
//-----------------------------------------------------------------------------
let scrubIp = function(ip){
    return new Promise((resolve, reject)=> {
        if (ip === "::ffff:127.0.0.1" || "127.0.0.1"){
            console.log("You are in local environment");
            ip = "129.7.135.130";//Forced in for testing, goes to Houston.
        } else if (ip === null) {
            reject(new Error("IP address was null"));
        }
        resolve(ip);
    })
    
}
//Creating a function with a Promise callback which should solve your issues
//-----------------------------------------------------------------------------
let getLoc = function(ip){
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
let getWeather = function (data) {
    return new Promise((resolve, reject)=>{
        let weatherData = {
            city: data.city,
            region: data.region_code,
            locale: data.city +", "+data.region_code,
            lat: data.latitude, 
            long: data.longitude,
            exclusions: "?units=si&exclude=minutely,hourly,daily,alerts,flags",
            temp: String,
            text: String,
        };

        //replace with call to darksy instead, using lat and long
        var darkSkyURL = "https://api.darksky.net/forecast/"+process.env.DARKSKYKEY+"/"+weatherData.lat+","+weatherData.long+weatherData.exclusions;
        request(darkSkyURL, (err, response, body) => { 
            if (!err && response.statusCode === 200) {
                console.log("DarkSky API loaded.");
                body = JSON.parse(body);
                weatherData.temp = Math.round( body.currently.temperature * 10 ) / 10;
                weatherData.text = body.currently.summary;
                resolve(weatherData);//return this data
                
            } else {
                console.log("DarkSky NOT loaded." + body);
                weatherData.temp = '23';
                weatherData.text = 'Room Temperature';
                weatherData.city = 'Inside';
                reject (weatherData);
            }
        })

    })
    
}   

//Unsplash API
//-----------------------------------------------------------------------------
var unsplashURL = 'https://api.unsplash.com/photos/random?featured=true&count=5&client_id='+process.env.UNSPLASHAPIKEY;
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

var quoteURL = "http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1";
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
        console.log("Quote API Loaded");
    } else {
        quote.text = "<p>Get off your ass, and sit down, and code!<p>";
        quote.author = "Conscious Voice"
        console.log("Quote " + err);
    }
});