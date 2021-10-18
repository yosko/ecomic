// keep track of the currently displayed comic
var gCurrentComic;

// data object
var gData;

// settings (can be overriden)
var gSettings = {
	// Data files and images
	"BitsFile": "img/bits-maxim.png",
	"BackdropFile": "img/place/warguild.png",
	"MastheadImage": "img/masthead.png",
	"SceneFile": "js/data/data_testscene.js",

	// absolute numeric values
	"FramesPerSecond": 30,
	"HeaderHeight": 48,
	"ComicWidth": 640,
	"GlobalPixelScale": 2, // zoom

	// values that will be scaled (multiplied by gSettings.GlobalPixelScale)
	"PanelRatio": 3.8 / 3, // panel size is {75,95} on Sean Howard's comics, which is close to 4/3 but not quite
	"BorderSize": 1,
	"PanelMargin": 1, // margin between panels
	"ComicMargin": 4, // margin on the left, right and bottom of each comic
	"PanelsPerRow": 4,
	
	"backgroundColor": "#ffffff",
	"borderColor": "#000000",
	
	PanelWidth: function(gridWidth = 0) {
		if (gridWidth > 0) {
    		//return this.PanelX(gridWidth) - this.BorderSize * 2 - this.PanelMargin;
    		return this.PanelWidth(gridWidth-1) + this.PanelWidth() + this.BorderSize * 2 + this.PanelMargin;
		} else {
    		return Math.floor((this.ComicWidth / this.GlobalPixelScale - this.ComicMargin * 2 - this.PanelMargin * (this.PanelsPerRow-1) - this.BorderSize * (this.PanelsPerRow*2)) / this.PanelsPerRow);
		}
    },
	PanelHeight: function(gridHeight = 0) {
		if (gridHeight > 0) {
    		return this.PanelHeight(gridHeight-1) + this.PanelHeight() + this.BorderSize * 2 + this.PanelMargin;
		} else {
    		return Math.floor(this.PanelWidth() * this.PanelRatio);
		}
    },
	ComicHeight: function(nbRows = 2) {
		var unscaledPartHeight = this.PanelHeight() * nbRows
    		+ this.BorderSize * 2 * nbRows
    		+ this.PanelMargin * (nbRows - 1)
    		+ this.ComicMargin;
    	
    	// if unscaled height is odd, we should round it up to an even number
    	if (unscaledPartHeight % 2 !== 0) {
    		unscaledPartHeight++;
    	}
    	
    	return this.HeaderHeight + this.GlobalPixelScale * unscaledPartHeight;
    },
    ComicWidths: function() {
    	return [gSettings.RowWidth * gSettings.GlobalPixelScale];
    },
    PanelX: function(gridX) {
    	return this.ComicMargin
    		+ this.BorderSize * (1 + gridX * 2)
    		+ gridX * (this.PanelMargin + this.PanelWidth());
    },
    PanelY: function(gridY) {
    	return Math.floor(this.HeaderHeight / 2)
    		+ this.BorderSize * (1 + gridY * 2)
    		+ gridY * (this.PanelMargin + this.PanelHeight());
    }

/*

var gPanelWidth = Math.floor((gRowWidth - gComicMargin * 2 - gPanelMargin * (gPanelsPerRow-1) - gBorderSize * (gPanelsPerRow*2)) / gPanelsPerRow);
var gPanelHeight = Math.floor(gPanelWidth * gPanelRatio);


comicWidths = [gConfig.ComicWidth * gGlobalPixelScale];
comicHeights = [
	gHeaderHeight + gGlobalPixelScale * (),
	,
	,
	
];
*/
};

function load()
{
	// if gData was not set through custom.js, use the default gData
	if ( typeof(gData) === "undefined" ) {
		gData = gData_Default;
	}
	
	PrototypeApp();
}

function drawScreen()
{
	var theCanvas = document.getElementById("TheCanvas");
	var canvasContext = theCanvas.getContext("2d");
	if( !gCurrentComic ) {
		canvasContext.fillStyle = gSettings.backgroundColor;
		canvasContext.fillRect( 0, 0, theCanvas.width, theCanvas.height );
		return;
	}
	var w = gCurrentComic.width;
	var h = gCurrentComic.height;

	theCanvas.width = w;
	theCanvas.height = h;

	canvasContext.save();
	canvasContext.imageSmoothingEnabled = false;
	//canvasContext.scale(gSettings.GlobalPixelScale, gSettings.GlobalPixelScale);

	canvasContext.fillStyle = gSettings.backgroundColor;
	canvasContext.fillRect( 0, 0, w, h );

	gCurrentComic.draw( canvasContext );

	canvasContext.restore();

	// Draw Masthead
	var img = ImageDB_imageWithName(gSettings.MastheadImage);
	canvasContext.drawImage( img, 0, 0 );
}

