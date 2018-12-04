var usedNums = new Array(79);
var calledNums = [];
var color = "rgba(10,255,10,.75)";
var socket = io();

socket.on("updateUsers", function(usernames, money){
   $("#listOfUsers").html("");
   for(i in usernames){
      $("#listOfUsers").append(usernames[i]+" " + money + "<br>");
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
               socket.emit("addUser", $("#newUsername").val(), $("#newPassword").val(), 0, 0, 900);
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
   //make the server generate the cards

   $("#getCards").click(function(){
      socket.emit("getCards", Number($("#selection option:selected").val()), function(enoughMoney){
         if(enoughMoney==true){
            $("#mytable").html("");
            for(var i = 1; i <= $("#selection option:selected").val(); i ++){
               makeCard(i);
               //fix
               anotherCard();
            }
         }
         else{
            console.log("Not enough money for that amount of cards");
            $("#keepplaying").show();
         }
      })
      
   });
   //make the server generate the random number
   $(getRandNumDisplayed);
   $(clickHandler);
   
   $("#bingo").click(function(){
      console.log("So you think you have bingo?");
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
}

function getRandNumDisplayed(){
   //trying to make the random number generator work from teh server side once the play button is clicked
   $("#play").click(function(){
      $("#numberGenerator").show();
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

function makeCard(i, j){
   j = 0; 
   console.log("creating card " + i)
   var c = "<p>Card number "+i+"</p><table><thead><tr><th width=\"20%\">B</th><th width=\"20%\">I</th><th width=\"20%\">N</th><th width=\"20%\">G</th><th width=\"20%\">O</th></tr></thead><tbody><tr><td id=\"square"+j+"\">&nbsp;</td><td id=\"square"+increment(j)+"\">&nbsp;</td><td id=\"square"+increment(j)+"\">&nbsp;</td><td id=\"square"+increment(j)+"\">&nbsp;</td><td id=\"square"+increment(j)+"\">&nbsp;</td></tr><tr><td id=\"square"+increment(j)+"\">&nbsp;</td><td id=\"square"+increment(j)+"\">&nbsp;</td><td id=\"square"+increment(j)+"\">&nbsp;</td><td id=\"square"+increment(j)+"\">&nbsp;</td><td id=\"square"+increment(j)+"\">&nbsp;</td></tr><tr><td id=\"square"+increment(j)+"\">&nbsp;</td><td id=\"square"+increment(j)+"\">&nbsp;</td><td id=\"free\">Free</td><td id=\"square"+increment(j)+"\">&nbsp;</td><td id=\"square"+increment(j)+"\">&nbsp;</td></tr><tr><td id=\"square"+increment(j)+"\">&nbsp;</td><td id=\"square"+increment(j)+"\">&nbsp;</td><td id=\"square"+increment(j)+"\">&nbsp;</td><td id=\"square"+increment(j)+"\">&nbsp;</td><td id=\"square"+increment(j)+"\">&nbsp;</td></tr><tr><td id=\"square"+increment(j)+"\">&nbsp;</td><td id=\"square"+increment(j)+"\">&nbsp;</td><td id=\"square"+increment(j)+"\">&nbsp;</td><td id=\"square"+increment(j)+"\">&nbsp;</td><td id=\"square"+increment(j)+"\">&nbsp;</td></tr></tbody></table>"
   $("#mytable").append(c);
}

function increment(j){
   return j++;
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
        console.log(newNum);
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

