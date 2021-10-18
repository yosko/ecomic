const TEXT_LINE_BUFFER = 1.25;

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// BubbleContext
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
var gBubbleContextDefaults;

function BubbleContext_createDefaults()
{
	gBubbleContextDefaults = new BubbleContext();
	gBubbleContextDefaults.borderColor = "#000000";
	gBubbleContextDefaults.backgroundColor = "#ffffff";
	gBubbleContextDefaults.borderSize = 2;
	gBubbleContextDefaults.offsetx = 0;
	gBubbleContextDefaults.offsety = 0;

	gBubbleContextDefaults.font = "Comic Sans MS";
	gBubbleContextDefaults.fontSize = 12;
	gBubbleContextDefaults.textColor = "#000000";
	gBubbleContextDefaults.textBoxColor = "#cc9900";
	gBubbleContextDefaults.textMarginSize = 20;
	gBubbleContextDefaults.textOffsetX = 0;
	gBubbleContextDefaults.textOffsetY = 0;
	gBubbleContextDefaults.bResizeToText = true;

	gBubbleContextDefaults.bOutline = false;
	gBubbleContextDefaults.outlineColor = "#ffffff";

	gBubbleContextDefaults.bDrawPointer = true;
	gBubbleContextDefaults.pointToX = 0;
	gBubbleContextDefaults.pointToY = 0;
	gBubbleContextDefaults.pointOffsetX = 0;
	gBubbleContextDefaults.pointOffsety = 0;

	//gBubbleContextDefaults.textLines = [
	//	"Hello, World!",
	//	"Now is the time for all good",
	//	"men to come to the aid of their country. Friends,",
	//	"countrymen - Lend me your ears.",
	//	"But not your feet. You",
	//	"can keep those."
	//];

	//gBubbleContextDefaults.dump();
}

