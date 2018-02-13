//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Sprite
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function Sprite( image, originx, originy, width, height, anchorx, anchory )
{
	this.image = image;
	this.originx = originx;
	this.originy = originy;
	this.width = width;
	this.height = height;
	this.anchorx = anchorx;
	this.anchory = anchory;
}

Sprite.prototype.toString = function()
{
	return "[Sprite origin("+this.originx+","+this.originy+") size("+this.width+
		","+this.height+") anchor("+this.anchorx+","+this.anchory+")]";
}

Sprite.prototype.draw = function( canvasContext, flipped, vflipped, alpha )
{
	if( !canvasContext ) return;
	if( !this.image ) return;

	canvasContext.save();
	
	var x = -this.anchorx;
	var y = -this.anchory;
	
	if (flipped) {
		canvasContext.scale(-1,1);
		x = x-1;
	}
	
	if (vflipped) {
		canvasContext.scale(1,-1);
		y = y-1;
	}

	if( alpha != undefined )
	{
		canvasContext.globalAlpha = alpha;
	}

	canvasContext.drawImage( this.image,
		this.originx, this.originy, this.width, this.height,
		x, y, this.width, this.height);

	canvasContext.restore();

	//canvasContext.save();
	//canvasContext.fillStyle = "#ff00ff";
	//canvasContext.fillRect( 0,0,1,1 );
	//canvasContext.restore();
}
