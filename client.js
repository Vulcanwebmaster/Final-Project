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
               $("#line").show();
               $("#Leaderboard").show();
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
               $("#line").show();
               $("#Leaderboard").show();
               socket.emit("addUser", $("#newUsername").val(), $("#newPassword").val().hashCode(), 0, 0, 900);
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

   $("#Leaderboard").click(function(){
      socket.emit("fillTable", function(sucess){
         if(sucess){
            $("#Login").hide();
            $("#register").hide();
            $("#bingoCard").hide();
            $("#cardSelector").hide();
            $("#userScreen").hide();
            //$("#numberGenerator").show();
            $("#playButton").hide();
            $("#bingo").hide();
            $("#line").hide();
            $("#Leaderboard").hide();
            $("#userDB").show();
            $("#userDB").html("");
            var a = "<thead><tr><td>Username</td><td># of Wins</td><td># of Losses</td><td>Money</td></tr>";
            $("#userDB").append(a);
            socket.on("getContents", function(username, wins, losses, money){
               console.log(username);
               console.log(wins);
               console.log(losses);
               console.log(money);
               var r = "<tbody><tr><td>"+username+"</td><td>"+wins+"</td><td>"+losses+"</td><td>"+money+"</td></tr></tbody>";
               $("#userDB").append(r);
            });

         }
         else{
            console.log("bad username");
         }
      })
   });

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

   $("#fourCorners").click(function(){
      var count = 0;      
      for(var i = 0; i < calledNums.length; i++){
         if(calledNums[i] == document.getElementById("square0").innerHTML){
            count++;
         }
         else if(calledNums[i] == document.getElementById("square19").innerHTML){
            count++;
         }
         else if(calledNums[i] == document.getElementById("square23").innerHTML){
            count++;
         }
         else if(calledNums[i] == document.getElementById("square4").innerHTML){
            count++;
         }
      }
      if(count == 4){
         $("#fourCornerWin").show();
         console.log("You have 4 coners");
      }
      else{
         $("#notFinished4Corners").show();
         console.log("NAH DAWG");
      } 
       
   });

   $("#line").click(function(){
      var count1 = 0 , count2 = 0, count3 = 0, count4 = 0, count5 = 0;
      for(var i = 0; i < usedNums.length; i ++){
         //console.log("num: "+usedNums[i]);
         if(calledNums[i]==document.getElementById("square0").innerHTML) count1++;
         if(calledNums[i]==document.getElementById("square1").innerHTML) count1++;
         if(calledNums[i]==document.getElementById("square2").innerHTML) count1++;
         if(calledNums[i]==document.getElementById("square3").innerHTML) count1++;
         if(calledNums[i]==document.getElementById("square4").innerHTML) count1++;
      
         if(calledNums[i]==document.getElementById("square5").innerHTML) count2++;
         if(calledNums[i]==document.getElementById("square6").innerHTML) count2++;
         if(calledNums[i]==document.getElementById("square7").innerHTML) count2++;
         if(calledNums[i]==document.getElementById("square8").innerHTML) count2++;
         if(calledNums[i]==document.getElementById("square9").innerHTML) count2++;
      
         if(calledNums[i]==document.getElementById("square10").innerHTML) count3++;
         if(calledNums[i]==document.getElementById("square11").innerHTML) count3++;
         if(calledNums[i]==document.getElementById("square12").innerHTML) count3++;
         if(calledNums[i]==document.getElementById("square13").innerHTML) count3++;
      
         if(calledNums[i]==document.getElementById("square14").innerHTML) count4++;
         if(calledNums[i]==document.getElementById("square15").innerHTML) count4++;
         if(calledNums[i]==document.getElementById("square16").innerHTML) count4++;
         if(calledNums[i]==document.getElementById("square17").innerHTML) count4++;
         if(calledNums[i]==document.getElementById("square18").innerHTML) count4++;
     
         if(calledNums[i]==document.getElementById("square19").innerHTML) count5++;
         if(calledNums[i]==document.getElementById("square20").innerHTML) count5++;
         if(calledNums[i]==document.getElementById("square21").innerHTML) count5++;
         if(calledNums[i]==document.getElementById("square22").innerHTML) count5++;
         if(calledNums[i]==document.getElementById("square23").innerHTML) count5++;
      }
      //console.log(count1);
      //console.log(count2);
      //console.log(count3);
      //console.log(count4);
      //console.log(count5);
      if(count1==5||count2==5||count3==4||count4==5||count5==5){
         console.log("you got a line");
         $("#linewin").show();
      }
      else{
         console.log("You dont have a line");
         $("#notline").show();
      }
   });

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
         //setInterval(function(){
            var random = bingo.generateNextRandom().toString();
            console.log(random);
            calledNums.push(random);
            $('.bigNumberDisplay span').text(random);
            $('.numbersTable td.cell' + random).addClass('selected');
         //}, 3000);  
      });
   });
}

