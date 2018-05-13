# Landing Page
This is a simple home page that displays the time, weather, image slideshow, and inspirational quote. The goal of this project was to make a landing page for opening new web browsing windows/tabs. This is an exercise in using API's.

## The Stack
I used Nodejs and Express primarily, and I did make a custom js file that changes the greeting message. I have used  the ES6 standards in my JS. I do not save any data to a server and I use a session to avoid making too many calls to my photo API. The transitions are all done in CSS. I have also used Bootstrap 4 and their flexbox grid system. 

## Error Handling.
Since this site is made up of API's I didn't want to break any functionality if there way an error. So if something fails to load for whatever reason there will be a replacement of it ready to go. The temperature will read a fake indoor temperature instead and the background image will load the 1 image from the server. 

## API's Used

### Weather
I have gone with the API DarkSky.net by the reccomendation of a friend, after struggling with Yahoo! - and it was much easier. This API allows 1000 calls per day. You must provide them with the longitude and latitude coordinates.

### IP and Location
In order to get the weather without needing to get the user to agree to me looking up their location I had to use a bit of a work around. First, I gathered the IP address using a Node package request-ip, then I took that address and put it into IP Stack API, as the response from them includes the lat. and long. data I need for the weather. This API allows 10,000 requests per month. 

### Quotes
I thought that it would be fun to have an inspirational message to get me motivated. This API is from QuotesOnDesign.com as they don't seem to have a limit to the amount of requests that you can make. Some of them have been pretty funny too. 

### Background Image Slider
For the images I had to go with Unsplash.com. They have the best images and in Demo mode they allow 50 requests per hour. I have followed the guidelines to allow for production limits, which ups that number to 5000/hour. I am retrieving 5 images as one request and then I store that in a session. 

## Future Improvements

### Text Color
At times the color of the images drown out the welcome message and quote. Unsplash did provide the primary colour of the images and I have an unused js file that has the ability to invert that colour. I am unsure if implementing this will actually fix the issue, or just make everything look worse. The time and weather have a backing which keeps them legible. 

### CSS
Given the small scope of this project I decided not to implement any CSS pre-processing.

### Naming
I have hard coded the welcome message to my name, but if this was for a wider audience, I would have people enter their own names. But this is really just for me.

### Mobile
The flexbox grid system does allow for some flexibility between different monitor sized, but it doesn't account for mobile. 
