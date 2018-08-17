exports.index =function(req,res)
{
	nano.db.create(req.body.dbname,function(){
		if(err)
		{
			res.send("ERROR CREATING DB");
			return;
		}
		res.send("Database created succesfully");
	})
	
};