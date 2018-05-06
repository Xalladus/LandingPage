// //Load HTTP module
// var http = require("http");

// //Create HTTP server and listen on port 8000 for requests
// http.createServer(function (request, response) {

//    // Set the response HTTP header with HTTP status and Content type
//    response.writeHead(200, {'Content-Type': 'text/plain'});
   
//    // Send the response body "Hello World"
//    response.end('Hello World\n');
// }).listen(8000);

// // Print URL for accessing server
// console.log('Server running at http://127.0.0.1:8000/');

var express = require('express');
var app = express();
app.set("view engine", "html");

app.get('/', function (req, res) {
  res.render('index');
})

app.listen(8000, function () {
  console.log('Example app listening at http://127.0.0.1:8000/');
})

// Set up the local server
//const http = require('http');
// const fs = require('fs');
// const hostname = '127.0.0.1';
// const port = 3000;

// fs.readFile('index.html', (err, html) => {
//     if(err){
//         throw err;
//     }
//     const server = http.createServer((req, res) => {
//         res.statusCode = 200;
//         res.setHeader('Content-type', 'text/html');
//         res.write(html);
//         res.end();
//     });
    
//     server.listen(port, hostname, () => {
//         console.log('Server started on port '+port);
//     });
// })

//=====================================================

// var request = require('request');
// request('http://www.google.com', function (error, response, body) {
//   console.log('error:', error); // Print the error if one occurred
//   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//   console.log('body:', body); // Print the HTML for the Google homepage.
// });