//Express Local server 
const  express = require('express');
const  app = express();
const request = require('request');
const  bodyParser = require('body-parser');
require('dotenv').config({path: 'dotenv/process.env'}); //loads the environment variables
const requestIp = require('request-ip'); // gathers the ip address
const session = require('express-session');
//const cookieParser = require('cookie-parser');
const oppColorChange = require('./js/oppColorChange.js');// This is a small function that handles the main color of the provided images

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname));
//app.use(cookieParser());
app.use(session(    {secret:process.env.KEY,
                    name: "Photos Cookie",
                    saveUninitialized:true,
                    resave:true,
                    cookie:{maxAge: 3600000}}));
app.set('views', "views");
app.set('view engine', 'ejs');
app.set('port', (process.env.PORT || 5000));

// Route the user to the index file when / is visited
app.get('/', async function (req, res) { //makes the callback function an async function
    try{
        //These series of Promises are processed sequentially
        const clientIp = await requestIp.getClientIp(req); // gets the IP address
        const newIp = await scrubIp(clientIp);// change Ip address if local
        const locateClient = await getLoc(newIp); //Get the lat and long for the client
        condition = await getWeather(locateClient); //Get the weather data
        quote = await getQuote();//Get the quote
        if (req.session.photos) {
            //pass the existing session data to the application
            photos = req.session.photos;
            console.log("Photos loaded from Cookies");
        } else {
            photos = await getPhotos();//Get background images
            req.session.photos = photos;//put the photo information into the session.
        }   
    } catch (err){
        console.log(err); //This crashes the entire app
    }
    
    res.render('../index', {condition: condition, unsplashData: photos, quote: quote});    
});

//Start the server on port ...
app.listen(app.get('port'), ()=> {
    console.log("Node app is running at localhost:" + app.get('port'))
  })

//Returns a new local IP, not an API
//If this node somehow gets rejected then the entire page will not load. HANDLE ERROR BETTER
//-----------------------------------------------------------------------------
const scrubIp = (ip)=> {
    return new Promise((resolve, reject)=> {
        console.log("Initial IP: " + ip);
        ipLength = ip.split("").length - 7;
        delPrefix = ip.split("").splice(7, ipLength).join("");
        console.log("New IP: " + delPrefix);
        //convert the ip address into an array
        if (delPrefix === "::ffff:127.0.0.1" || "127.0.0.1"){
            console.log("You are in local environment");
            delPrefix = "129.7.135.130";//Forced in for testing, goes to Houston.
        } else if (delPrefix === null) {
            reject(new Error("IP address was null."));
        } 
        resolve(delPrefix);
    })
}

/////////////////////////////////////////
//               API's                 //
/////////////////////////////////////////

//Location (IPStack) API: Get location data based on the ip address that you supply
//-----------------------------------------------------------------------------
const getLoc = (ip)=> {
    return new Promise((resolve, reject)=>{
        const ipStackURL = "http://api.ipstack.com/"+ip+"?access_key="+process.env.IPSTACKKEY;
        request(ipStackURL, (err, response, body) => {
            if (!err && response.statusCode === 200 && !JSON.parse(body).error) {
            } else {
                console.log("IP Stack get location Error: " + body);
            }
            resolve(JSON.parse(body));//return this data
        })
    })
}

//Weather (DarkSky) API: Gets detailed weather data based on the lat and long coordinates you supply
//-----------------------------------------------------------------------------
const getWeather = (data)=> {
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
        const darkSkyURL = "https://api.darksky.net/forecast/"+process.env.DARKSKYKEY+"/"+weatherData.lat+","+weatherData.long+weatherData.exclusions;
        request(darkSkyURL, (err, response, body) => { 
            if (!err && response.statusCode === 200) {
                console.log("DarkSky API loaded.");
                body = JSON.parse(body);
                weatherData.temp = Math.round( body.currently.temperature * 10 ) / 10;
                weatherData.text = body.currently.summary;
                
            } else {
                console.log("Weather Error: " + body);
                weatherData.temp = '23';
                weatherData.text = 'Room Temperature';
                weatherData.city = 'Inside';
                //reject (weatherData); // this line would crash the app, im essentially handling the error with fake data
            }
            resolve(weatherData);
        })
    })   
}   

//Photo (Unsplash) API: Gets the background images you are using on this site
//-----------------------------------------------------------------------------
const getPhotos = ()=> {
    return new Promise((resolve, reject)=>{
        const  defaultImg ={url: "assets/img/lampLitDesk.jpg", name: "Nikita Kachanovsky", link:"https://unsplash.com/@nkachanovskyyy"};
        const unsplashURL = 'https://api.unsplash.com/photos/random?featured=true&count=5&client_id='+process.env.UNSPLASHAPIKEY;
        let unsplashData = {
            photoURLs: [],
            orgColor: [],
            oppColor: [],
            name: [],
            userLink: []
        };
        request(unsplashURL, (err, response, body) => { 
            if (!err && response.statusCode === 200){
               // console.log(body); // show the page
                body = JSON.parse(body); //this takes the response and changes it from a string to an object
                body.forEach(element => {
                    unsplashData.photoURLs.push(element['urls']['full']);
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
                console.log("Photos Error: " + body);
            }
            resolve(unsplashData);//This returns the data collected as the promise response
        });
    });
}

//Quote (quotesondesign) API: Gets a random quote 
//-----------------------------------------------------------------------------
const getQuote = ()=> {
    return new Promise((resolve, reject)=>{
        const quoteURL = "http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1";
        // this variable is sent back to the index file
        let quoteData = {
            author: String,
            text: String
        };
        request(quoteURL, (err, response, body) => {
            if(!err && response.statusCode === 200){
                var result = JSON.parse(body);
                quoteData.author = result[0].title;
                quoteData.text = result[0].content;
                console.log("Quote API Loaded");
            } else {
                quoteData.text = "<p>Get off your ass, and sit down, and code!<p>";
                quoteData.author = "Conscious Voice"
                console.log("Quote " + err);
            }
            resolve(quoteData);
        });
    })
}