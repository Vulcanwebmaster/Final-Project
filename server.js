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

function getMoney(username){
	db.collection("bingoInfo").find({username: username}).toArray(function(err, doc){
		if(doc){
			return doc[0].money;
		}
		else console.log(err);
	});
}

io.on("connection", function(socket){
	console.log("Somebody connected");

	socket.on("disconnect", function(){
		console.log(nameForSocket[socket.id] + " disconnected");
		delete nameForSocket[socket.id];
		io.emit("updateUsers", getUserNames());
	});

	socket.on("checkUsername", function(username){
		db.collection("bingoInfo").find({username: username}).toArray(function(err,doc){
			if(doc.length==0){
				console.log("wrong username");
			}
			else{
				console.log(doc);
			}
		});
	});

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

	socket.on("setUsername", function(user, pass, callbackFunction){
		var pass_hash=crypto.createHash('md5').update(pass).digest('hex');
		db.collection("bingoInfo").find({username: user}, { $where: function(){ return(this.username==user);} }).toArray(function(err, doc){
			if(doc[0].username==undefined){
				console.log("username doesnt exist in db");
			}
			if(doc[0].username==user && doc[0].password==pass_hash){ 
				nameForSocket[socket.id] = user;
				io.emit("updateUsers", getUserNames(), doc[0].money);
				callbackFunction(true);
			}
			else{
				console.log("username or password don't match");
				callbackFunction(false);
			}
		});
	});

	socket.on("addUser", function(username, password, wins, losses, money){
		var hash_password=crypto.createHash('md5').update(password).digest('hex');
		console.log("addUser was called with " + username + " " + password);
		var obj = {username: username, password: hash_password, wins: wins, losses: losses, money: money};
		db.collection("bingoInfo").insertOne(obj);
	});

	io.emit("updateUsers", getUserNames());
	
	socket.on("fillTable", function(success){
		db.collection("bingoInfo").find().sort( { username: 1 } ).toArray(function(err, doc){
			if(doc!=null){
				success(true);
				console.log(doc);
				for(var i = 0; i < doc.length; i++){
					socket.emit("getContents", doc[i].username, doc[i].wins, doc[i].losses, doc[i].money)
				}
			}
			else{
				success(false);
				console.log("db error");
			}
		});
	});

	socket.on("getCards", function(numCards, callbackFunction){
		
		var money;
		db.collection("bingoInfo").find({ username: nameForSocket[socket.id] }).toArray(function(err,docs) {
			if(docs.length>0){
				money=docs[0].money;
			}
			else console.log(err);
			if(200 * numCards > money){
				//TO-DO: write error message on the screen
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

	socket.on("bingoWin", function(username, moneyWon){
		console.log(moneyWon);
		console.log(getMoney(nameForSocket[socket.id]));
		db.collection("bingoInfo").updateOne({username: nameForSocket[socket.id]}, {$set: {money: getMoney(nameForSocket[socket.id])+moneyWon}});
	});

	socket.on("cornersWin", function(username, moneyWon){
		console.log(moneyWon);
		console.log(nameForSocket[socket.id]);
		console.log(getMoney(nameForSocket[socket.id]));
		db.collection("bingoInfo").updateOne({username: nameForSocket[socket.id]}, {$set: {money: getMoney(nameForSocket[socket.id])+moneyWon}});
	});

	socket.on("linesWin", function(username, moneyWon){
		console.log(typeof(moneyWon)+" "+moneyWon);
		console.log("money " + getMoney(nameForSocket[socket.id]));
		db.collection("bingoInfo").updateOne({username: nameForSocket[socket.id]}, {$set: {money: getMoney(nameForSocket[socket.id])+moneyWon}});
	});

	socket.on("postageStampWin", function(username,moneyWon){
		console.log(moneyWon);
		console.log(nameForSocket[socket.id]);
		console.log(getMoney(nameForSocket[socket.id]));
		db.collection("bingoInfo").updateOne({username: nameForSocket[socket.id]}, {$set: {money: getMoney(nameForSocket[socket.id])+moneyWon}});
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