String.prototype.hashCode = function() {
   //fix
   var hash = 0;
   if (this.length == 0) {
       return hash;
   }
   for (var i = 0; i < this.length; i++) {
       var char = this.charCodeAt(i);
       hash = ((hash<<5)-hash)+char;
       hash = hash & hash; // Convert to 32bit integer
   }
   return hash;
}

function makeCard(i){
	console.log("creating card " + i);
   var c = "<table><thead><tr><th width=\"20%\">B</th><th width=\"20%\">I</th><th width=\"20%\">N</th><th width=\"20%\">G</th><th width=\"20%\">O</th></tr></thead><tbody><tr><td id=\"square0\">&nbsp;</td><td id=\"square1\">&nbsp;</td><td id=\"square2\">&nbsp;</td><td id=\"square3\">&nbsp;</td><td id=\"square4\">&nbsp;</td></tr><tr><td id=\"square5\">&nbsp;</td><td id=\"square6\">&nbsp;</td><td id=\"square7\">&nbsp;</td><td id=\"square8\">&nbsp;</td><td id=\"square9\">&nbsp;</td></tr><tr><td id=\"square10\">&nbsp;</td><td id=\"square11\">&nbsp;</td><td id=\"free\">Free</td><td id=\"square12\">&nbsp;</td><td id=\"square13\">&nbsp;</td></tr><tr><td id=\"square14\">&nbsp;</td><td id=\"square15\">&nbsp;</td><td id=\"square16\">&nbsp;</td><td id=\"square17\">&nbsp;</td><td id=\"square18\">&nbsp;</td></tr><tr><td id=\"square19\">&nbsp;</td><td id=\"square20\">&nbsp;</td><td id=\"square21\">&nbsp;</td><td id=\"square22\">&nbsp;</td><td id=\"square23\">&nbsp;</td></tr></tbody></table>"
   //var c = "<p>Card number "+i+"</p><table><thead><tr><th width=\"20%\">B</th><th width=\"20%\">I</th><th width=\"20%\">N</th><th width=\"20%\">G</th><th width=\"20%\">O</th></tr></thead><tbody><tr><td id=\"square"+increment(i,0)+"\">&nbsp;</td><td id=\"square"+increment(i,1)+"\">&nbsp;</td><td id=\"square"+increment(i,2)+"\">&nbsp;</td><td id=\"square"+increment(i,3)+"\">&nbsp;</td><td id=\"square"+increment(i,4)+"\">&nbsp;</td></tr><tr><td id=\"square"+increment(i,5)+"\">&nbsp;</td><td id=\"square"+increment(i,6)+"\">&nbsp;</td><td id=\"square"+increment(i,7)+"\">&nbsp;</td><td id=\"square"+increment(i,8)+"\">&nbsp;</td><td id=\"square"+increment(i,9)+"\">&nbsp;</td></tr><tr><td id=\"square"+increment(i,10)+"\">&nbsp;</td><td id=\"square"+increment(i,11)+"\">&nbsp;</td><td id=\"free\">Free</td><td id=\"square"+increment(i,12)+"\">&nbsp;</td><td id=\"square"+increment(i,13)+"\">&nbsp;</td></tr><tr><td id=\"square"+increment(i,14)+"\">&nbsp;</td><td id=\"square"+increment(i,15)+"\">&nbsp;</td><td id=\"square"+increment(i,16)+"\">&nbsp;</td><td id=\"square"+increment(i,17)+"\">&nbsp;</td><td id=\"square"+increment(i,18)+"\">&nbsp;</td></tr><tr><td id=\"square"+increment(i,19)+"\">&nbsp;</td><td id=\"square"+increment(i,20)+"\">&nbsp;</td><td id=\"square"+increment(i,21)+"\">&nbsp;</td><td id=\"square"+increment(i,22)+"\">&nbsp;</td><td id=\"square"+increment(i,23)+"\">&nbsp;</td></tr></tbody></table>"
	$("#mytable").append(c);
}


function newCard() {
   //console.log(Number($("#selection option:selected").val())*24);
	for (var i=0; i<24; i++) {
	   setSquare(i);
	}
}

function setSquare(thisSquare) {
   var currSquare = "square" + thisSquare;
   console.log("id: " + currSquare);
	var colPlace = new Array(0,1,2,3,4,0,1,2,3,4,0,1,3,4,0,1,2,3,4,0,1,2,3,4);
	var colBasis = colPlace[thisSquare] * 15;
	var newNum;

	do {
	   newNum = colBasis + getNewNum() + 1;
	   console.log("num: " + newNum);
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

function clickHandler(){
   $(document).on("click","#mytable tbody td", function(e){
      $(this).css("background-color", color);
      console.log(e.target.innerHTML);
   });
}



$(initAll);


function increment(i, j){
   console.log("i "+i);
   
   if(i == 1){
      console.log("j "+j);
      //console.log(typeof(j));
      return j;
   }
      
   if(i == 2){
      console.log("j "+j);
      return j + 24;
   }
   if(i == 3){
      console.log("j "+j);
      return j + 48;
   }
   if(i == 4){
      console.log("j "+j);
      return j + 72;
   }
   if(i == 5){
      console.log("j "+j);
      return j + 98;
   }
}
