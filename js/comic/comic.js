//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// ComicDB
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
var gComicDB = [];

function ComicDB_comicWithIndex( index )
{
	var comic;
	if( index >= 0 && index < gComicDB.length ) comic = gComicDB[index];
	return comic;
}

function ComicDB_registerComic( comic )
{
	if( !comic )
	{
		console.log("ComicDB_registerComic('"+name+"',"+comic+") failed.");
		return;
	}
	gComicDB.push(comic);
}

function ComicDB_clear()
{
	gComicDB = [];
}

function ComicDB_dump()
{
	console.log("-- ComicDB_dump()");
	for (var i = 0; i < gComicDB.length; i++ )
	{
		var comic = gComicDB[i];
		console.log("Comic:'"+comic.name+"'");
		comic.dump();
	}
}

function ComicDB_set( index )
{
	if( index < 0 || index >= gComicDB.length )
	{
		console.log("can't set the current comic to "+index+", index out of bounds");
		return;
	}

	if( gCurrentComic == gComicDB[index] ) return;

	gCurrentComic = gComicDB[index];
	console.log("Now viewing: '"+gCurrentComic.name+"'");
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Comic
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function Comic( name, numRows )
{
	this.name = name;
	this.rows = numRows;
	this.width = gSettings.ComicWidth;
	this.height = gSettings.ComicHeight(numRows);
	this.panels = [];
}

Comic.prototype.toString = function()
{
	return "[Comic '"+this.name+"']";
}

Comic.prototype.dump = function()
{
	console.log("dumping "+ this);
}

Comic.prototype.addPanel = function( panel )
{
	this.panels.push( panel );
}

Comic.prototype.draw = function( canvasContext )
{
	for( var i = 0; i < this.panels.length; i++ )
	{
		var panel = this.panels[i];
		panel.draw( canvasContext );
	}
}
