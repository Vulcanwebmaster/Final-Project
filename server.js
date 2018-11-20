var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var ObjectID = mongodb.ObjectID;
var client = new MongoClient("mongodb://localhost:27017", { useNewUrlParser: true });
var db;
var fs = require('fs');  //File system stuff
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

//This is to redirect traffic from port 80 (insecure) to port 443 (secure)
app.use(function(req, res, next) {
    if (req.secure) {
        next();
    } else {
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

function findUserByUsername(username){
	if(username){
		return new Promise((resolve, reject) => {
			db.collection("bingoInfo").findOne({username: username})
			.exec((err, doc) => {
				if(err) return reject(err);
				if(doc) return reject(new Error("Username already exists"));
				else return resolve(username);
			});
		});
	}
}

/*
function tellAllClients(error, result){
	db.collection("bingoInfo").find({}).toArray(function(err, docs){
		if(err != null) {
			throw err;
			console.log("error: " + err);
		}
		else{
			io.emit("updateUsers", docs);
		}
	});
}
*/
io.on("connection", function(socket){
	console.log("Somebody connected");

	socket.on("disconnect", function(){
		console.log(nameForSocket[socket.id] + " disconnected");
		delete nameForSocket[socket.id];
		io.emit("updateUsers", getUserNames());
	});

	socket.on("submit", function(){
		db.collection("bingoInfo").insertOne(getUserNames());
	});
	
	socket.on("checkUser", function(username, callbackFunction){
		db.collection("bingoInfo").find({username: username}, {$exists:true}).toArray(function(err,doc){
			if(doc.length==0){
				nameForSocket[socket.id] = username;
				io.emit("updateUsers", getUserNames());
				callbackFunction(true);
			} 
			else{
				console.log("username already exists"); //TO-DO: write an error message for the client
				callbackFunction(false);
			}
		});
		
	});

	socket.on("setUsername", function(user, pass, callbackFunction){
		db.collection("bingoInfo").find({username: user}, { $where: function(){ return(this.username==user);} }).toArray(function(err, doc){
			if(doc[0].username==user && doc[0].password==pass){ 
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

	socket.on("addUser", function(username, password){
		console.log("addUser was called with " + username + " " + password);
		var obj = {username: username, password: password};
		db.collection("bingoInfo").insertOne(obj);
	});

	io.emit("updateUsers", getUserNames());
});

client.connect(function(err){
	if(err != null) throw err;
	else {
		db = client.db("bingoInfo");
		secureServer.listen(443, function() {console.log("Secure server is ready.");});
		insecureServer.listen(80, function() {console.log("Insecure (forwarding) server is ready.");});
	}
});
 