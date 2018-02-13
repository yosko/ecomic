
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// init SPROUTS
//	- Initializes a Sprouts from sprout member, registers in SproutDB
//	- default image is passed in (possibly from a higher point in the data
//		object). Used as a shortcut since most Sprouts in a single data obj
//		probably share the same image.
//
//	- image (name in ImageDB) -- optional, if missing, provide default (img)
//  - sprite {} -- optional
//	- links []  -- optional
//
//-----------------------------------------------------------------------------
//	sprouts : {
//		"HEAD_BASIC_MALE" : {
//			image: "img/bits-maxim.png",
//			sprite: { x:0, y:23, width:26, height:26, anchorx:13, anchory:23 },
//			links: [
//				{ linkName:"MOUTH", x:0, y:-1 },
//				{ linkName:"L_EYE", x:-1, y:-6 },
//				{ linkName:"R_EYE", x:4, y:-6 },
//				{ linkName:"HAIR", x:0, y:-12 },
//			],
//		},
//	}
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function initSprout( sproutData, defaultImage )
{
	var sprout;
	var sprite;
	var img;

	var spriteData = sproutData.sprite;
	if( spriteData )
	{
		if( spriteData.image ) img = ImageDB_imageWithName(spriteData.image);
		if( !img ) img = defaultImage;

		sprite = new Sprite( img,
			spriteData.x,       spriteData.y,
			spriteData.width,   spriteData.height,
			spriteData.anchorx, spriteData.anchory );
	}

	var sprout = new Sprout(sprite);
	if( sproutData.links )
	{
		var linkArr = sproutData.links;
		for( var i = 0; i < linkArr.length; i++ )
		{
			var linkData = linkArr[i];
			sprout.addLink(linkData.linkName, linkData.x, linkData.y);
		}
	}
	return sprout;
}

