(function () {
  "use strict";
  const init = ()=> {
    loadFirst();
  }

  const loadFirst = ()=> {
    //Get the background image url of the first 
    let src = $('.slideshow li:nth-child(1)').css('background-image');
    let url = src.match(/\((.*?)\)/)[1].replace(/('|")/g,'');
    let img = new Image();
    img.src = url;
    img.onload = ()=> {
      //Once the image has loaded, start the slideshow
      startShow();
    }
    if (img.complete) img.onload(); // an extremely short if statement if(true) true();
  }

  const startShow = ()=> {
    //Add the animation class to the images
    $(".slideshow li").addClass("photoAnimate");
    // Add the preload class to the text loader
    $(".creditText li").addClass("textAnimate");
  }

  // const getColors = ()=> {
  //   let col = $('.slideshow li:nth-child(1) .invisible').css('color');
  //   console.log("Get color " +col);
  // }

   //This starts the init function up and running. 
    $(document).ready(init());
}());