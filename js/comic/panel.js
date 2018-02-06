//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// ComicPanel
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function ComicPanel()
{
	this.scene = null;
	this.screenx = 5;
	this.screeny = 25;
	this.frameWidth = gSettings.PanelWidth();
	this.frameHeight = gSettings.PanelHeight();
	this.scenex = 0;
	this.sceney = 0;
	this.borderSize = 1;
}

ComicPanel.prototype.draw = function( canvasContext )
{
	if( !this.scene ) return;

	canvasContext.save();

	canvasContext.fillStyle = "#000000";
	canvasContext.fillRect( this.screenx - this.borderSize, this.screeny - this.borderSize,
		this.frameWidth + 2 * this.borderSize, this.frameHeight + 2 * this.borderSize );
	canvasContext.fillStyle = "#ffffff";
	canvasContext.fillRect( this.screenx, this.screeny, this.frameWidth, this.frameHeight );


	canvasContext.translate( this.screenx, this.screeny );
	canvasContext.beginPath();
	canvasContext.rect(0,0,this.frameWidth, this.frameHeight);
	canvasContext.clip();

	canvasContext.translate( -this.scenex, -this.sceney );
	this.scene.draw( canvasContext );

	canvasContext.restore();
}

ComicPanel.prototype.occupyPanels = function( panelsWide, panelsHigh )
{
	if( panelsWide == undefined ) panelsWide = 1;
	if( panelsHigh == undefined ) panelsHigh = 1;
	if( panelsHigh <= 0 ) panelsHigh = 1;
	if( panelsWide <= 0 ) panelsWide = 1;
	this.frameWidth = gSettings.PanelWidth(panelsWide-1);
	this.frameHeight = gSettings.PanelHeight(panelsHigh-1);
}

ComicPanel.prototype.setPanelAt = function( gridx, gridy )
{
	if( gridx == undefined ) gridx = 0;
	if( gridy == undefined ) gridy = 0;
	this.screenx = gSettings.PanelX(gridx);
	this.screeny = gSettings.PanelY(gridy);
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
