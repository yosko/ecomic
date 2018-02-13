//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// SproutDB
//-----------------------------------------------------------------------------
//	- A simple global dictionary of sprouts. Can get/set/dump.
//	- registering a sprout with an existing name overwrites name in db.
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
var gSproutDB = {};
var gDisabledSprouts = {};

function SproutDB_sproutWithName( name )
{
	return gSproutDB[name];
}

function SproutDB_registerSprout( name, sprout )
{
	if( !name || !sprout ) return;
	gSproutDB[name] = sprout;
}

function SproutDB_dump()
{
	console.log("-- SproutDB_dump()");
	for (var property in gSproutDB)
	{
	    if (gSproutDB.hasOwnProperty(property))
		{
			console.log("SPRT:'"+property+"' "+gSproutDB[property]);
	    }
	}
}


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Sprout
//-----------------------------------------------------------------------------
//	- A Sprout is basically a hierarchal sprite. In addition to the (optional)
//		sprite, it also contains links to further sprouts to draw (which may
//		contain links to even more sprouts).
//	- Sprite is optional, allowing you to create hierarchal order without
//		drawing anything. For instance, a root sprout could have a drop shadow
//		and the character's body.
//	- Links use reference names, like "BODY" or "HEAD", which may in turn
//		point to different sprouts according to a SproutKey.
//	- A SproutKey is just a list of slots ("BODY") along with the globally
//		unique name of a sprout that is in that slot ("MAXIM_POINTING").
//		See also: SproutKey
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function Sprout( sprite )
{
	if( sprite ) this.sprite = sprite;
	this.links = [];
}

Sprout.prototype.toString = function()
{
	return "[Sprout "+this.sprite+" links:"+this.links.length+"]";
}

Sprout.prototype.addLink = function( sproutName, x, y )
{
	var link = {};
	link.sproutName = sproutName;
	link.offsetx = x;
	link.offsety = y;
	this.links.push(link);
}

Sprout.prototype.draw = function( canvasContext, sproutKey, flipped, vflipped, alpha )
{
	if( alpha == undefined ) alpha = 1.0;
	if( flipped == undefined ) flipped = false;
	if( vflipped == undefined ) vflipped = false;

	if( this.sprite ) this.sprite.draw(canvasContext, flipped, vflipped, alpha);

	if( !sproutKey || !this.links || this.links.length == 0 ) return;

	for( var i = 0; i < this.links.length; i++ )
	{
		var subSproutFlipped = flipped;
		var subSproutVerticallyFlipped = vflipped;
		var link = this.links[i];
		if( !link ) continue;

		// Can globally disable specific keys for all sproutKeys. For instance,
		// disabling "SHADOW" will prevent the drop shadows from being drawn.
		if( gDisabledSprouts[link.sproutName] ) continue;

		var keyObj = sproutKey[link.sproutName];
		if( !keyObj ) continue;

		var sprout = SproutDB_sproutWithName(keyObj.sproutName);
		if( !sprout ) continue;

		var dx = link.offsetx;
		var dy = link.offsety;
		if( flipped ) dx = -dx;
		if( vflipped ) dy = -dy;

		var newAlpha = alpha;
		if( keyObj.offsetx ) dx += keyObj.offsetx;
		if( keyObj.offsety ) dy += keyObj.offsety;
		if( keyObj.flipped ) subSproutFlipped = !subSproutFlipped;
		if( keyObj.vflipped ) subSproutVerticallyFlipped = !subSproutVerticallyFlipped;
		if( keyObj.alpha   != undefined ) newAlpha = alpha * keyObj.alpha;

		canvasContext.save();
		canvasContext.translate( dx, dy );
		sprout.draw( canvasContext, sproutKey, subSproutFlipped, subSproutVerticallyFlipped, newAlpha );
		canvasContext.restore();
	}
}
