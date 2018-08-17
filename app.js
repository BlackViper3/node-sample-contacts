var express= require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var urlencoded = require('url');
var bodyparser = require('body-parser');
var json=require('json');
var logger = require('logger');
var  methodOverride = require('method-override');
var nano = require('nano')('http://localhost:5984');
var db= nano.use('address');
var app=express();

app.set('port',process.env.PORT || 3000);
app.set('views',path.join(__dirname,'views'));
app.set('view engine','jade');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded());
app.use(methodOverride());
app.use(express.static(path.join(__dirname,'public')));


app.get('/',routes.index);

app.post('/createdb',function(req,res)
{
	nano.db.create(req.body.dbname,function(err)
	{
		if(err)
		{
			res.send("Error creating db "+ req.body.dbname);
			return;

		}
		res.send("Database " + req.body.dbname+ "created successfully"); 
	});
});

app.post('/newContact',function(req,res){
	var name= req.body.name;
	var phone= req.body.phone;

//insert format is db.insert(json,id ,callback);

	db.insert({name:name, phone:phone ,crazy:true},name, function(err,body,header){
		if(err)
		{
			res.send("Error creating contact");
			return;
		}
		res.send("contact created succesfully");
	}); 


});

app.post('/viewContacts',function(req,res)
{
	  var alldoc="Following are the contacts";
	  db.get(req.body.phone, {revs_info:true},function(err,body)
	  {
	  	if(!err)
	  	{
	  		console.log(body);
	  	}
	  	if(body){
	  		alldoc += "Name:" + body.name + "<br/> Phone:" + body.phone;

 	  	}
	   else
	  {
	  	alldoc =" No records found";	
	  }
	  res.send(alldoc);
	});
});

http.createServer(app).listen(app.get('port'),function(){
	console.log("Express server listening to port "+ app.get('port'));

});  

