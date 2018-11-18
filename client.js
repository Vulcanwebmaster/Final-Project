/*window.onload = initAll;*/
var usedNums = new Array(76);

var socket = io();


socket.on("updateUsers", function(usernames){
   $("#listOfUsers").html("");
   for(i in usernames){
      $("#listOfUsers").append(usernames[i]+"<br>");
   }
});

function initAll() {
   $("#loginForm").submit(function(event){
      //TO-DO: check if username and password match
      //encrypt password
      if($("#username").val() != "" && $("#password").val()!=""){
         socket.emit("setUsername", $("#username").val(), function(loginSuccessful){
            if(loginSuccessful===true){
               $("#Login").hide();
               $("#bingoCard").show();
               $("#cardSelector").show();
               socket.emit("addUser", $("#username").val(), $("#password").val());
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
               socket.emit("addUser", $("#newUsername").val(), $("#newPassword").val());
            }
         });
         event.preventDefault();
      }
      else console.log("Please complete the form correctly");
   });

   if (document.getElementById) {
      document.getElementById("reload"). onclick = anotherCard;
      for(var i = 0; i < getNumCardsSelected(); i ++){
         makeCard();
         newCard();
         console.log("card number " + i);
      }     
      console.log(getNumCardsSelected());
   }
   else {
      alert("Sorry, your browser doesn't support this script");
   }
}

function getNumCardsSelected(){
   $("#getCards").click(function(){
       var num = $("#selection option:selected").val();
       return num;
   });
}

function makeCard(){
   $("#bingoCard").html("");
   var c = "<h3>Here's your Bingo Card</h3><table><tr><th width=\"20%\">B</th><th width=\"20%\">I</th><th width=\"20%\">N</th><th width=\"20%\">G</th><th width=\"20%\">O</th></tr><tr><td id=\"square0\">&nbsp;</td><td id=\"square1\">&nbsp;</td><td id=\"square2\">&nbsp;</td><td id=\"square3\">&nbsp;</td><td id=\"square4\">&nbsp;</td></tr><tr><td id=\"square5\">&nbsp;</td><td id=\"square6\">&nbsp;</td><td id=\"square7\">&nbsp;</td><td id=\"square8\">&nbsp;</td><td id=\"square9\">&nbsp;</td></tr><tr><td id=\"square10\">&nbsp;</td><td id=\"square11\">&nbsp;</td><td id=\"free\">Free</td><td id=\"square12\">&nbsp;</td><td id=\"square13\">&nbsp;</td></tr><tr><td id=\"square14\">&nbsp;</td><td id=\"square15\">&nbsp;</td><td id=\"square16\">&nbsp;</td><td id=\"square17\">&nbsp;</td><td id=\"square18\">&nbsp;</td></tr><tr><td id=\"square19\">&nbsp;</td><td id=\"square20\">&nbsp;</td><td id=\"square21\">&nbsp;</td><td id=\"square22\">&nbsp;</td><td id=\"square23\">&nbsp;</td></tr></table>"
   $("#bingoCard").append(c);
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