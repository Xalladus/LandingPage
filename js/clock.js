(function () {
    "use strict";
    
    function init () {
        clock();
        setInterval(clock, 10000);
    };

    //Create the clock
    function clock() {// We create a new Date object and assign it to a variable called "time".
        var time = new Date(),
            // Access the "getHours" method on the Date object with the dot accessor.
            hours = time.getHours(),
            // Access the "getMinutes" method with the dot accessor.
            minutes = time.getMinutes();

        //Select the time class and display the hours and minutes
        $(".time")[0].innerHTML = addZero(hours) + ":" + addZero(minutes);
    
        //Add zero in from of any single digit time
        function addZero(num) {
            if (num < 10) {
            num = '0' + num;
            }
            return num;
        }
    }

    //This starts the init function up and running. 
	$(document).ready(init());
	//Final bracket
}());