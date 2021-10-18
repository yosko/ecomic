//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// ActorTemplateDB
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
var gActorTemplateDB = {};

function ActorTemplateDB_actorTemplateWithName( name )
{
	var at;
	if( name ) at = gActorTemplateDB[name];
	return at;
}

function ActorTemplateDB_registerActorTemplate( name, actorTemplate )
{
	if( !actorTemplate )
	{
		console.log("ActorTemplateDB_registerActorTemplate('"+name+"') failed.");
		return;
	}

	if( gActorTemplateDB[name] )
	{
		console.log("ActorTemplateDB_registerActorTemplate('"+name+"') -- name already exists.");
		return;
	}
	gActorTemplateDB[name] = actorTemplate;
}

function ActorTemplateDB_clear()
{
	gActorTemplateDB = {};
}

function ActorTemplateDB_dump()
{
	console.log("-- ActorTemplateDB_dump()");
	for (var property in gActorTemplateDB)
	{
	    if( gActorTemplateDB.hasOwnProperty(property) )
		{
			console.log("ActorTemplate:'"+property+"'");
			//gActorTemplateDB[property].dump();
	    }
	}
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Actor
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function Actor(name, templateName)
{
	this.x = 0;
	this.y = 0;
	this.layer = 0;
	this.flipped = false;
	this.sproutKey = null;
	this.visible = true;
	this.bubbleDefaults = {};

	var actorTemplate = ActorTemplateDB_actorTemplateWithName( templateName );

	if( name && templateName )
	{
		this.name = name;
		this.sproutTemplateName = actorTemplate.sproutTemplate;

		if( actorTemplate.bubbleDefaults )
		{
			for( var key in actorTemplate.bubbleDefaults )
			{
				this.bubbleDefaults[key] = actorTemplate.bubbleDefaults[key];
			}
		}

		this.reset();
	}
}

Actor.prototype.dump = function()
{
	var str = "-- Actor '"+this.name+"' pos("+this.x+","+this.y+") layer("+this.layer+")";
	if( this.visible ) { str += " visible"; } else { str += " !visible"; }
	if( this.flipped ) { str += " flipped"; } else { str += " !flipped"; }
	if( this.bubbleDefaults )
	{
		for( var key in this.bubbleDefaults )
		{
			console.log("bubbleDefault: "+key+" = "+this.bubbleDefaults[key]);
		}
	}
	console.log( str );
	//this.sproutKey.dump();
}

Actor.prototype.clone = function()
{
	var newActor = new Actor();
	newActor.name = this.name;
	newActor.sproutTemplateName = this.sproutTemplateName;
	newActor.x = this.x;
	newActor.y = this.y;
	newActor.layer = this.layer;
	newActor.flipped = this.flipped;
	newActor.visible = this.visible;
	newActor.bubbleDefaults = this.bubbleDefaults;

	if( this.sproutKey )
	{
		newActor.sproutKey = this.sproutKey.clone();
	}
	return newActor;
}

Actor.prototype.toString = function()
{
	return "[Actor '"+this.name+"':'"+this.sproutTemplateName+"' ("+this.x+","+this.y+") layer:"+this.layer+"]";
}

Actor.prototype.getSpeakerPosition = function()
{
	return [ this.x, this.y - 32 ];
}

Actor.prototype.reset = function()
{
	var defaultKey = this.sproutTemplateName + "_DEFAULT";
	var template = SproutTemplateDB_templateWithName(defaultKey);
	if( !template ) {
		console.log("actor "+this.name+" reset failed: "+defaultKey);
		return;
	}

	this.sproutKey = template.clone();
}

Actor.prototype.applySproutTemplate = function( templateName )
{
	var classTemplateName = this.sproutTemplateName + "_" + templateName;
	var template = SproutTemplateDB_templateWithName(classTemplateName);
	if( !template ) template = SproutTemplateDB_templateWithName(templateName);
	if( !template ) return;

	template.applyTo(this.sproutKey);
}

Actor.prototype.draw = function( canvasContext )
{
	if( !this.visible ) return;

	var rootSprout = SproutDB_sproutWithName(this.sproutKey["ROOT"].sproutName);

	var flipped = this.flipped;
	if( rootSprout.flipped ) flipped = !flipped;

	rootSprout.draw( canvasContext, this.sproutKey, flipped, 1.0);
}
