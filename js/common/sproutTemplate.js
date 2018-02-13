//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// SproutTemplateDB
//-----------------------------------------------------------------------------
//	- A simple global dictionary of sprout templates. Can get/set/dump.
//	- registering a sprout template with an existing name overwrites name in db.
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
var gSproutTemplateDB = {};

function SproutTemplateDB_templateWithName( name )
{
	return gSproutTemplateDB[name];
}

function SproutTemplateDB_registerTemplate( name, template )
{
	if( !name || !template ) return;
	gSproutTemplateDB[name] = template;
}

function SproutTemplateDB_dump()
{
	console.log("-- SproutTemplateDB_dump()");
	for (var property in gSproutTemplateDB)
	{
	    if (gSproutTemplateDB.hasOwnProperty(property))
		{
			console.log("TEMPL:'"+property+"' "+gSproutTemplateDB[property]);
			gSproutTemplateDB[property].dump();
	    }
	}
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// SproutKeyEntry
//-----------------------------------------------------------------------------
//	- Basically, a render context for Sprouts.
//	- sproutName links to a sprout registered in the SproutDB.
//	- Can be cloned(), returning a copy with the same values.
//	- Can be applied to a second key, overwriting any variables with the ones
//		from this keyEntry. Will ignore variables on second keyEntry which are
//		not set on this one.
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function SproutKeyEntry( sproutName, ox, oy, flipped, vflipped, alpha )
{
	this.sproutName = sproutName;
	this.alpha   = 1.0;
	this.flipped = false;
	this.vflipped = false;
	this.offsetx = 0;
	this.offsety = 0;

	if( ox       != undefined ) this.offsetx = ox;
	if( oy       != undefined ) this.offsety = oy;
	if( flipped  != undefined ) this.flipped = flipped;
	if( vflipped != undefined ) this.vflipped = vflipped;
	if( alpha    != undefined ) this.alpha = alpha;
}

SproutKeyEntry.prototype.clone = function()
{
	var keyEntry = new SproutKeyEntry( this.sproutName );
	keyEntry.alpha   = this.alpha;
	keyEntry.flipped = this.flipped;
	keyEntry.vflipped = this.vflipped;
	keyEntry.offsetx = this.offsetx;
	keyEntry.offsety = this.offsety;
	return keyEntry;
}

SproutKeyEntry.prototype.toString = function()
{
	return "[SproutKeyEntry '"+this.sproutName+"' offset("+this.offsetx+
		","+this.offsety+") flipped:"+this.flipped+" vflipped:"+this.vflipped+
		" alpha:"+this.alpha+"]";
}

SproutKeyEntry.prototype.applyTo = function( otherKey )
{
	if( !otherKey ) return;
	if( this.sproutName ) otherKey.sproutName = this.sproutName;
	if( this.offsetx  != undefined ) otherKey.offsetx  = this.offsetx;
	if( this.offsety  != undefined ) otherKey.offsety  = this.offsety;
	if( this.alpha    != undefined ) otherKey.alpha    = this.alpha;
	if( this.flipped  != undefined ) otherKey.flipped  = this.flipped;
	if( this.vflipped != undefined ) otherKey.vflipped = this.vflipped;
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// SproutKey
//-----------------------------------------------------------------------------
//	- A list of SproutKeyEntries, kept by reference string ("BODY")
//	- When a Sprout renders, it will query this passed SproutKey for which
//		Sprout to draw at the next link. "BODY" may translate to "MAXIM_BODY".
//	- Can be cloned, copying all keyEntries to a new, identical SproutKey
//	- Can be applied to a second SproutKey, changing all shared keyEntries to
//		match this one, and adding new entries for all that don't exist on
//		second key. KeyEntries on the second key, but not this one, are left
//		alone.
//
//	- Applying SproutKeys/Templates is the foundation of the comic system.
//		Each actor has a SproutKey that controls how he is drawn. By taking
//		a template with partial values that change the referenced Sprout or
//		the alpha value, and applying it to an Actor's SproutKey, you can
//		make moderate, controlled changes:
//
//		Actor.changeState: ANGRY, FLOATING, LOOKING_BACK
//
//		ANGRY, FLOATING, LOOKING_BACK are SproutKeys/templates that are
//		stored in the SproutTemplateDB.
//
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function SproutKey() { }

SproutKey.prototype.clone = function()
{
	var newKey = new SproutKey();

	for (var property in this)
	{
	    if (this.hasOwnProperty(property))
		{
			var keyEntry = this[property];
			newKey.setKey( property, keyEntry.clone() );
		}
	}
	return newKey;
}

SproutKey.prototype.toString = function()
{
	var count = 0;
	for (var property in this)
	{
	    if (this.hasOwnProperty(property))
		{
			count++;
		}
	}

	return "[SproutKey keys:"+count+"]";
}

SproutKey.prototype.dump = function()
{
	console.log("SproutKey dump()");

	for (var property in this)
	{
	    if (this.hasOwnProperty(property))
		{
			console.log("Key:'"+property+"' "+this[property]);
	    }
	}
}

SproutKey.prototype.setKey = function( keyName, sproutKeyEntry )
{
	if( !keyName ) return;
	if( this[keyName] && !sproutKeyEntry )
	{
		delete this[keyName];
		return;
	}

	this[keyName] = sproutKeyEntry.clone();
}

SproutKey.prototype.removeKey = function( keyName )
{
	if( keyName && this[keyName] ) delete this[keyName];
}

SproutKey.prototype.applyTo = function( subKey )
{
	if( !subKey ) return;

	for (var property in this)
	{
	    if (this.hasOwnProperty(property))
		{
			var templEntry = this[property];
			var otherEntry = subKey[property];
			if( !otherEntry )
			{
				subKey.setKey( property, templEntry );
				continue;
			}
			templEntry.applyTo(otherEntry);
		}
	}
}