function PrototypeApp()
{
	var theCanvas = document.getElementById("TheCanvas");
	var canvasContext = theCanvas.getContext("2d");

	//---------------------------------------------------------------------------
	// drawScreen
	//---------------------------------------------------------------------------

	function drawLoadScreen()
	{
		canvasContext.save();
		canvasContext.fillStyle = "#000000";
		canvasContext.fillRect( 0, 0, theCanvas.width, theCanvas.height );
		canvasContext.fillStyle = "#FFFFFF";
		canvasContext.font = "30px Arial";
		canvasContext.fillText("Please wait while loading...",10,50);
		canvasContext.restore();

	}

	function update()
	{
		drawScreen();
	}

	//---------------------------------------------------------------------------
	// Event
	//---------------------------------------------------------------------------
	function eventKeyReleased( e ) { }
	function eventKeyPressed( e )
	{
		var letterPressed = String.fromCharCode( e.keyCode );
		switch( letterPressed )
		{
			case "1": ComicDB_set(0); break;
			case "2": ComicDB_set(1); break;
			case "3": ComicDB_set(2); break;
			case "4": ComicDB_set(3); break;
			case "5": ComicDB_set(4); break;
			case "6": ComicDB_set(5); break;
			case "Q": gbRenderBackdrop = !gbRenderBackdrop; break;
			case "W": gDisabledSprouts["SHADOW"] = !gDisabledSprouts["SHADOW"]; break;
			case "X":
				createScreenshot();
				break;
		}
		drawScreen();
	}

	function createScreenshot()
	{
		var img = theCanvas.toDataURL("image/png");
		window.open().location = img;
	}

	/*
	function fillSelect()
	{
		var select = document.getElementById("dropBox");
		index = 0;
		for (var property in gSproutDB)
		{
		    if (gSproutDB.hasOwnProperty(property))
			{
			   var opt = document.createElement("option");
			   opt.value= index;
			   opt.innerHTML = property; // whatever property it has

			   // then append it to the select element
			   select.appendChild(opt);
		    }
		}
	}
	*/

	//---------------------------------------------------------------------------
	// Asset Loading
	//---------------------------------------------------------------------------
	var assetsLoaded = 0;
	var numAssetsToLoad = 0;

	function assetLoaded()
	{
		if( ++assetsLoaded < numAssetsToLoad )
			return;

		window.addEventListener("keydown", eventKeyPressed, true );
		window.addEventListener("keyup", eventKeyReleased, true );

		initializeGame();
		drawScreen();
	}

	function prepareToLoadImage( imageFilename )
	{
		let img = new Image();
		img.src = imageFilename;
		img.onload = assetLoaded;
		numAssetsToLoad++;

		ImageDB_registerImage(imageFilename, img);
		return img;
	}

	function fetchDefaultSceneFile(path) {
		// Default scene file is a required "asset" to run the app
		numAssetsToLoad++;

	    var httpRequest = new XMLHttpRequest();
	    httpRequest.onreadystatechange = function() {
	        if (httpRequest.readyState === 4) {
	            if (httpRequest.status === 200) {
			        var textArea = document.getElementById("sceneTextArea");
					textArea.value = httpRequest.responseText;
					assetLoaded();
	            }
	        }
	    };
	    
	    var cacheOverride = "?rand="+new Date().getTime();
	    httpRequest.open('GET', path+cacheOverride);
	    httpRequest.send();
	}

	//---------------------------------------------------------------------------
	// Init
	//---------------------------------------------------------------------------
	function initializeGame()
	{
		initDataFile( gData );

		BubbleContext_createDefaults();

		//ImageDB_dump();
		//SproutDB_dump();
		//SproutTemplateDB_dump();
		//BackdropDB_dump();
		//SceneDB_dump();
		//ComicDB_dump();
		//fillSelect();

		loadSceneJSON();

		//setInterval( update, 1000/gSettings.FramesPerSecond );
	}

	prepareToLoadImage( gSettings.BitsFile );
	prepareToLoadImage( gSettings.BackdropFile );
	prepareToLoadImage( gSettings.MastheadImage );
	fetchDefaultSceneFile( gSettings.SceneFile );

	drawLoadScreen();
}
