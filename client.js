/*window.onload = initAll;*/
var usedNums = new Array(79);
var color = "rgba(10,255,10,.75)";
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
               $("#numberGenerator").show();
               $("#playButton").show();
            }
            $("#username").val("");
         });
         event.preventDefault();
      }
      else console.log("Please complete the form correctly");
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
               $("#numberGenerator").show();
               $("#playButton").show();
               socket.emit("addUser", $("#newUsername").val(), $("#newPassword").val());
            }
         });
         event.preventDefault();
      }
      else console.log("Please complete the form correctly");
   });

   $("#getCards").click(function(){
      console.log($("#selection option:selected").val());
      for(var i = 1; i <= $("#selection option:selected").val(); i ++){
         console.log("Creating card number " + i);
         makeCard(i);
         anotherCard();
      }
   });
   $(getRandNumDisplayed);
   $(clickHandler);
   //var bigNum = getRandNumDisplayed();
   //console.log(bigNum);
   //var clickedNum = clickHandler();
   //console.log(clickedNum);
}

function getRandNumDisplayed(){
   //trying to make the random number generator work from teh server side once the play button is clicked
   $("#play").click(function(){
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
         console.log(random);
         $('.bigNumberDisplay span').text(random);
         $('.numbersTable td.cell' + random).addClass('selected');
         return random;
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
      return e.target.innerHTML;
   });
}

function makeCard(i){
   $("#mytable").html("");
   var c = "<table><thead><tr><th width=\"20%\">B</th><th width=\"20%\">I</th><th width=\"20%\">N</th><th width=\"20%\">G</th><th width=\"20%\">O</th></tr></thead><tbody><tr><td id=\"square0\">&nbsp;</td><td id=\"square1\">&nbsp;</td><td id=\"square2\">&nbsp;</td><td id=\"square3\">&nbsp;</td><td id=\"square4\">&nbsp;</td></tr><tr><td id=\"square5\">&nbsp;</td><td id=\"square6\">&nbsp;</td><td id=\"square7\">&nbsp;</td><td id=\"square8\">&nbsp;</td><td id=\"square9\">&nbsp;</td></tr><tr><td id=\"square10\">&nbsp;</td><td id=\"square11\">&nbsp;</td><td id=\"free\">Free</td><td id=\"square12\">&nbsp;</td><td id=\"square13\">&nbsp;</td></tr><tr><td id=\"square14\">&nbsp;</td><td id=\"square15\">&nbsp;</td><td id=\"square16\">&nbsp;</td><td id=\"square17\">&nbsp;</td><td id=\"square18\">&nbsp;</td></tr><tr><td id=\"square19\">&nbsp;</td><td id=\"square20\">&nbsp;</td><td id=\"square21\">&nbsp;</td><td id=\"square22\">&nbsp;</td><td id=\"square23\">&nbsp;</td></tr></tbody></table>"
   console.log(c);
   $("#mytable").append(c);
}

function newCard() {
     for (var i=0; i<24; i++) {
        setSquare(i);
     }
}

function setSquare(thisSquare) {
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

function refreshData(){
   x = 5;
   console.log("hi");
   setTimeout(refreshData, x*1000);
}

$(initAll);

/*
   if (document.getElementById("")) {
      console.log($("#selection option:selected").val());
      makeCard();
      newCard();
      
      //for(var i = 0; i < getNumCardsSelected(); i ++){
      //   makeCard();
      //   newCard();
      //   console.log("card number " + i);
      //}     
      //console.log($("#selection option:selected").val());
   }
   else {
      alert("Sorry, your browser doesn't support this script");



      function refreshData(){
         x = 5;

         setTimeOut(refreshData, x*1000);
      }
   }*/