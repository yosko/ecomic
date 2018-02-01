
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// ImageDB
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
var gImageDB = {};

function ImageDB_imageWithName( name )
{
	var img;

	if( name )
		img = gImageDB[name];

	return img;
}

function ImageDB_registerImage( name, image )
{
	if( !name || !image )
	{
		console.log("ImageDB_registerImage('"+name+"',"+image+") failed.");
		return;
	}

	if( gImageDB[name] )
	{
		console.log("ImageDB_registerImage('"+name+"',"+image+") -- name already exists.");
		return;
	}

	gImageDB[name] = image;
}

function ImageDB_dump()
{
	console.log("-- ImageDB_Dump()");

	for (var property in gImageDB)
	{
	    if (gImageDB.hasOwnProperty(property))
		{
			console.log("IMG:'"+property+"' "+gImageDB[property]);
	    }
	}
}