function initSprouts( data, defaultImage )
{
	for( var sproutName in data )
	{
		var sprout = initSprout( data[sproutName], defaultImage );
		SproutDB_registerSprout( sproutName, sprout );
	}
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// init TEMPLATES
//
//	Template Values (all optional)
//	- SproutKey
//		- sproutName
//		- offsetx
//		- offsety
//		- flipped
//		- alpha
//-----------------------------------------------------------------------------
//	templates: {
//		"MAXIM_DEFAULT" : {
//			"ROOT" : {sproutName:"HUMAN_ROOT"},
//			"SHADOW":{sproutName:"HUMAN_SHADOW", alpha:0.30},
//			"BODY" : {sproutName:"BODY_MAXIM_STAND"},
//			"HEAD" : {sproutName:"HEAD_BASIC_MALE"},
//			"HAIR" : {sproutName:"HAIR_MAXIM"},
//			"L_EYE": {sproutName:"LEYE_BASIC_MALE"},
//			"R_EYE": {sproutName:"REYE_EYEPATCH"},
//			"MOUTH": {sproutName:"MOUTH_BASIC_MALE"},
//		}
//	}
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function initTemplateFor( data )
{
	if( !data )
	{
		console.log("initTemplateFor("+data+") error.");
		return;
	}

	var templKey = new SproutKey();

	for( var keyName in data )
	{
		var keyObj = data[keyName];
		var keyEntry = new SproutKeyEntry();
		if( keyObj.sproutName != undefined ) keyEntry.sproutName = keyObj.sproutName;
		if( keyObj.offsetx != undefined ) keyEntry.offsetx = keyObj.offsetx;
		if( keyObj.offsety != undefined ) keyEntry.offsety = keyObj.offsety;
		if( keyObj.flipped != undefined ) keyEntry.flipped = keyObj.flipped;
		if( keyObj.alpha != undefined ) keyEntry.alpha = keyObj.alpha;
		templKey.setKey( keyName, keyEntry );
	}

	return templKey;
}

function initTemplates( data )
{
	for( var templateName in data )
	{
		var templ = initTemplateFor( data[templateName] );
		if( templ ) SproutTemplateDB_registerTemplate( templateName, templ );
	}
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// BACKDROPS
//-----------------------------------------------------------------------------
//	backdrops: {
//		"WARRIORS_GUILD" : {
//			image:"img/place/warguild.png",
//			width:375,
//			height:95,
//			defaults: {
//				 "DOOR":false,
//				 "DESK":true,
//			},
//			sweetSpots: {
//				"BEHIND_DESK" : { x:200, y:72, layer:0 },
//				"DESK_LEFT"   : { x:169, y:87, layer:1 },
//				"DESK_RIGHT"  : { x:229, y:87, layer:1 },
//				"IN_DOOR"     : { x:283, y:60, layer:1 },
//				"DOOR_RIGHT"  : { x:320, y:85, layer:1 },
//			},
//			layers: [
//				[   // layer 0
//					{x:0, y:0, width:375, height:95, drawx:0, drawy:0},
//					{x:1, y:96, width:37, height:47, drawx:264, drawy:18, trigger:"DOOR"},
//				],[ // layer 1
//					{x:39, y:96, width:69, height:26, drawx:166, drawy:55},
//				]
//			]
//		}
//	}
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function initBackdropFor( data, backdropName )
{
	if( !data || !backdropName )
	{
		console.log("initBackdropFor("+data+",'"+backdropName+"') error.");
		return undefined;
	}

	// image
	var image = ImageDB_imageWithName( data.image );
	if( !image )
	{
		console.log("initBackdropFor( data, "+backdropName+") - no image. failed. ");
		return undefined;
	}

	var backdrop = new Backdrop( backdropName, image, data.layers.length );
	backdrop.width = data.width;
	backdrop.height = data.height;

	// layers
	for( var i = 0; i < data.layers.length; i++ )
	{
		var layerArr = data.layers[i];
		for( var propi = 0; propi < layerArr.length; propi++ )
		{
			var p = layerArr[propi];
			var bgprop = new BGProp( image,
				p.x, p.y, p.width, p.height,
				p.drawx, p.drawy, p.trigger, p.flipped, p.vflipped );

			backdrop.addBGProp( bgprop, i );
		}
	}

	// sweetSpots
	for( var spotName in data.sweetSpots )
	{
		var spot = data.sweetSpots[spotName];
		backdrop.addSweetSpot( spotName, spot.x, spot.y, spot.layer );
	}


	// defaults
	for( var defName in data.defaults )
	{
		backdrop.setDefault( defName, data.defaults[defName] );
	}

	return backdrop;
}

function initBackdrops( data )
{
	for( var backdropName in data )
	{
		var backdrop = initBackdropFor( data[backdropName], backdropName );
		if( backdrop) BackdropDB_registerBackdrop( backdropName, backdrop );
	}
}



//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Init Scenes
//-----------------------------------------------------------------------------
//	scenes: {
//		"SCENE2" : {
//			backdrop: "WARRIORS_GUILD",
//			backdropDefaults: {"DOOR":false},
//			actors: {
//				"MAXIM"  : {templateName:"MAXIM", sweetSpot:"BEHIND_DESK" },
//				"MAXIM2" : {templateName:"MAXIM", sweetSpot:"DESK_LEFT" },
//				"MAXIM3" : {
//					templateName":"MAXIM",
//					x:40, y:80, layer:1, flipped:true,
//					state:["POINTING", "ANGRY"],
//				}
//			}
//		}
//	}
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function initScene( name, data )
{
	var scene = new Scene( name, data.backdrop );
	for( var defaultName in data.backdropDefaults )
	{
		scene.setBackdropDefault( defaultName, data.backdropDefaults[defaultName] );
	}
	for( var actorName in data.actors )
	{
		var obj = data.actors[actorName];
		var templateName = obj.templateName;

		var actor = new Actor( actorName, templateName );

		//.. position
		var backdrop = BackdropDB_backdropWithName( data.backdrop );
		var sweetSpot = obj.sweetSpot;
		if( sweetSpot )
		{
			var spot = backdrop.sweetSpot(sweetSpot);
			actor.x = spot.x;
			actor.y = spot.y;
			actor.layer = spot.layer;
		}
		else
		{
			if( obj.x ) actor.x = obj.x;
			if( obj.y ) actor.y = obj.y;
			if( obj.layer ) actor.layer = obj.layer;
		}

		//.. flipped
		if( obj.flipped ) actor.flipped = true;

		//.. state
		if( obj.state )
		{
			var arr = obj.state;
			for( var i = 0; i < arr.length; i++ )
			{
				var state = arr[i];
				actor.applyTemplate(state);
			}
		}

		scene.addActor( actorName, actor );
	}
	return scene;
}

function initScenes(data)
{
	if( !data ) return;

	for( var sceneName in data )
	{
		var scene = initScene( sceneName, data[sceneName] );
		SceneDB_registerScene( scene );
	}
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Comics
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function runPanelCommand( panel, commandArray )
{
	var baseCommand = commandArray[0];

	if( baseCommand == "focusOn" )
	{
		var focusObj = commandArray[1];
		panel.focusOnActor(focusObj);
		return;
	}
	if( baseCommand == "focusBetween" )
	{
		var actor1 = commandArray[1];
		var actor2 = commandArray[2];
		panel.focusOnActors(actor1,actor2);
		return;
	}
	if( baseCommand == "focusAt" )
	{
		var x = commandArray[1];
		var y = commandArray[2];
		panel.focusAt(x,y);
		return;
	}
	if( baseCommand == "shiftFocus" )
	{
		var x = commandArray[1];
		var y = commandArray[2];
		panel.shiftFocus(x,y);
		return;
	}
	if( baseCommand == "focusOnSpot" )
	{
		var spotName = commandArray[1];
		panel.focusOnSweetSpot(spotName);
		return;
	}
	if( baseCommand == "changeBackdropState" )
	{
		var key = commandArray[1];
		var value = commandArray[2];
		panel.scene.setBackdropDefault( key, value );
		return;
	}
	if( baseCommand == "actorFlip" )
	{
		var actorName = commandArray[1];
		var actor = panel.scene.actorWithName(actorName);
		actor.flipped = !actor.flipped;
		return;
	}
	if( baseCommand == "actorMoveToSpot" )
	{
		var actorName = commandArray[1];
		var spotName = commandArray[2];
		var sweetSpot = panel.scene.backdrop.sweetSpot(spotName);
		var actor = panel.scene.actorWithName(actorName);
		actor.x = sweetSpot.x;
		actor.y = sweetSpot.y;
		actor.layer = sweetSpot.layer;
		return;
	}
	if( baseCommand == "actorMoveTo" )
	{
		var actorName = commandArray[1];
		var x = commandArray[2];
		var y = commandArray[3];
		var actor = panel.scene.actorWithName(actorName);
		actor.x = x;
		actor.y = y;
		return;
	}
	if( baseCommand == "actorShift" )
	{
		var actorName = commandArray[1];
		var dx = commandArray[2];
		var dy = commandArray[3];
		var actor = panel.scene.actorWithName(actorName);
		actor.x += dx;
		actor.y += dy;
		return;
	}
	if( baseCommand == "actorChangeLayer" )
	{
		var actorName = commandArray[1];
		var layerID = commandArray[2];
		var actor = panel.scene.actorWithName(actorName);
		actor.layer = layerID;
		return;
	}
	if( baseCommand == "actorReset" )
	{
		var actorName = commandArray[1];
		var actor = panel.scene.actorWithName(actorName);
		if( actor ) actor.reset();
		return;
	}
	if( baseCommand == "actorApplyState" )
	{
		var actorName = commandArray[1];
		var actor = panel.scene.actorWithName(actorName);
		for( var i = 2; i < commandArray.length; i++ )
		{
			actor.applyTemplate(commandArray[i]);
		}
		return;
	}
	if( baseCommand == "actorSetSprout" )
	{
		var actorName = commandArray[1];
		var actor = panel.scene.actorWithName(actorName);
		var sproutKey = commandArray[2];
		var value = commandArray[3];
		actor.sproutKey[sproutKey].sproutName = value;
		return;
	}
	if( baseCommand == "actorSetVisible" )
	{
		var actorName = commandArray[1];
		var actor = panel.scene.actorWithName(actorName);
		var value = commandArray[2];
		actor.visible = value;
		return;
	}
	// actorOffsetSprout "MAXIM" "HEAD" dx dy
	// actorSetSproutAlpha "MAXIM" "HEAD" 1.0
	// actorFlipSprout "MAXIM" "HEAD"

	console.log("Unknown command: "+baseCommand);
}

function initComicPanel( panelObj, lastScene )
{
	var pScene = lastScene;
	if( panelObj.scene ) pScene = panelObj.scene;
	var scene = SceneDB_sceneWithName(pScene);

	if( !scene ) {
		console.log("error finding scene, curr = "+panelObj.scene+" last = "+lastScene);
		return;
	}

	var panel = new ComicPanel();
	panel.scene = scene.clone();

	// required
	// Set the panel position on the grid. Could be calculated in initComics?
	var pGridx = panelObj.gridLocation[0];
	var pGridy = panelObj.gridLocation[1];
	panel.setPanelAt( pGridx, pGridy );

	// optional
	// assumes 1x1 panel if not specified.
	var pPanelsWide = 1;
	var pPanelsHigh = 1;
	if( panelObj.panelsWide ) pPanelsWide = panelObj.panelsWide;
	if( panelObj.panelsHigh ) pPanelsHigh = panelObj.panelsHigh;
	panel.occupyPanels( pPanelsWide, pPanelsHigh );

	for( var i = 0; i < panelObj.sceneUpdates.length; i++ )
	{
		var commandArray = panelObj.sceneUpdates[i];
		runPanelCommand( panel, commandArray );
	}

	SceneDB_updateScene( panel.scene );

	// grab head locations for word bubbles?

	return panel;
}

function initComics(dataArray)
{
	if( !dataArray ) return;

	for( var i = 0; i < dataArray.length; i++ )
	{
		var comicData = dataArray[i];
		var comic = new Comic( comicData.name, comicData.rows );

		var lastScene;
		for( var j = 0; j < comicData.panels.length; j++ )
		{
			var panelObj = comicData.panels[j];
			var panel = initComicPanel( panelObj, lastScene );

			// calculate panel positions?

			comic.addPanel(panel);

			var lastScene = panel.scene.name;
		}
		ComicDB_registerComic( comic );
	}
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// init
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function initDataFile( jsonFile )
{
	if( !jsonFile ) return;

	var img = ImageDB_imageWithName(jsonFile.defaultImage);
	initSprouts( jsonFile.sprouts, img );
	initTemplates( jsonFile.templates );
	initBackdrops( jsonFile.backdrops );
	initScenes( jsonFile.scenes );

	if( jsonFile.masthead ) gMastheadImage = jsonFile.masthead;
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// JSON
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function loadSceneJSON()
{
	var textArea = document.getElementById("sceneTextArea");
	var obj = JSON.parse( textArea.value );

	if( !obj )
	{
		console.log("Error parsing JSON");
		return;
	}

	SceneDB_clear();
	ComicDB_clear();

	if( obj["masthead"] ) gMastheadImage = obj["masthead"];

	initScenes( obj.scenes );
	initComics( obj.comics );

	ComicDB_set(0);
	drawScreen();
}
