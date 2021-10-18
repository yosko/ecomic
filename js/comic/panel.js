var panelCols =    [  5,  83, 161, 239 ];
var panelRows =    [ 25, 123, 221, 319 ];
var panelWidths =  [ 75, 153, 231, 309 ];
var panelHeights = [ 95, 193, 291, 389 ];

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// PanelBubbleManager
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
class PanelBubbleManager
{
	constructor()
	{
		this.bubbleContexts = {};
	}

	createLayers( layerCount )
	{
		this.layers = [];
		for( var layer = 0; layer < layerCount; layer++ )
		{
			this.layers[layer] = [];
		}
	}

	addBubble( layerID, bubble, name )
	{
		if( layerID < 0 || layerID >= this.layers.length ) return;

		var bubbleRecord = { bubble:bubble };
		if( name != undefined ) bubbleRecord.name = name;
		this.layers[layerID].push(bubbleRecord);
	}

	getBubbleContext( name )
	{
		if( !name ) return undefined;
		var context = this.bubbleContexts[ name ];
		if( !context ) return undefined;
		//console.log("found bubble context "+name);
		return context;
	}

	setupBubbles(canvasContext, scene, scenex, sceney )
	{
		if( this.layers == undefined ) return;
		canvasContext.save();

		for( var layer = 0; layer < this.layers.length; layer++ )
		{
			var bubbleArray = this.layers[layer];

			// Resize all the panels
			for( var b = 0; b < bubbleArray.length; b++ )
			{
				var bubbleRecord = bubbleArray[b];
				var bcontext = this.getBubbleContext( bubbleRecord.name );
				bubbleRecord.bubble.resizeToText( canvasContext, bcontext )
			}

			if( scene == undefined ) continue;

			for( var b = 0; b < bubbleArray.length; b++ )
			{
				var bubbleRecord = bubbleArray[b];
				var bcontext = this.getBubbleContext( bubbleRecord.name );
				if( !bcontext || bcontext.speaker == undefined ) continue;

				var actor = scene.actorWithName( bcontext.speaker );

				// Get bubble defaults for actors
				if( actor.bubbleDefaults )
				{
					for( var key in actor.bubbleDefaults )
					{
						if( bcontext[key] == undefined )
							bcontext[key] = actor.bubbleDefaults[key];
					}
				}

				// Get talk position for actors
				var speakerPos = actor.getSpeakerPosition();
				bcontext["pointToX"] = (speakerPos[0] - scenex)*2;
				bcontext["pointToY"] = (speakerPos[1] - sceney)*2;

				bubbleRecord.bubble.calculatePointer( bcontext );
			}
		}
		canvasContext.restore();
	}

