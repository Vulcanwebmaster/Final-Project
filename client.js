var usedNums = new Array(79);
var calledNums = [];
var green = "rgba(10,255,10,.75)";
var white = "rgba(255,255,255,.75)";
var socket = io();
var count = 0;

socket.on("updateUsers", function(usernames, money){
   $("#listOfUsers").html("");
   for(i in usernames){
      $("#listOfUsers").append(usernames[i]+" " + money + "<br>");
   }
});



function initAll() {
   $("#loginForm").submit(function(event){
      if($("#username").val() != "" && $("#password").val()!=""){
         socket.emit("checkUsername", $("#username").val(), function(goodUsername){
            if(goodUsername==true){
               socket.emit("setUsername", $("#username").val(), $("#password").val(), function(loginSuccessful){
                  if(loginSuccessful===true){
                     $("#Login").hide();
                     $("#bingoCard").show();
                     $("#cardSelector").show();
                     $("#userScreen").show();
                     $("#playButton").show();
                     $("#Leaderboard").show();
                  }
                  else{
                     $("#userpass").show();
                  }
               });
            }
            else{
               $("#wrongUser").show();
            }
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
      if($("#newUsername").val() != "" && $("#newPassword").val()!=""){
         socket.emit("checkUser", $("#newUsername").val(), function(loginSuccessful){
            if(loginSuccessful===true){
               $("#Login").hide();
               $("#register").hide();
               $("#bingoCard").show();
               $("#cardSelector").show();
               $("#userScreen").show();
               $("#playButton").show();
               $("#Leaderboard").show();
               socket.emit("addUser", $("#newUsername").val(), $("#newPassword").val(), 0, 0, 2000);
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

   $("#Leaderboard").click(function(){
      socket.emit("fillTable", function(sucess){
         if(sucess){
            $("#Login").hide();
            $("#register").hide();
            $("#bingoCard").hide();
            $("#cardSelector").hide();
            $("#userScreen").hide();
            $("#playButton").hide();
            $("#Leaderboard").hide();
            $("#goBack").show();
            $("#userDB").show();
            $("#userDB").html("");
            var a = "<thead><tr><td>Username</td><td># of Wins</td><td>Money</td></tr>";
            $("#userDB").append(a);
            socket.on("getContents", function(username, wins, money){
               var r = "<tbody><tr><td>"+username+"</td><td>"+wins+"</td><td>"+money+"</td></tr></tbody>";
               $("#userDB").append(r);
            });

         }
         else{
            console.log("bad username");
         }
      })
   });

   $("#goBack").click(function(){
      $("#Login").hide();
      $("#register").hide();
      $("#bingoCard").show();
      $("#cardSelector").show();
      $("#userScreen").show();
      $("#playButton").show();
      $("#Leaderboard").show();
      $("#goBack").hide();
      $("#userDB").hide();
   });

   //asking the server approval to create cards
   $("#getCards").click(function(){
      socket.emit("getCards", Number($("#selection option:selected").val()), function(enoughMoney){
         if(enoughMoney==true){
            $("#mytable").html("");
            for(var i = 1; i <= $("#selection option:selected").val(); i ++){
               makeCard(i);
               //fix
               
            }
            anotherCard();
         }
         else{
            console.log("Not enough money for that amount of cards");
            $("#keepplaying").show();
         }
      })
      
   });

   $("#play").click(function(){
      $("#notYet").show();
      $("#bingo").show();
      $("#line").show();
      $("#fourCorners").show();
      $("#postaGeStamp").show();
      $("#play").hide();
      $("#numberGenerator").show();
      socket.emit("getRandomNumber");
      socket.on("numberGenerator", function(random){
         $('.numbersTable td').each(function() {
            var concatClass = this.cellIndex + "" + this.parentNode.rowIndex;
            var numberString = parseInt(concatClass, 10).toString();
            $(this).addClass("cell" + numberString).text(numberString);
         });
         calledNums.push(random);
         $('.bigNumberDisplay span').text(random);
		   $('.numbersTable td.cell' + random).addClass('selected');
      });
   });

   $(clickHandler);
   
   //checking if the client has bingo
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
         $("#keepplaying").hide();
         $(".bigbigNumberDisplay").hide();
         $(".numbersTable").hide();
         //socket.emit("endGame");
         socket.emit("bingoWin", $("#username").val(), 500, 1);
      }
         
      else{
         console.log("You don't have a bingo yet... keep playing");
         $("#keepplaying").show();
         $("#win").hide();
      } 
   })

   //checking if the client has 4 corners
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
         $("#notFinished4Corners").hide();
         console.log("You have 4 coners");
         socket.emit("moneyWin", $("#username").val(), 20);
      }
      else{
         $("#notFinished4Corners").show();
         $("#fourCornerWin").hide();
         console.log("not 4 courners yet");
      } 
   }); 
      //checking if the client has postage stamp
   $("#postageStamp").click(function(){
      var count1 = 0 , count2 = 0, count3 = 0, count4 = 0;
      for(var i = 0; i < calledNums.length; i++){
         if(calledNums[i] == document.getElementById("square0").innerHTML){count1++;}
         if(calledNums[i] == document.getElementById("square1").innerHTML){count1++;}
         if(calledNums[i] == document.getElementById("square5").innerHTML){count1++;}
         if(calledNums[i] == document.getElementById("square6").innerHTML){count1++;}
      
         if(calledNums[i] == document.getElementById("square3").innerHTML){count2++;}
         if(calledNums[i] == document.getElementById("square4").innerHTML){count2++;}
         if(calledNums[i] == document.getElementById("square8").innerHTML){count2++;}
         if(calledNums[i] == document.getElementById("square9").innerHTML){count2++;}
      
         if(calledNums[i] == document.getElementById("square14").innerHTML){count3++;}
         if(calledNums[i] == document.getElementById("square15").innerHTML){count3++;}
         if(calledNums[i] == document.getElementById("square19").innerHTML){count3++;}
         if(calledNums[i] == document.getElementById("square20").innerHTML){count3++;}
      
         if(calledNums[i] == document.getElementById("square17").innerHTML){count4++;}
         if(calledNums[i] == document.getElementById("square18").innerHTML){count4++;}
         if(calledNums[i] == document.getElementById("square20").innerHTML){count4++;}
         if(calledNums[i] == document.getElementById("square23").innerHTML){count4++;}
      }
      if(count1==4||count2==4||count3==4||count4==4){
         $("#postageStampWin").show();
         $("#notFinishedPostageStamp").hide();
         console.log("postage stamp win");
         socket.emit("moneyWin", $("#username").val(), 20);
      }
      else{ 
         $("#notFinishedPostageStamp").show();
         $("#postageStampWin").hide();
         console.log("not postage stamp yet");
      }   
   });
   
   
   //checking if the client has a horizontal line
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
      if(count1==5||count2==5||count3==4||count4==5||count5==5){
         console.log("you got a line");
         $("#linewin").show();
         $("#notline").hide();
         socket.emit("moneyWin", $("#username").val(), 25);
      }
      else{
         console.log("You dont have a line");
         $("#linewin").hide();
         $("#notline").show();
      }
   });

}

//creates the card directly in the html and fills it with random numbers
function makeCard(i){
	console.log("creating card " + i);
   var c = "<p>Card number "+i+"</p><table><thead><tr><th width=\"20%\">B</th><th width=\"20%\">I</th><th width=\"20%\">N</th><th width=\"20%\">G</th><th width=\"20%\">O</th></tr></thead><tbody><tr><td id=\"square"+increment(i,0)+"\">&nbsp;</td><td id=\"square"+increment(i,1)+"\">&nbsp;</td><td id=\"square"+increment(i,2)+"\">&nbsp;</td><td id=\"square"+increment(i,3)+"\">&nbsp;</td><td id=\"square"+increment(i,4)+"\">&nbsp;</td></tr><tr><td id=\"square"+increment(i,5)+"\">&nbsp;</td><td id=\"square"+increment(i,6)+"\">&nbsp;</td><td id=\"square"+increment(i,7)+"\">&nbsp;</td><td id=\"square"+increment(i,8)+"\">&nbsp;</td><td id=\"square"+increment(i,9)+"\">&nbsp;</td></tr><tr><td id=\"square"+increment(i,10)+"\">&nbsp;</td><td id=\"square"+increment(i,11)+"\">&nbsp;</td><td id=\"free\">Free</td><td id=\"square"+increment(i,12)+"\">&nbsp;</td><td id=\"square"+increment(i,13)+"\">&nbsp;</td></tr><tr><td id=\"square"+increment(i,14)+"\">&nbsp;</td><td id=\"square"+increment(i,15)+"\">&nbsp;</td><td id=\"square"+increment(i,16)+"\">&nbsp;</td><td id=\"square"+increment(i,17)+"\">&nbsp;</td><td id=\"square"+increment(i,18)+"\">&nbsp;</td></tr><tr><td id=\"square"+increment(i,19)+"\">&nbsp;</td><td id=\"square"+increment(i,20)+"\">&nbsp;</td><td id=\"square"+increment(i,21)+"\">&nbsp;</td><td id=\"square"+increment(i,22)+"\">&nbsp;</td><td id=\"square"+increment(i,23)+"\">&nbsp;</td></tr></tbody></table>"
	$("#mytable").append(c);
}

//changes the id of each square in the card so it can have a different number for multiple cards
function increment(i, j){   
   if(i == 1){
      return j;
   }
   if(i == 2){
      return j + 24;
   }
   if(i == 3){
      return j + 48;
   }
   if(i == 4){
      return j + 72;
   }
   if(i == 5){
      return j + 98;
   }
}

//generates number for all cards
function newCard() {
	for (var i=0; i<Number($("#selection option:selected").val())*24; i++) {
	   setSquare(i);
	}
}

function setSquare(thisSquare) {
   var currSquare = "square" + thisSquare;
	var colPlace = new Array(0,1,2,3,4,0,1,2,3,4,0,1,3,4,0,1,2,3,4,0,1,2,3,4);
	var colBasis = colPlace[thisSquare%24] * 15;
	var newNum;

	do {
	   newNum = colBasis + getNewNum() + 1;
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
   //TO-DO: change color to white when the user clicks in the same cell again
   $(document).on("click","#mytable tbody td", function(e){
      $(this).css("background-color", "green");
   });
}

$(initAll);


