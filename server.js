var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var ObjectID = mongodb.ObjectID;
var client = new MongoClient("mongodb://localhost:27017", { useNewUrlParser: true });
var db;
var fs = require('fs');  //File system 
//var crypto = require('crypto');
var key = fs.readFileSync('encryption/myKey.pem'); //sync here means it blocks until the whole file is loaded (unusual for node.js, but ok in this case)
var cert = fs.readFileSync( 'encryption/myCert.crt' );
var options = {
  key: key,
  cert: cert
};

var express = require('express');
var app = express();
var https = require("https");
var secureServer = https.createServer(options, app);
var http = require("http");
var insecureServer = http.createServer(app);
var socketIo = require("socket.io");
var io = socketIo(secureServer);
var crypto = require('crypto');

//This is to redirect traffic from port 80 (insecure) to port 443 (secure)
app.use(function(req, res, next) {
    if (req.secure) {
        next();
    } else {
        //next();
        res.redirect('https://' + req.headers.host + req.url);
    }
});


//var sanitizeHtml = require("sanitize-html");

app.use(express.static("pub"));

var nameForSocket = [];

function getUserNames(){
	var ret = [];

	for(i in nameForSocket){
		ret.push(nameForSocket[i]);
	}
	return ret;
}

io.on("connection", function(socket){
	console.log("Somebody connected");

	socket.on("disconnect", function(){
		console.log(nameForSocket[socket.id] + " disconnected");
		delete nameForSocket[socket.id];
		io.emit("updateUsers", getUserNames());
	});

	//checking if the user is in the database for registering a new user
	socket.on("checkUser", function(username, callbackFunction){
		db.collection("bingoInfo").find({username: username}, {$exists:true}).toArray(function(err,doc){
			if(doc.length==0){
				nameForSocket[socket.id] = username;
				io.emit("updateUsers", getUserNames());
				callbackFunction(true);
			} 
			else{
				console.log("username already exists"); 
				callbackFunction(false);
			}
		});
		
	});

	//checking if the username exists in the database to log in a user
	socket.on("checkUsername", function(username, goodUsername){
		db.collection("bingoInfo").find({username: username}, {$exists:true}).toArray(function(err,doc){
			if(doc.length==0){
				console.log("wrong username");
				goodUsername(false);
			}
			else{
				goodUsername(true);
			}
		});
	});

	//checking if the username and password matches for a given username
	socket.on("setUsername", function(user, pass, callbackFunction){
		var pass_hash=crypto.createHash('md5').update(pass).digest('hex');
		db.collection("bingoInfo").find({username: user}).toArray(function(err,doc){
			if(doc[0].username==undefined){
				console.log("username doesnt exist in db");
			}
			if(doc[0].username==user && doc[0].password==pass_hash){ 
				nameForSocket[socket.id] = user;
				io.emit("updateUsers", getUserNames());
				callbackFunction(true);
			}
			else{
				console.log("username or password don't match");
				callbackFunction(false);
			}
		});
	});

	//adding the user to the db
	socket.on("addUser", function(username, password, wins, losses, money){
		var hash_password=crypto.createHash('md5').update(password).digest('hex');
		console.log("addUser was called with " + username + " " + password);
		var obj = {username: username, password: hash_password, wins: wins, losses: losses, money: money};
		db.collection("bingoInfo").insertOne(obj);
	});

	io.emit("updateUsers", getUserNames());
	
	//creating the leaderboard table
	socket.on("fillTable", function(success){
		db.collection("bingoInfo").find().sort( { wins: -1 } ).toArray(function(err, doc){
			if(doc!=null){
				success(true);
				for(var i = 0; i < doc.length; i++){
					socket.emit("getContents", doc[i].username, doc[i].wins, doc[i].money)
				}
			}
			else{
				success(false);
				console.log("db error");
			}
		});
	});

	//sending a message to the client according to if it has enough money to purchase bingo cards so it can create 
	//as many cards as it needs
	socket.on("getCards", function(numCards, callbackFunction){
		var money;
		db.collection("bingoInfo").find({ username: nameForSocket[socket.id] }).toArray(function(err,docs) {
			if(docs.length>0){
				money=docs[0].money;
			}
			else console.log(err);
			if(50 * numCards > money){
				console.log("not enough money to buy that many cards");
				callbackFunction(false);
			}
			else{
				money = money - numCards*50;
				socket.emit("displayCards", numCards);
				db.collection("bingoInfo").updateOne({username: nameForSocket[socket.id]}, {$set: {money: money}});
				callbackFunction(true);
			}
		});
	});

	//generating a random number every second for the actual bingo game
	socket.on("getRandomNumber", function(){
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
			   		console.log("All numbers Exhausted");
			   		return 0;
			   }
			   var random = bingo.generateRandom();
			   while (bingo.selectedNumbers.indexOf(random) > -1) {
					random = bingo.generateRandom();
			   }
			   bingo.selectedNumbers.push(random);
			   return random;
			}
		 };
		setInterval(function(){
			var random = bingo.generateNextRandom().toString();
			console.log(random);
			io.emit("numberGenerator", random);
		}, 1000);  
	});

	//when the user sends the message bingoWin we update the money and the wins of the user
	socket.on("bingoWin", function(username, moneyWon, winNum){
		db.collection("bingoInfo").find({username: username}).toArray(function(err, doc){
			if(doc.length!=0){
				console.log(doc[0].wins);
				db.collection("bingoInfo").updateOne({username: username}, {$set: {money: doc[0].money+moneyWon}});
				db.collection("bingoInfo").updateOne({username: username}, {$set:{wins:doc[0].wins+winNum}});
			}
			else console.log(err);
		});
	});

	//any time the user has a line, corners or postage stamp we update the current money of the user
	socket.on("moneyWin", function(username, moneyWon){
		db.collection("bingoInfo").find({username: username}).toArray(function(err, doc){
			if(doc.length!=0){
				db.collection("bingoInfo").updateOne({username: username}, {$set: {money: doc[0].money+moneyWon}});
			}
			else console.log(err);
		});
	});

	
});

client.connect(function(err){
	if(err != null) throw err;
	else {
		db = client.db("bingoInfo");
		secureServer.listen(443, function() {console.log("Secure server is ready.");});
		insecureServer.listen(80, function() {console.log("Insecure (forwarding) server is ready.");});
	}
});