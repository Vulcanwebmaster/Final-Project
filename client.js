var usedNums = new Array(79);
var calledNums = [];
var numCalled = []
var color = "rgba(10, 255, 10, .75)";
var socket = io();

socket.on("updateUsers", function(usernames){
   $("#listOfUsers").html("");
   for(i in usernames){
      $("#listOfUsers").append(usernames[i]+"<br>");
   }
});
function initAll() {
   $("#loginForm").submit(function(event){
      //encrypt password
      if($("#username").val() != "" && $("#password").val()!=""){
         socket.emit("setUsername", $("#username").val(), $("#password").val(), function(loginSuccessful){
            if(loginSuccessful===true){
               $("#Login").hide();
               $("#bingoCard").show();
               $("#cardSelector").show();
               $("#userScreen").show();
               //$("#numberGenerator").show();
               $("#playButton").show();
               $("#bingo").show();
               $("#postageStamp").show();
               $("#fourCorners").show();
            }
            else{
               $("#userpass").show();
            }
            $("#username").val("");
         });
         
      }
      else{
         console.log("Please complete the form correctly");
         $("#badform").show();
      } 
      event.preventDefault();
   });

   $("#newUser").click(function(){
      $("#register").show();
      $("#Login").hide();
   });

   $("#registerForm").submit(function(event){
      //encrypted password to the db
      if($("#newUsername").val() != "" && $("#newPassword").val()!=""){
         socket.emit("checkUser", $("#newUsername").val(), function(loginSuccessful){
            if(loginSuccessful===true){
               $("#Login").hide();
               $("#register").hide();
               $("#bingoCard").show();
               $("#cardSelector").show();
               $("#userScreen").show();
               //$("#numberGenerator").show();
               $("#playButton").show();
               $("#bingo").show();
               $("#postageStamp").show();
               $("#fourCorners").show();
               socket.emit("addUser", $("#newUsername").val(), $("#newPassword").val());
            }
            else{
               $("#userexists").show();
            }
         });
         
      }
      else{
         console.log("Please complete the form correctly");
         $("#abadform").show();
      } 
      event.preventDefault();
   });

   $("#getCards").click(function(){
      console.log($("#selection option:selected").val());
      $("#mytable").html("");
 //   pageBreaks = 'on';
      for(var i = 1; i <= $("#selection option:selected").val(); i ++){
         console.log("Creating card number " + i);
         makeCard(i);
         anotherCard();
      }
   });
   
   $(getRandNumDisplayed);
   $(clickHandler);
   
   $("#bingo").click(function(){
      var count = 0;
      for(var i = 0; i < calledNums.length; i ++){
         if(usedNums[calledNums[i]]){
            count++;
         }
         
      }
      if(count == 24){
         console.log("We have a winner, " + username + "won the game");
         $("#win").show();
      }      
      else{
         console.log("You don't have a bingo yet... keep playing");
         $("#keepplaying").show();
      }
   })

   $("#postageStamp").click(function(){
      for(var i = 0; i < calledNums.length; i++){
         if(usedNums[calledNums[i]]){
            if(($("#square0").css("background-color", color)) && ($("#square1").css("background-color",color)) && ($("#square5").css("background-color",color)) && ($("#square6").css("background-color", color))){
               $("#postageStampWin").show();
               console.log(document.getElementById("#square0"));
            }
            else if(($("#square3").css("background-color", color)) && ($("#square4").css("background-color",color)) && ($("#square8").css("background-color",color)) && ($("#square9").css("background-color", color))){
               $("#postageStampWin").show();
            }
            else if(($("#square14").css("background-color", color)) && ($("#square15").css("background-color",color)) && ($("#square19").css("background-color",color)) && ($("#square20").css("background-color", color))){
               $("#postageStampWin").show();
            }
            else if(($("#square17").css("background-color", color)) && ($("#square18").css("background-color",color)) && ($("#square22").css("background-color",color)) && ($("#square23").css("background-color", color))){
               $("#postageStampWin").show();
            }
            else{
               $("#notFinishedPostageStamp").show();
            }      
         }
      }
   })
   $("#fourCorners").click(function(){
      var count = 0;
      console.log(typeof(String(document.getElementById("square0"))));
      
      for(var i = 0; i < calledNums.length; i++){
         //console.log("type of calledNums: "+typeof(calledNums[i]));
         console.log("type of doc: "+typeof((document.getElementById("square0"))));
         console.log("called num: "+calledNums[i]);
         //console.log("doc num: "+String(document.getElementById("square0").val()));
         if(usedNums[calledNums[i]]){
            if(calledNums[i] == document.getElementById("square0").innerHTML){
               console.log("in");
               count++;
               //console.log("A = " + ($("square0").css("background-color")));
               //console.log("B = " + color);
            }
            else if(calledNums[i] == document.getElementById("square19").innerHTML){
               console.log("in");
               count++;
            }
            else if(calledNums[i] == document.getElementById("square23").innerHTML){
               console.log("in");
               count++;
            }
            else if(calledNums[i] == document.getElementById("square4").innerHTML){
               console.log("in");
               count++;
            }
         }
         console.log(count);
         //
      }
      
      if(count == 4){
         $("#fourCornerWin").show();
         
         console.log("You have 4 coners");
      }
      else{
         $("#notFinished4Corners").show();
            //console.log(document.getElementById("square0"));
         //console.log("NAH DAWG");
            //var value = document.getElementById("square0").val();
            //console.log(value);
      } 
       
   })

   $("#seeLeaderboard").click(function(){
      $("#container").show();
      $("#Login").hide();
      $("#register").hide();
      $("#seeLeaderboard").hide();
   })

}

