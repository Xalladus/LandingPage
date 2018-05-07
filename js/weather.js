// (function () {
//     "use strict";
//     function init() {
//         //run the application
//     }

    const request = require('request'),
          YQL = require('yql');

    //var apiKey = 'dj0yJmk9aW9WN1hNcjNTWnk1JmQ9WVdrOVYwbG5lazFyTkc4bWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD0yNA--';
   // var reqURL = 'http://query.yahooapis.com/v1/public/yql?q=select * from geo.places where text="sunnyvale, ca"';
    var houston = 12590119;
    var query = new YQL('SELECT * FROM weather.forecast WHERE (location =' + houston + ')');

    //SELECT title,abstract FROM search.web WHERE query="pizza";
    //'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(' + houston + ')&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys'


    query.exec(function(err, data) {
        if(err){
            console.log("Something went wrong:" + err);
        } else {
            var location = data.query.results.channel.location;
            var condition = data.query.results.channel.item.condition;
            console.log('The current weather in ' + location.city + ', ' + location.region + ' is ' + condition.temp + ' degrees.');
        }
    });

    // request('', (err, response, body) => { 
    // if (!err && response.statusCode === 200){
    //     console.log(body); // show the page
    //     //JSON.parse(body); //this takes the response and changes it from a string to an object
    // } else {
    //     console.log("Something went wrong");
    // }
    // });

//     //This starts the init function up and running. 
// 	$(document).ready(init());
// //Final bracket
// }());