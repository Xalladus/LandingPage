(function () {
    "use strict";
    
    function init () {
        clock();
        setInterval(clock, 10000);
        greeting();
    };

    //Create the clock
    function clock() {// We create a new Date object and assign it to a variable called "time".
        var time = new Date(),
            // Access the "getHours" method on the Date object with the dot accessor.
            hours = time.getHours(),
            // Access the "getMinutes" method with the dot accessor.
            minutes = time.getMinutes();

            //Select the time class and display the hours and minutes
        $("#time")[0].innerHTML = addZero(hours) + ":" + addZero(minutes);
    
        //Add zero in from of any single digit time
        function addZero(num) {
            if (num < 10) {
            num = '0' + num;
            }
            return num;
        }
    }

    function greeting() {
        //Get the hour
        var time = new Date(),
            hour = time.getHours();
            
        //set a message based on the hour
        if (hour < 6) {
            $("#welcome-message")[0].innerHTML = "Working late again, Gregory.";
        } else if (hour > 5 && hour < 12){
            $("#welcome-message")[0].innerHTML = "Good morning, Gregory.";
        } else if (hour > 11 && hour < 17){
            $("#welcome-message")[0].innerHTML = "Good afternoon, Gregory."; 
        } else if (hour > 16 && hour < 21){
            $("#welcome-message")[0].innerHTML = "Welcome, Gregory.";
        } else if (hour > 20 && hour < 24){
            $("#welcome-message")[0].innerHTML = "Good evening, Gregory.";
        }
    }

    //This starts the init function up and running. 
	$(document).ready(init());
	//Final bracket
}());