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
	
	var translatex = -this.anchorx;
	var translatey = -this.anchory;

	if( flipped ) {
		// why the -1? To account for flipping the root pixel from left to
		// right side... I assume?
		var anti_anchorx = this.width - this.anchorx - 1;
		translatex = this.width - anti_anchorx;
		canvasContext.scale(-1,1);
	}

	if( vflipped ) {
		var anti_anchory = this.height - this.anchory - 1;
		translatey = this.height - anti_anchory;
		canvasContext.scale(1,-1);
	}
	
	canvasContext.translate( translatex, translatey );

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
