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

Sprite.prototype.draw = function( canvasContext, flipped, alpha )
{
	if( !canvasContext ) return;
	if( !this.image ) return;

	canvasContext.save();

	if( flipped )
	{
		// why the -1? To account for flipping the root pixel from left to
		// right side... I assume?
		var anti_anchorx = this.width - this.anchorx - 1;
		canvasContext.translate( this.width - anti_anchorx, -this.anchory );
		canvasContext.scale(-1,1);
	}
	else
	{
		canvasContext.translate( -this.anchorx, -this.anchory );
	}

	if( alpha != undefined )
	{
		canvasContext.globalAlpha = alpha;
	}

	canvasContext.drawImage( this.image,
		this.originx, this.originy, this.width, this.height,
		0, 0, this.width, this.height);

	canvasContext.restore();

	//canvasContext.save();
	//canvasContext.fillStyle = "#ff00ff";
	//canvasContext.fillRect( 0,0,1,1 );
	//canvasContext.restore();
}
