var usedNums = new Array(79);
var calledNums = [];
var numCalled = []
var color = ["rgba(10, 255, 10, .75)", "rgba(0,0,0,.75)"];
var currentColor = "rgba(0,0,0,.75)";
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
               $("#line").show();
               $("#playButton").show();
               $("#bingo").show();
               $("#fourCorners").show();
               $("#notYet").show();
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
               $("#line").show();
               //$("#numberGenerator").show();
               $("#playButton").show();
               $("#bingo").show();
               $("#notYet").show();
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

   $("#postageStamp1").click(function(){
      var count = 0;
      for(var i = 0; i < calledNums.length; i++){
         if(usedNums[calledNums[i]]){
            if(calledNums[i] == document.getElementById("square0").innerHTML){count++;}
            else if(calledNums[i] == document.getElementById("square1").innerHTML){count++;}
            else if(calledNums[i] == document.getElementById("square5").innerHTML){count++;}
            else if(calledNums[i] == document.getElementById("square6").innerHTML){count++;}
         }
      }
      if(count == 4){$("#postageStampWin1").show();}
      else{$("#notFinishedPostageStamp").show();}    
   })

   $("#postageStamp2").click(function(){
      var count = 0;
      for(var i = 0; i < calledNums.length; i++){
         if(usedNums[calledNums[i]]){
            if(calledNums[i] == document.getElementById("square3").innerHTML){count++;}
            else if(calledNums[i] == document.getElementById("square4").innerHTML){count++;}
            else if(calledNums[i] == document.getElementById("square8").innerHTML){count++;}
            else if(calledNums[i] == document.getElementById("square9").innerHTML){count++;}
         }
      }
      if(count == 4){$("#postageStampWin2").show();}
      else{$("#notFinishedPostageStamp2").show();}
   })
   $("#postageStamp3").click(function(){
      var count = 0;
      for(var i = 0; i < calledNums.length; i++){
         if(usedNums[calledNums[i]]){
            if(calledNums[i] == document.getElementById("square14").innerHTML){count++;}
            else if(calledNums[i] == document.getElementById("square15").innerHTML){count++;}
            else if(calledNums[i] == document.getElementById("square19").innerHTML){count++;}
            else if(calledNums[i] == document.getElementById("square20").innerHTML){count++;}
         }
      }
      if(count == 4){$("#postageStampWin3").show();}
      else{$("#notFinishedPostageStamp3").show();}    
   })    


 /*        else if(usedNums[calledNums[i]]){
            if(calledNums[i] == document.getElementById("square3").innerHTML){
               count++;
            }
            else if(calledNums[i] == document.getElementById("square4").innerHTML){
               count++;
            }
            else if(calledNums[i] == document.getElementById("square8").innerHTML){
               count++;
            }
            else if(calledNums[i] == document.getElementById("square9").innerHTML){
               count++;
            }
         }
         else if(usedNums[calledNums[i]]){
            if(calledNums[i] == document.getElementById("square14").innerHTML){
               count++;
            }
            else if(calledNums[i] == document.getElementById("square15").innerHTML){
               count++;
            }
            else if(calledNums[i] == document.getElementById("square19").innerHTML){
               count++;
            }
            else if(calledNums[i] == document.getElementById("square20").innerHTML){
               count++;
            }
         }
         else if(usedNums[calledNums[i]]){
            if(calledNums[i] == document.getElementById("square17").innerHTML){
               count++;
            }
            else if(calledNums[i] == document.getElementById("square18").innerHTML){
               count++;
            }
            else if(calledNums[i] == document.getElementById("square22").innerHTML){
               count++;
            }
            else if(calledNums[i] == document.getElementById("square23").innerHTML){
               count++;
            }
         }
      }*/
   $("#fourCorners").click(function(){
      var count = 0;
      for(var i = 0; i < calledNums.length; i++){
         if(usedNums[calledNums[i]]){
            if(calledNums[i] == document.getElementById("square0").innerHTML){count++;}
            else if(calledNums[i] == document.getElementById("square19").innerHTML){count++;}
            else if(calledNums[i] == document.getElementById("square23").innerHTML){count++;}
            else if(calledNums[i] == document.getElementById("square4").innerHTML){count++;}
         }
      }
      if(count == 4){$("#fourCornerWin").show();}
      else{$("#notFinished4Corners").show();}    
   })

   $("#line").click(function(){
      var count = 0;
      for(var i = 0; i < usedNums.length; i ++){
         if(usedNums[i]==document.getElementById("square0").innerHTML) count++;
         if(usedNums[i]==document.getElementById("square1").innerHTML) count++;
         if(usedNums[i]==document.getElementById("square2").innerHTML) count++;
         if(usedNums[i]==document.getElementById("square3").innerHTML) count++;
         if(usedNums[i]==document.getElementById("square4").innerHTML) count++;
      }

      for(var i = 0; i < usedNums.length; i ++){
         if(usedNums[i]==document.getElementById("square5").innerHTML) count++;
         if(usedNums[i]==document.getElementById("square6").innerHTML) count++;
         if(usedNums[i]==document.getElementById("square7").innerHTML) count++;
         if(usedNums[i]==document.getElementById("square8").innerHTML) count++;
         if(usedNums[i]==document.getElementById("square9").innerHTML) count++;
      }

      for(var i = 0; i < usedNums.length; i ++){
         if(usedNums[i]==document.getElementById("square10").innerHTML) count++;
         if(usedNums[i]==document.getElementById("square11").innerHTML) count++;
         if(usedNums[i]==document.getElementById("square12").innerHTML) count++;
         if(usedNums[i]==document.getElementById("square13").innerHTML) count++;
      }

      for(var i = 0; i < usedNums.length; i ++){
         if(usedNums[i]==document.getElementById("square14").innerHTML) count++;
         if(usedNums[i]==document.getElementById("square15").innerHTML) count++;
         if(usedNums[i]==document.getElementById("square16").innerHTML) count++;
         if(usedNums[i]==document.getElementById("square17").innerHTML) count++;
         if(usedNums[i]==document.getElementById("square18").innerHTML) count++;
      }

      for(var i = 0; i < usedNums.length; i ++){
         if(usedNums[i]==document.getElementById("square19").innerHTML) count++;
         if(usedNums[i]==document.getElementById("square20").innerHTML) count++;
         if(usedNums[i]==document.getElementById("square21").innerHTML) count++;
         if(usedNums[i]==document.getElementById("square22").innerHTML) count++;
         if(usedNums[i]==document.getElementById("square23").innerHTML) count++;
      }

      if(count == 4){
         console.log("you got a line");
         $("#linewin").show();
      }
      else{
         console.log("You dont have a line");
         $("#notline").show();
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
      socket.emit("startPlaying");
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
function changeColor(){
   $(document).on("click","#mytable tbody td", function(e){
      if($(this).css("background-color", color) == color[0]){
         $(this).css("background-color", color[1]);
      }
      else if($(this).css("background-color",color) == color[1]){
         $(this).css("background-color", color[0]);
      }
   });
}
function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}
function clickHandler(){
   $(document).on("click","#mytable tbody td", function(e){
      changeColor();
      console.log($(this).css("background-color", color));
      console.log(e.target.innerHTML);
   });
}
function makeCard(i){
   var c = "<table class= \"bingoCard\"><thead><tr><th width=\"20%\">B</th><th width=\"20%\">I</th><th width=\"20%\">N</th><th width=\"20%\">G</th><th width=\"20%\">O</th></tr></thead><tbody><tr><td id=\"square0\">&nbsp;</td><td id=\"square1\">&nbsp;</td><td id=\"square2\">&nbsp;</td><td id=\"square3\">&nbsp;</td><td id=\"square4\">&nbsp;</td></tr><tr><td id=\"square5\">&nbsp;</td><td id=\"square6\">&nbsp;</td><td id=\"square7\">&nbsp;</td><td id=\"square8\">&nbsp;</td><td id=\"square9\">&nbsp;</td></tr><tr><td id=\"square10\">&nbsp;</td><td id=\"square11\">&nbsp;</td><td id=\"free\">Free</td><td id=\"square12\">&nbsp;</td><td id=\"square13\">&nbsp;</td></tr><tr><td id=\"square14\">&nbsp;</td><td id=\"square15\">&nbsp;</td><td id=\"square16\">&nbsp;</td><td id=\"square17\">&nbsp;</td><td id=\"square18\">&nbsp;</td></tr><tr><td id=\"square19\">&nbsp;</td><td id=\"square20\">&nbsp;</td><td id=\"square21\">&nbsp;</td><td id=\"square22\">&nbsp;</td><td id=\"square23\">&nbsp;</td></tr></tbody></table>"
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