function getRandNumDisplayed(){
   //trying to make the random number generator work from teh server side once the play button is clicked
   $("#play").click(function(){
      $("#numberGenerator").show();
      $("#play").hide();
      var bingo = {
         selectedNumbers: [],
         generateRandom: function() {
            var min = 1;
            var max = 79;
            var random = Math.floor(Math.random() * (max - min + 1)) + min;
            return random;
         },
         generateNextRandom: function() {
            if (bingo.selectedNumbers.length > 78) {
            alert("All numbers Exhausted");
            return 0;
            }
            var random = bingo.generateRandom();
            while ($.inArray(random, bingo.selectedNumbers) > -1) {
            random = bingo.generateRandom();
            }
            bingo.selectedNumbers.push(random);
            return random;
         }
      };
      
      $('.numbersTable td').each(function() {
         var concatClass = this.cellIndex + "" + this.parentNode.rowIndex;
         var numberString = parseInt(concatClass, 10).toString();
         $(this).addClass("cell" + numberString).text(numberString);
      });
      
      
      $('#btnGenerate').click(function() {
      //while(bingo.selectedNumbers.length <= 79){   
         var random = bingo.generateNextRandom().toString();
         //console.log(random);
         calledNums.push(random);
         $('.bigNumberDisplay span').text(random);
         $('.numbersTable td.cell' + random).addClass('selected');
         //sleep(1000);
      //}
      });
   });
}
function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}
function clickHandler(){
   $(document).on("click","#mytable tbody td", function(e){
      $(this).css("background-color", color);
      console.log(e.target.innerHTML);
   });
}
function makeCard(i){
   var c = "<table><thead><tr><th width=\"20%\">B</th><th width=\"20%\">I</th><th width=\"20%\">N</th><th width=\"20%\">G</th><th width=\"20%\">O</th></tr></thead><tbody><tr><td id=\"square0\">&nbsp;</td><td id=\"square1\">&nbsp;</td><td id=\"square2\">&nbsp;</td><td id=\"square3\">&nbsp;</td><td id=\"square4\">&nbsp;</td></tr><tr><td id=\"square5\">&nbsp;</td><td id=\"square6\">&nbsp;</td><td id=\"square7\">&nbsp;</td><td id=\"square8\">&nbsp;</td><td id=\"square9\">&nbsp;</td></tr><tr><td id=\"square10\">&nbsp;</td><td id=\"square11\">&nbsp;</td><td id=\"free\">Free</td><td id=\"square12\">&nbsp;</td><td id=\"square13\">&nbsp;</td></tr><tr><td id=\"square14\">&nbsp;</td><td id=\"square15\">&nbsp;</td><td id=\"square16\">&nbsp;</td><td id=\"square17\">&nbsp;</td><td id=\"square18\">&nbsp;</td></tr><tr><td id=\"square19\">&nbsp;</td><td id=\"square20\">&nbsp;</td><td id=\"square21\">&nbsp;</td><td id=\"square22\">&nbsp;</td><td id=\"square23\">&nbsp;</td></tr></tbody></table>"
   $("#mytable").append(c);
}
//fix this
function newCard(whichCard) {
     for (var i=0; i<24; i++) {
        setSquare(i);
     }
}
//fix this
function setSquare(thisSquare, whichCard) {
     var currSquare = "square" + thisSquare;
     var colPlace = new Array(0,1,2,3,4,0,1,2,3,4,0,1,3,4,0,1,2,3,4,0,1,2,3,4);
     var colBasis = colPlace[thisSquare] * 15;
     var newNum;

     do {
        newNum = colBasis + getNewNum() + 1;
        //console.log(newNum);
     }
     while (usedNums[newNum]);

     usedNums[newNum] = true;
     document.getElementById(currSquare). innerHTML = newNum;
}
function getNewNum() {
     return Math.floor(Math.random() * 15);
}
function anotherCard() {
     for (var i=1; i<usedNums.length; i++) {
        usedNums[i] = false;
     }

     newCard();
     return false;
}
$(initAll);

//new user gets 2000 money
//every card costs 100 money
//all of the money goes into the pool