	draw( canvasContext )
	{
		if( this.layers == undefined ) return;
		canvasContext.save();

		for( var layer = 0; layer < this.layers.length; layer++ )
		{
			var bubbleArray = this.layers[layer];
			for( var b = 0; b < bubbleArray.length; b++ )
			{
				var bubbleRecord = bubbleArray[b];
				var bcontext = this.getBubbleContext( bubbleRecord.name );
				bubbleRecord.bubble.drawBorder( canvasContext, bcontext )
			}
			for( var b = 0; b < bubbleArray.length; b++ )
			{
				var bubbleRecord = bubbleArray[b];
				var bcontext = this.getBubbleContext( bubbleRecord.name );
				bubbleRecord.bubble.drawFill( canvasContext, bcontext )
			}
			for( var b = 0; b < bubbleArray.length; b++ )
			{
				var bubbleRecord = bubbleArray[b];
				var bcontext = this.getBubbleContext( bubbleRecord.name );
				bubbleRecord.bubble.drawText( canvasContext, bcontext )
			}
		}

		canvasContext.restore();
	}
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// ComicPanel
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function ComicPanel()
{
	this.scene = null;
	this.screenx = 5;
	this.screeny = 25;
	this.frameWidth = panelWidths[0];
	this.frameHeight = panelHeights[0];
	this.scenex = 0;
	this.sceney = 0;
	this.borderSize = 1;
	this.bubbleMgr = new PanelBubbleManager();
}

ComicPanel.prototype.draw = function( canvasContext )
{
	if( !this.scene ) return;

	//..
	//.. Draw panels and scenes in panel at small scale
	//..
	canvasContext.save();
	canvasContext.scale(GLOBAL_PIXEL_SCALE,GLOBAL_PIXEL_SCALE);

	// Draw panel borders
	canvasContext.fillStyle = "#000000";
	canvasContext.fillRect( this.screenx - this.borderSize, this.screeny - this.borderSize,
		this.frameWidth + 2 * this.borderSize, this.frameHeight + 2 * this.borderSize );
	canvasContext.fillStyle = "#ffffff";
	canvasContext.fillRect( this.screenx, this.screeny, this.frameWidth, this.frameHeight );

	// Clip scene to panel
	canvasContext.translate( this.screenx, this.screeny );
	canvasContext.beginPath();
	canvasContext.rect(0,0,this.frameWidth, this.frameHeight);
	canvasContext.clip();

	// Draw scene within panel
	canvasContext.translate( -this.scenex, -this.sceney );
	this.scene.draw( canvasContext );

	canvasContext.restore();

	//..
	//.. Draw Word Bubbles
	//..
	canvasContext.save();

	// Clip word bubbles to panel
	canvasContext.translate( this.screenx * GLOBAL_PIXEL_SCALE, this.screeny * GLOBAL_PIXEL_SCALE );
	canvasContext.beginPath();
	canvasContext.rect(0,0,this.frameWidth * GLOBAL_PIXEL_SCALE, this.frameHeight * GLOBAL_PIXEL_SCALE);
	canvasContext.clip();

	this.bubbleMgr.draw( canvasContext );

	canvasContext.restore();
}

ComicPanel.prototype.occupyPanels = function( panelsWide, panelsHigh )
{
	if( panelsWide == undefined ) panelsWide = 1;
	if( panelsHigh == undefined ) panelsHigh = 1;
	if( panelsHigh <= 0 ) panelsHigh = 1;
	if( panelsWide <= 0 ) panelsWide = 1;
	if( panelsHigh > panelHeights.length ) panelsHigh = panelHeights.length;
	if( panelsWide > panelWidths.length ) panelsWide = panelWidths.length;
	this.frameWidth = panelWidths[panelsWide-1];
	this.frameHeight = panelHeights[panelsHigh-1];
}

ComicPanel.prototype.setPanelAt = function( gridx, gridy )
{
	if( gridx == undefined ) gridx = 0;
	if( gridy == undefined ) gridy = 0;
	if( gridx >= panelCols.length ) gridx = panelCols.length - 1;
	if( gridy >= panelRows.length ) gridy = panelRows.length - 1;
	this.screenx = panelCols[gridx];
	this.screeny = panelRows[gridy];
}

ComicPanel.prototype.bindFocus = function()
{
	if( this.scenex < 0 ) this.scenex = 0;
	if( this.sceney < 0 ) this.sceney = 0;
	if( this.scenex + this.frameWidth > this.scene.backdrop.width )
		this.scenex = this.scene.backdrop.width - this.frameWidth;

	if( this.sceney + this.frameHeight > this.scene.backdrop.height )
		this.sceney = this.scene.backdrop.height - this.frameHeight;
}

ComicPanel.prototype.focusAt = function( x, y )
{
	var halfw = Math.floor(this.frameWidth / 2);
	var halfh = Math.floor(this.frameHeight / 2);
	this.scenex = x - halfw;
	this.sceney = y - halfh;
	this.bindFocus();
}

ComicPanel.prototype.shiftFocus = function( dx, dy )
{
	this.scenex += dx;
	this.sceney += dy;
	this.bindFocus();
}

ComicPanel.prototype.focusOnSweetSpot = function( spotName )
{
	var sweetSpot = this.scene.backdrop.sweetSpot(spotName);
	this.focusAt(sweetSpot.x, sweetSpot.y - 32);
}

ComicPanel.prototype.focusOnActor = function( actorName )
{
	var actor = this.scene.actors[actorName];
	if( !actor ) {
		console.log("panel can't focus on actor '"+actorName+"'");
		return;
	}
	this.focusAt(actor.x, actor.y - 32);
}

ComicPanel.prototype.focusOnActors = function( actorName1, actorName2 )
{
	var actor1 = this.scene.actors[actorName1];
	var actor2 = this.scene.actors[actorName2];
	if( !actor1 ) {
		console.log("panel can't focus on actor '"+actorName1+"'");
		return;
	}

	if( !actor2 ) {
		console.log("panel can't focus on actor '"+actorName2+"'");
		return;
	}

	var x = actor1.x + (actor2.x - actor1.x)/2;
	var y = actor1.y + (actor2.y - actor1.y)/2;
	this.focusAt(x, y - 32);
}
