//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// BackdropDB
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
var gBackdropDB = {};

function BackdropDB_backdropWithName( name )
{
	var backdrop;
	if( name ) backdrop = gBackdropDB[name];
	return backdrop;
}

function BackdropDB_registerBackdrop( name, backdrop )
{
	if( !name || !backdrop )
	{
		console.log("BackdropDB_registerBackdrop('"+name+"',"+backdrop+") failed.");
		return;
	}
	if( gSproutDB[name] )
	{
		console.log("BackdropDB_registerBackdrop('"+name+"',"+backdrop+") -- name already exists.");
		return;
	}
	gBackdropDB[name] = backdrop;
}

function BackdropDB_dump()
{
	console.log("-- BackdropDB_dump()");
	for (var property in gBackdropDB)
	{
	    if (gBackdropDB.hasOwnProperty(property))
		{
			console.log("Backdrop:'"+property+"' "+gBackdropDB[property]);
	    }
	}
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// BGProp
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function BGProp( image, framex, framey, frameWidth, frameHeight, drawx, drawy, trigger )
{
	this.image = image;
	this.framex = framex;
	this.framey = framey;
	this.frameWidth = frameWidth;
	this.frameHeight = frameHeight;
	this.drawx = drawx;
	this.drawy = drawy;

	if( trigger ) this.trigger = trigger;
}

BGProp.prototype.toString = function()
{
	return "[BGProp '"+this.trigger+"' ("+this.framex+","+this.framey+
		","+this.frameWidth+","+this.frameHeight+") draw("+this.drawx+
		","+this.drawy+")]";
}

BGProp.prototype.draw = function( canvasContext )
{
	canvasContext.drawImage( this.image,
		this.framex, this.framey, this.frameWidth, this.frameHeight,
		this.drawx, this.drawy, this.frameWidth, this.frameHeight);
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// BGSweetSpot
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function BGSweetSpot( x, y, layer )
{
	this.x = 0;
	this.y = 0;
	this.layer = 0;

	if( x != undefined ) this.x = x;
	if( y != undefined ) this.y = y;
	if( layer != undefined ) this.layer = layer;
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Backdrop
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

function Backdrop( name, image, numLayers )
{
	this.name = name;
	this.image = image;
	this.width = 153;
	this.height = 95;
	this.defaults = {};
	this.sweetSpots = {};
	this.layers = [];

	for( var i = 0; i < numLayers; i++ )
		this.layers[i] = [];
}

Backdrop.prototype.toString = function()
{
	return "[Backdrop "+this.name+" numLayers:"+this.layers.length+"]";
}

//..
//.. Layers
//..
Backdrop.prototype.numLayers = function()
{
	return this.layers.length;
}

Backdrop.prototype.renderLayer = function( canvasContext, layerID, backdropData )
{
	if( layerID < 0 || layerID >= this.layers.length ) {
		console.log("Backdrop.renderLayer( canvasContext, "+layerID+", backdropData) - bad layerID");
		return;
	}

	var layerArr = this.layers[layerID];
	for( var i = 0; i < layerArr.length; i++ )
	{
		var bgprop = layerArr[i];
		if( bgprop.trigger )
		{
			if( !backdropData ) continue;
			if( !backdropData[bgprop.trigger] ) continue;
		}

		canvasContext.save();
		//canvasContext.translate( bgprop.drawx, bgprop.drawy );
		bgprop.draw( canvasContext );
		canvasContext.restore();
	}
}

Backdrop.prototype.renderAllLayers = function( canvasContext, backdropData )
{
	var num = this.layers.length;
	for( var i = 0; i < num; i++ )
		this.renderLayer( canvasContext, i, backdropData );
}

Backdrop.prototype.addBGProp = function( bgprop, layer )
{
	if( !bgprop ) {
		console.log("backdrop.addBGProp("+bgprop+","+layer+") - bad bgprop.");
		return;
	}
	if( layer < 0 || layer >= this.layers.length ) {
		console.log("backdrop.addBGProp("+bgprop+","+layer+") - bad layer.");
		return;
	}

	var layerArr = this.layers[layer];
	layerArr.push( bgprop );
}

//..
//.. Defaults
//..
Backdrop.prototype.setDefault = function( defaultName, bValue )
{
	this.defaults[defaultName] = bValue;
}

Backdrop.prototype.cloneDefaults = function()
{
	var newDefaults = {};
	for( var defaultName in this.defaults )
	{
		if( this.defaults[defaultName] )
			newDefaults[defaultName] = true;
	}
	return newDefaults;
}

//..
//.. Sweet Spots
//..
Backdrop.prototype.sweetSpot = function( sweetSpotName )
{
	if (typeof this.sweetSpots[sweetSpotName] === "undefined"){
	    console.log('error: sweetSpot "'+sweetSpotName+'" not found for backdrop "'+this.name+'".');
	}
	return this.sweetSpots[sweetSpotName];
}

Backdrop.prototype.addSweetSpot = function( sweetSpotName, x, y, layer )
{
	var spot = new BGSweetSpot( x, y, layer );
	this.sweetSpots[sweetSpotName] = spot;
}
