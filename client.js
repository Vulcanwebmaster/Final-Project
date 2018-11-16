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
      //TO-DO: check if username and password math
      //encrypt password
      socket.emit("setUsername", $("#username").val(), function(loginSuccessful){
         if(loginSuccessful===true){
            $("#Login").hide();
            $("#MainPage").show();
            
         }
         $("#username").val("");
      });
      event.preventDefault();
      socket.emit("addUser", $("#username").val(), $("#password").val());
   });

   $("#registerForm").submit(function(event){
      //TO-DO: check if username already exists in db
      //if it doesn't, add it and the encrypted password to the db 
      //show the main page
   });

   if (document.getElementById) {
      document.getElementById("reload"). onclick = anotherCard;
      newCard();
   }
   else {
      alert("Sorry, your browser doesn't support this script");
   }
}

function newCard() {
     for (var i=0; i<24; i++) {
        setSquare(i);
     }
}

function setSquare(thisSquare) {
     var currSquare = "square" + thisSquare;
     var colPlace = new Array(0,1,2,3,4,0,1,2,3, 4,0,1,3,4,0,1,2,3,4,0,1,2,3,4);
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