function BubbleContext_getVar( context, varName, defaultValue )
{
	if( !varName ) return defaultValue;
	if( context && context[varName] != undefined ) return context[varName];
	if( !gBubbleContextDefaults ) return defaultValue;
	if( gBubbleContextDefaults[varName] == undefined ) return defaultValue;
	return gBubbleContextDefaults[varName];
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

class BubbleContext
{
	constructor()
	{
		this.text = [];
	}

	dump()
	{
		console.log("-- BubbleContext.dump()");
		for (var property in this)
		{
		    if (this.hasOwnProperty(property))
			{
				console.log("   "+property+": " + this[property]);
		    }
		}
	}
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// BubbleShape
//
//	Shapes - WordBubble, BubbleConnectingLine, BubbleRect, BubblePointer
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
class BubbleShape
{
	constructor() {  }
	resizeToText( canvasContext, bubbleContext ) { }
	calculatePointer( bubbleContext ) { }

	drawBorder( canvasContext, bubbleContext ) { }
	drawFill( canvasContext, bubbleContext ) { }
	drawText( canvasContext, bubbleContext ) { }
}


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// WordBubble
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
class WordBubble extends BubbleShape
{
	constructor( x, y, wradius, hradius )
	{
		super();
		this.centerx = x;
		this.centery = y;
		this.wradius = wradius;
		this.hradius = hradius;
		if( wradius == undefined ) this.wradius = 1;
		if( hradius == undefined ) this.hradius = 1;
	}

	resizeToText( canvasContext, bubbleContext )
	{
		if( bubbleContext == undefined ) return;
		var lines = bubbleContext["textLines"];
		var bResizeToText = BubbleContext_getVar( bubbleContext, "bResizeToText", false );
		if( !lines || !bResizeToText ) return;

		var fontStyle = BubbleContext_getVar( bubbleContext, "fontStyle", "Comic Sans MS" );
		var fontHeight = BubbleContext_getVar( bubbleContext, "fontSize", 12 );
		var marginSize = BubbleContext_getVar( bubbleContext, "textMarginSize", 16 );

		canvasContext.save();
		canvasContext.font = fontHeight +"px " + fontStyle;

		var maxLineSize = 0;
		for( var i = 0; i < lines.length; i++ )
		{
			var str = lines[i];
			var metrics = canvasContext.measureText(str);
			if( metrics.width > maxLineSize ) maxLineSize = metrics.width;
		}

		this.wradius = (maxLineSize + marginSize)/2

		fontHeight *= TEXT_LINE_BUFFER;
		this.hradius = (fontHeight * lines.length + marginSize )/2;
		canvasContext.restore();
	}

	calculatePointer( bubbleContext )
	{
		if( !BubbleContext_getVar( bubbleContext, "bDrawPointer" ) ) return;

		var bubbleOffsetX = BubbleContext_getVar( bubbleContext, "offsetx", 0 );
		var bubbleOffsetY = BubbleContext_getVar( bubbleContext, "offsety", 0 );
		var pointToX = BubbleContext_getVar( bubbleContext, "pointToX", 0 );
		var pointToY = BubbleContext_getVar( bubbleContext, "pointToY", 0 );
		var ptroOffsetX = BubbleContext_getVar( bubbleContext, "pointerOriginOffsetX", 0 );
		var ptroOffsetY = BubbleContext_getVar( bubbleContext, "pointerOriginOffsetY", 0 );
		var ptroRadiusL = BubbleContext_getVar( bubbleContext, "pointerOriginRadiusL", this.wradius/2 )
		var ptroRadiusR = BubbleContext_getVar( bubbleContext, "pointerOriginRadiusR", this.wradius/2 )
		var pointOffsetX = BubbleContext_getVar( bubbleContext, "pointOffsetX", 0 );
		var pointOffsetY = BubbleContext_getVar( bubbleContext, "pointOffsetY", 0 );

		var x = this.centerx + bubbleOffsetX + ptroOffsetX;
		var y = this.centery + bubbleOffsetY + ptroOffsetY;

		if( x < pointToX ) { pointToX -= 32; }
		else if( x > pointToX ) { pointToX += 32; }

		pointToX += pointOffsetX;
		pointToY += pointOffsetY;


		this.ptrData = {
			pointToX: pointToX,
			pointToY: pointToY,
			originX1: x - ptroRadiusL,
			originX2: x + ptroRadiusR,
			originY: y,
		};
	}

	drawBorder( canvasContext, bubbleContext )
	{
		var x = this.centerx + BubbleContext_getVar( bubbleContext, "offsetx", 0 );
		var y = this.centery + BubbleContext_getVar( bubbleContext, "offsety", 0 );
		var color = BubbleContext_getVar( bubbleContext, "borderColor", "#000000" );
		var borderSize = BubbleContext_getVar( bubbleContext, "borderSize", 2 );

		canvasContext.save();
		canvasContext.fillStyle = color;
		canvasContext.strokeStyle = color;

		// black background border
		canvasContext.beginPath();
		canvasContext.ellipse( x, y,
			this.wradius + borderSize, this.hradius + borderSize,
			Math.PI, 0, Math.PI * 2 );
		canvasContext.fill();

		// pointer outline
		if( BubbleContext_getVar( bubbleContext, "bDrawPointer" ) )
		{
			canvasContext.beginPath();
			canvasContext.moveTo( this.ptrData.originX1, this.ptrData.originY );
			canvasContext.lineTo( this.ptrData.pointToX, this.ptrData.pointToY );
			canvasContext.lineTo( this.ptrData.originX2, this.ptrData.originY );
			canvasContext.lineWidth=4;
			canvasContext.stroke();
			canvasContext.closePath();
		}

		canvasContext.restore();
	}

	drawFill( canvasContext, bubbleContext )
	{
		var x = this.centerx + BubbleContext_getVar( bubbleContext, "offsetx", 0 );
		var y = this.centery + BubbleContext_getVar( bubbleContext, "offsety", 0 );
		var color = BubbleContext_getVar( bubbleContext, "backgroundColor", "#ffffff" );

		canvasContext.save();
		canvasContext.fillStyle = color;

		// background color
		canvasContext.beginPath();
		canvasContext.ellipse(
			x, y, this.wradius, this.hradius,
			Math.PI, 0, Math.PI * 2 );
		canvasContext.fill();

		// pointer outline
		if( BubbleContext_getVar( bubbleContext, "bDrawPointer" ) )
		{
			canvasContext.beginPath();
			canvasContext.moveTo( this.ptrData.originX1, this.ptrData.originY );
			canvasContext.lineTo( this.ptrData.pointToX, this.ptrData.pointToY );
			canvasContext.lineTo( this.ptrData.originX2, this.ptrData.originY );
			canvasContext.fill();
			canvasContext.closePath();
		}

		canvasContext.restore();
	}

	drawText( canvasContext, bubbleContext )
	{
		if( !bubbleContext || !bubbleContext["textLines"] ) return;
		var lines = bubbleContext["textLines"];

		var x = this.centerx + BubbleContext_getVar( bubbleContext, "offsetx", 0 );
		var y = this.centery + BubbleContext_getVar( bubbleContext, "offsety", 0 );
		var fontStyle = BubbleContext_getVar( bubbleContext, "fontStyle", "Comic Sans MS" );
		var fontHeight = BubbleContext_getVar( bubbleContext, "fontSize", 12 );
		var lineHeight = fontHeight * TEXT_LINE_BUFFER;

		x += BubbleContext_getVar( bubbleContext, "textOffsetX", 0 );
		y += BubbleContext_getVar( bubbleContext, "textOffsetY", 0 );
		y -= (lines.length/2-1) * lineHeight;
		y -= 4;

		canvasContext.save();
		canvasContext.font = fontHeight +"px " + fontStyle;
		canvasContext.fillStyle = BubbleContext_getVar( bubbleContext, "textColor", "#000000" );

		for( var i = 0; i < lines.length; i++ )
		{
			var str = lines[i];
			var metrics = canvasContext.measureText(str);

			var useOutline = BubbleContext_getVar( bubbleContext, "bOutline", false );
			if (useOutline) {
				var outlineColor = BubbleContext_getVar( bubbleContext, "outlineColor", "#ffffff" );

				var textX = x - metrics.width/2;
				var textY = y + lineHeight * i;

				canvasContext.strokeStyle = outlineColor;
				canvasContext.lineWidth = 3;
				canvasContext.miterLimit=2;
				canvasContext.strokeText(str, textX, textY);

			}

			canvasContext.fillText(str, x - metrics.width/2, y + lineHeight * i);
		}

		canvasContext.restore();
	}
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// WordBubbleCeiling
//		- Word bubble that fills the whole top of the screen.
//		- Oval + Rect
//		- Declare using a rectangle.
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
class WordBubbleCeiling extends BubbleShape
{
	constructor( x, y, wradius, hradius )
	{
		super();
		this.centerx = x;
		this.centery = y;
		this.wradius = wradius;
		this.hradius = hradius;
		if( wradius == undefined ) this.wradius = 1;
		if( hradius == undefined ) this.hradius = 1;
	}

	resizeToText( canvasContext, bubbleContext )
	{
		if( bubbleContext == undefined ) return;
		var lines = bubbleContext["textLines"];
		var bResizeToText = BubbleContext_getVar( bubbleContext, "bResizeToText", false );
		if( !lines || !bResizeToText ) return;

		var fontStyle = BubbleContext_getVar( bubbleContext, "fontStyle", "Comic Sans MS" );
		var fontHeight = BubbleContext_getVar( bubbleContext, "fontSize", 12 );
		var marginSize = BubbleContext_getVar( bubbleContext, "textMarginSize", 16 );

		canvasContext.save();
		canvasContext.font = fontHeight +"px " + fontStyle;

		var maxLineSize = 0;
		for( var i = 0; i < lines.length; i++ )
		{
			var str = lines[i];
			var metrics = canvasContext.measureText(str);
			if( metrics.width > maxLineSize ) maxLineSize = metrics.width;
		}

		this.wradius = (maxLineSize + marginSize)/2

		fontHeight *= TEXT_LINE_BUFFER;
		this.hradius = (fontHeight * lines.length + marginSize )/2;
		canvasContext.restore();
	}

	calculatePointer( bubbleContext )
	{
		if( !BubbleContext_getVar( bubbleContext, "bDrawPointer" ) ) return;

		var bubbleOffsetX = BubbleContext_getVar( bubbleContext, "offsetx", 0 );
		var bubbleOffsetY = BubbleContext_getVar( bubbleContext, "offsety", 0 );
		var pointToX = BubbleContext_getVar( bubbleContext, "pointToX", 0 );
		var pointToY = BubbleContext_getVar( bubbleContext, "pointToY", 0 );
		var ptroOffsetX = BubbleContext_getVar( bubbleContext, "pointerOriginOffsetX", 0 );
		var ptroOffsetY = BubbleContext_getVar( bubbleContext, "pointerOriginOffsetY", 0 );
		var ptroRadiusL = BubbleContext_getVar( bubbleContext, "pointerOriginRadiusL", this.wradius/2 )
		var ptroRadiusR = BubbleContext_getVar( bubbleContext, "pointerOriginRadiusR", this.wradius/2 )
		var pointOffsetX = BubbleContext_getVar( bubbleContext, "pointOffsetX", 0 );
		var pointOffsetY = BubbleContext_getVar( bubbleContext, "pointOffsetY", 0 );

		var x = this.centerx + bubbleOffsetX + ptroOffsetX;
		var y = this.centery + bubbleOffsetY + ptroOffsetY;

		if( x < pointToX ) { pointToX -= 32; }
		else if( x > pointToX ) { pointToX += 32; }

		pointToX += pointOffsetX;
		pointToY += pointOffsetY;


		this.ptrData = {
			pointToX: pointToX,
			pointToY: pointToY,
			originX1: x - ptroRadiusL,
			originX2: x + ptroRadiusR,
			originY: y,
		};
	}

	drawBorder( canvasContext, bubbleContext )
	{
		var x = this.centerx + BubbleContext_getVar( bubbleContext, "offsetx", 0 );
		var y = this.centery + BubbleContext_getVar( bubbleContext, "offsety", 0 );
		var color = BubbleContext_getVar( bubbleContext, "borderColor", "#000000" );
		var borderSize = BubbleContext_getVar( bubbleContext, "borderSize", 2 );

		canvasContext.save();
		canvasContext.fillStyle = color;
		canvasContext.strokeStyle = color;

		// black background border
		canvasContext.beginPath();
		canvasContext.ellipse( x, y,
			this.wradius + borderSize, this.hradius + borderSize,
			Math.PI, 0, Math.PI * 2 );
		canvasContext.fill();

		// pointer outline
		if( BubbleContext_getVar( bubbleContext, "bDrawPointer" ) )
		{
			canvasContext.beginPath();
			canvasContext.moveTo( this.ptrData.originX1, this.ptrData.originY );
			canvasContext.lineTo( this.ptrData.pointToX, this.ptrData.pointToY );
			canvasContext.lineTo( this.ptrData.originX2, this.ptrData.originY );
			canvasContext.lineWidth=4;
			canvasContext.stroke();
			canvasContext.closePath();
		}

		canvasContext.restore();
	}

	drawFill( canvasContext, bubbleContext )
	{
		var x = this.centerx + BubbleContext_getVar( bubbleContext, "offsetx", 0 );
		var y = this.centery + BubbleContext_getVar( bubbleContext, "offsety", 0 );
		var color = BubbleContext_getVar( bubbleContext, "backgroundColor", "#ffffff" );

		canvasContext.save();
		canvasContext.fillStyle = color;

		// background color
		canvasContext.beginPath();
		canvasContext.ellipse(
			x, y, this.wradius, this.hradius,
			Math.PI, 0, Math.PI * 2 );
		canvasContext.fill();

		// pointer outline
		if( BubbleContext_getVar( bubbleContext, "bDrawPointer" ) )
		{
			canvasContext.beginPath();
			canvasContext.moveTo( this.ptrData.originX1, this.ptrData.originY );
			canvasContext.lineTo( this.ptrData.pointToX, this.ptrData.pointToY );
			canvasContext.lineTo( this.ptrData.originX2, this.ptrData.originY );
			canvasContext.fill();
			canvasContext.closePath();
		}

		canvasContext.restore();
	}

	drawText( canvasContext, bubbleContext )
	{
		if( !bubbleContext || !bubbleContext["textLines"] ) return;
		var lines = bubbleContext["textLines"];

		var x = this.centerx + BubbleContext_getVar( bubbleContext, "offsetx", 0 );
		var y = this.centery + BubbleContext_getVar( bubbleContext, "offsety", 0 );
		var fontStyle = BubbleContext_getVar( bubbleContext, "fontStyle", "Comic Sans MS" );
		var fontHeight = BubbleContext_getVar( bubbleContext, "fontSize", 12 );
		var lineHeight = fontHeight * TEXT_LINE_BUFFER;

		x += BubbleContext_getVar( bubbleContext, "textOffsetX", 0 );
		y += BubbleContext_getVar( bubbleContext, "textOffsetY", 0 );
		y -= (lines.length/2-1) * lineHeight;
		y -= 4;

		canvasContext.save();
		canvasContext.font = fontHeight +"px " + fontStyle;
		canvasContext.fillStyle = BubbleContext_getVar( bubbleContext, "textColor", "#000000" );

		for( var i = 0; i < lines.length; i++ )
		{
			var str = lines[i];
			var metrics = canvasContext.measureText(str);
			canvasContext.fillText(str, x - metrics.width/2, y + lineHeight * i);
		}

		canvasContext.restore();
	}
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// BubbleBox
//		- text is left justified
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
class BubbleBox extends BubbleShape
{
	constructor( x, y, width, height )
	{
		super();
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		if( width == undefined ) this.width = 1;
		if( height == undefined ) this.height = 1;
	}

	resizeToText( canvasContext, bubbleContext )
	{
		if( bubbleContext == undefined ) return;
		var lines = bubbleContext["textLines"];
		var bResizesToText = BubbleContext_getVar( bubbleContext, "bResizeToText", false );
		if( !lines || !bResizesToText ) return;

		var fontStyle = BubbleContext_getVar( bubbleContext, "fontStyle", "Comic Sans MS" );
		var fontHeight = BubbleContext_getVar( bubbleContext, "fontSize", 12 );
		var marginSize = BubbleContext_getVar( bubbleContext, "textMarginSize", 12 );
		canvasContext.save();
		canvasContext.font = fontHeight +"px " + fontStyle;
		fontHeight *= TEXT_LINE_BUFFER;

		var maxLineSize = 0;
		for( var i = 0; i < lines.length; i++ )
		{
			var metrics = canvasContext.measureText(lines[i]);
			if( metrics.width > maxLineSize ) maxLineSize = metrics.width;
		}

		this.width = (maxLineSize + marginSize);
		this.height = (fontHeight * lines.length + marginSize );
		canvasContext.restore();
	}

	drawBorder( canvasContext, bubbleContext )
	{
		var x = this.x + BubbleContext_getVar( bubbleContext, "offsetx", 0 );
		var y = this.y + BubbleContext_getVar( bubbleContext, "offsety", 0 );
		var color = BubbleContext_getVar( bubbleContext, "borderColor", "#000000" );
		var borderSize = BubbleContext_getVar( bubbleContext, "borderSize", 2 );

		canvasContext.save();
		canvasContext.fillStyle = color;

		canvasContext.beginPath();
		canvasContext.fillRect( x - borderSize, y - borderSize,
			this.width + borderSize * 2, this.height + borderSize * 2 );
		canvasContext.fill();

		canvasContext.restore();
	}

	drawFill( canvasContext, bubbleContext )
	{
		var x = this.x + BubbleContext_getVar( bubbleContext, "offsetx", 0 );
		var y = this.y + BubbleContext_getVar( bubbleContext, "offsety", 0 );
		var color = BubbleContext_getVar( bubbleContext, "textBoxColor", "#cc9900" );

		canvasContext.save();
		canvasContext.fillStyle = color;

		canvasContext.beginPath();
		canvasContext.fillRect( x, y, this.width, this.height );
		canvasContext.fill();

		canvasContext.restore();
	}

	drawText( canvasContext, bubbleContext )
	{
		if( !bubbleContext || !bubbleContext["textLines"] ) return;
		var lines = bubbleContext["textLines"];

		var x = this.x + BubbleContext_getVar( bubbleContext, "offsetx", 0 );
		var y = this.y + BubbleContext_getVar( bubbleContext, "offsety", 0 );
		var fontStyle = BubbleContext_getVar( bubbleContext, "fontStyle", "Comic Sans MS" );
		var fontHeight = BubbleContext_getVar( bubbleContext, "fontSize", 12 );
		var marginSize = BubbleContext_getVar( bubbleContext, "textMarginSize", 12 );
		var lineHeight = fontHeight * TEXT_LINE_BUFFER;

		x += BubbleContext_getVar( bubbleContext, "textOffsetX", 0 );
		y += BubbleContext_getVar( bubbleContext, "textOffsetY", 0 );
		x += marginSize/2;
		y += fontHeight + marginSize/2;

		canvasContext.save();
		canvasContext.font = fontHeight +"px " + fontStyle;
		canvasContext.fillStyle = BubbleContext_getVar( bubbleContext, "textColor", "#000000" );

		for( var i = 0; i < lines.length; i++ )
		{
			var str = lines[i];
			var metrics = canvasContext.measureText(str);
			canvasContext.fillText(str, x, y + lineHeight * i);
		}

		canvasContext.restore();
	}
}


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// BubbleConnectingLine
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
class BubbleConnectingLine extends BubbleShape
{
	constructor( srcx, srcy, dstx, dsty )
	{
		super();
		this.srcx = srcx;
		this.srcy = srcy;
		this.dstx = dstx;
		this.dsty = dsty;
		this.thickness = 4;
	}

	drawBorder( canvasContext, bubbleContext )
	{
		var color = BubbleContext_getVar( bubbleContext, "borderColor", "#000000" );
		var borderSize = BubbleContext_getVar( bubbleContext, "borderSize", 2 );

		canvasContext.save();
		canvasContext.strokeStyle = color;

		canvasContext.beginPath();
		canvasContext.moveTo( this.srcx, this.srcy );
		canvasContext.lineTo( this.dstx, this.dsty );
		canvasContext.lineWidth= this.thickness + borderSize * 2;
		canvasContext.stroke();
		canvasContext.closePath();

		canvasContext.restore();
	}

	drawFill( canvasContext, bubbleContext )
	{
		var color = BubbleContext_getVar( bubbleContext, "backgroundColor", "#ffffff" );

		canvasContext.save();
		canvasContext.strokeStyle = color;

		canvasContext.beginPath();
		canvasContext.moveTo( this.srcx, this.srcy );
		canvasContext.lineTo( this.dstx, this.dsty );
		canvasContext.lineWidth= this.thickness;
		canvasContext.stroke();
		canvasContext.closePath();

		canvasContext.restore();
	}
}
