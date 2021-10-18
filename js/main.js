const FRAMES_PER_SEC = 30;
const GLOBAL_PIXEL_SCALE = 2;

var gMastheadImage = "img/masthead.png";
var gCurrentComic;

function load()
{
	PrototypeApp();
}

function drawScreen()
{
	var theCanvas = document.getElementById("TheCanvas");
	var canvasContext = theCanvas.getContext("2d");
	if( !gCurrentComic ) {
		canvasContext.fillStyle = "#ffffff";
		canvasContext.fillRect( 0, 0, theCanvas.width, theCanvas.height );
		return;
	}
	var w = gCurrentComic.width;
	var h = gCurrentComic.height;

	theCanvas.width = w;
	theCanvas.height = h;

	canvasContext.save();
	canvasContext.imageSmoothingEnabled = false;
	//canvasContext.scale(GLOBAL_PIXEL_SCALE,GLOBAL_PIXEL_SCALE);

	canvasContext.fillStyle = "#ffffff";
	canvasContext.fillRect( 0, 0, w, h );

	gCurrentComic.draw( canvasContext );

	canvasContext.restore();

	// Draw Masthead
	var img = ImageDB_imageWithName(gMastheadImage);
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
	    var httpRequest = new XMLHttpRequest();
	    httpRequest.onreadystatechange = function() {
	        if (httpRequest.readyState === 4) {
	            if (httpRequest.status === 200) {
			        var textArea = document.getElementById("sceneTextArea");
					textArea.value = httpRequest.responseText;
	            }
	        }
	    };
	    httpRequest.open('GET', path);
	    httpRequest.send();
	}

	//---------------------------------------------------------------------------
	// Init
	//---------------------------------------------------------------------------
	function initializeGame()
	{
		initDataFile( gData_Test );

		BubbleContext_createDefaults();

		//ImageDB_dump();
		//SproutDB_dump();
		//SproutTemplateDB_dump();
		//BackdropDB_dump();
		//SceneDB_dump();
		//ComicDB_dump();
		//fillSelect();

		loadSceneJSON();

		//setInterval( update, 1000/FRAMES_PER_SEC );
	}

	prepareToLoadImage( "img/bits-maxim.png" );
	prepareToLoadImage( "img/place/warguild.png" );
	prepareToLoadImage( gMastheadImage );
	fetchDefaultSceneFile("js/data/data_testscene.js");

	drawLoadScreen();
}
