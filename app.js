//Express Local server 
var express = require('express');
var app = express();
const request = require('request');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('../index', {condition: condition, unsplashData: unsplashData});
  //dom manipulation, you need to somehow load jquery or the document
  
  
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
  //use condition.temp and condition.text
  console.log('The current weather is ' + condition.temp + ' degrees. Its ' + condition.text +'.');    
});

//background starter
// const request = require('request');

var apiKey = "client_id=fe7c436b0f520f6477593a26ea6222f5fc548eb6871ddea682184e753182e0e0";
var reqURL = 'https://api.unsplash.com/photos/random?featured=true&count=5&'+apiKey;


var unsplashData = {
    photoURLs: [],
    orgColor: [],
    oppColor: [],
    name: [],
    userName: []
};

// var photoURLs = [];
// var orgColor = [];
// var oppColor = [];
// var unName = [];
// var unUsername = [];


request(reqURL, (err, response, body) => { 
  if (!err && response.statusCode === 200){
     // console.log(body); // show the page
      var result = JSON.parse(body); //this takes the response and changes it from a string to an object
      result.forEach(element => {
        unsplashData.photoURLs.push(element['urls']['raw']);
        unsplashData.orgColor.push(element['color']);
        unsplashData.oppColor.push(hexToComplimentary(element['color']));
        unsplashData.name.push(element['user']['name']);
        unsplashData.userName.push(element['user']['username']);
      });
      console.log(unsplashData);
  } else {
      console.log("Photos error:" + err);
  }
});


//Color Changer
/* hexToComplimentary : Converts hex value to HSL, shifts
 * hue by 180 degrees and then converts hex, giving complimentary color
 * as a hex value
 * @param  [String] hex : hex value  
 * @return [String] : complimentary color as hex value
 */
function hexToComplimentary(hex){

  // Convert hex to rgb
  // Credit to Denis http://stackoverflow.com/a/36253499/4939630
  var rgb = 'rgb(' + (hex = hex.replace('#', '')).match(new RegExp('(.{' + hex.length/3 + '})', 'g')).map(function(l) { return parseInt(hex.length%2 ? l+l : l, 16); }).join(',') + ')';

  // Get array of RGB values
  rgb = rgb.replace(/[^\d,]/g, '').split(',');

  var r = rgb[0], g = rgb[1], b = rgb[2];

  // Convert RGB to HSL
  // Adapted from answer by 0x000f http://stackoverflow.com/a/34946092/4939630
  r /= 255.0;
  g /= 255.0;
  b /= 255.0;
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2.0;

  if(max == min) {
      h = s = 0;  //achromatic
  } else {
      var d = max - min;
      s = (l > 0.5 ? d / (2.0 - max - min) : d / (max + min));

      if(max == r && g >= b) {
          h = 1.0472 * (g - b) / d ;
      } else if(max == r && g < b) {
          h = 1.0472 * (g - b) / d + 6.2832;
      } else if(max == g) {
          h = 1.0472 * (b - r) / d + 2.0944;
      } else if(max == b) {
          h = 1.0472 * (r - g) / d + 4.1888;
      }
  }

  h = h / 6.2832 * 360.0 + 0;

  // Shift hue to opposite side of wheel and convert to [0-1] value
  h+= 180;
  if (h > 360) { h -= 360; }
  h /= 360;

  // Convert h s and l values into r g and b values
  // Adapted from answer by Mohsen http://stackoverflow.com/a/9493060/4939630
  if(s === 0){
      r = g = b = l; // achromatic
  } else {
      var hue2rgb = function hue2rgb(p, q, t){
          if(t < 0) t += 1;
          if(t > 1) t -= 1;
          if(t < 1/6) return p + (q - p) * 6 * t;
          if(t < 1/2) return q;
          if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
      };

      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;

      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
  }

  r = Math.round(r * 255);
  g = Math.round(g * 255); 
  b = Math.round(b * 255);

  // Convert r b and g values to hex
  rgb = b | (g << 8) | (r << 16); 
  return "#" + (0x1000000 | rgb).toString(16).substring(1);
}  
  