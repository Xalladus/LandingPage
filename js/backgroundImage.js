(function () {
  "use strict";
  const init = ()=> {
    loadFirst();
    //textColorRotate(getColors());
  }

  const loadFirst = ()=> {
    //Get the background image url of the first 
    let src = $(".slideshow li:nth-child(1)").css("background-image");
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
    // Start the text color rotater

  }

  
//---------------------------------------------------//
//Items below this point are not currently being used//
//---------------------------------------------------//
  const getColors = ()=> {
    //grabs the colors from the DOM, puts them in an array. 
    let colArr = [];
    $(".invisible").each(function(){
      colArr.push($(this).css("color"));
    });
    $(".invisible2").each(function(){
      colArr.push($(this).css("color"));
    });
    // get colors and change them to gradients, then 
    console.log("ColArr: "+ colArr);
    return colArr;
  }

  const textColorRotate = (cols)=> {
    //rotate now
    rotate(cols, 0);
    //after a 10 second delay, call timeRot
    setTimeout(function() { timeRot(cols, 2); }, 10000);
  }

  const timeRot = (cols, init)=>{
    //Rotate the color again
    rotate(cols, init);
    let track = init +2;
    //Change the color every 10 seconds. 
    setInterval(()=>{ 
      rotate(cols, track);
      track += 2;
      if (track === 10) track = 0;
    }, 10000);
  }

  const rotate = (cols, index)=> {
    $(".tColRot").animate({color: cols[index]}, 4000);
    $(".tColRot p").animate({color: cols[index]}, 4000);
    index++;

  }


   //This starts the init function up and running. 
    $(document).ready(init());
}());