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

	if( name && templateName )
	{
		this.name = name;
		this.templateName = templateName;
		this.reset();
	}
}

Actor.prototype.clone = function()
{
	var newActor = new Actor();
	newActor.name = this.name;
	newActor.templateName = this.templateName;
	newActor.x = this.x;
	newActor.y = this.y;
	newActor.layer = this.layer;
	newActor.flipped = this.flipped;
	newActor.visible = this.visible;

	if( this.sproutKey )
	{
		newActor.sproutKey = this.sproutKey.clone();
	}
	return newActor;
}

Actor.prototype.toString = function()
{
	return "[Actor '"+this.name+"':'"+this.templateName+"' ("+this.x+","+this.y+") layer:"+this.layer+"]";
}

Actor.prototype.reset = function()
{
	var defaultKey = this.templateName + "_DEFAULT";
	var template = SproutTemplateDB_templateWithName(defaultKey);
	if( !template ) {
		console.log("actor "+this.name+" reset failed: "+defaultKey);
		return;
	}

	this.sproutKey = template.clone();
}

Actor.prototype.applyTemplate = function( templateName )
{
	var classTemplateName = this.templateName + "_" + templateName;
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
