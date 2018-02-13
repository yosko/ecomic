//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// SceneDB
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
var gSceneDB = {};

function SceneDB_sceneWithName( name )
{
	var scene;
	if( name ) scene = gSceneDB[name];
	return scene;
}

function SceneDB_registerScene( scene )
{
	if( !scene )
	{
		console.log("SceneDB_registerScene('"+name+"',"+scene+") failed.");
		return;
	}
	var name = scene.name;

	if( gSceneDB[name] )
	{
		console.log("SceneDB_registerScene('"+name+"',"+scene+") -- name already exists.");
		return;
	}
	gSceneDB[name] = scene;
}
function SceneDB_updateScene( scene )
{
	var name = scene.name;
	if( !scene )
	{
		console.log("SceneDB_updateScene('"+name+"') failed.");
		return;
	}
	if( !gSceneDB[name] )
	{
		console.log("SceneDB_updateScene('"+name+"') -- name doesn't exists.");
		return;
	}
	gSceneDB[name] = scene;
}

function SceneDB_clear()
{
	gSceneDB = {};
}

function SceneDB_dump()
{
	console.log("-- SceneDB_dump()");
	for (var property in gSceneDB)
	{
	    if (gSceneDB.hasOwnProperty(property))
		{
			console.log("Scene:'"+property+"'");
			gSceneDB[property].dump();
	    }
	}
}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Scene
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function Scene( name, backdropName )
{
	this.name = name;
	this.backdrop = BackdropDB_backdropWithName( backdropName );

	if( !this.backdrop )
	{
		console.log("new Scene('"+backdropName+"') - invalid backdropName");
		return;
	}

	this.backdropDefaults = this.backdrop.cloneDefaults();
	this.actors = {};
}

Scene.prototype.toString = function()
{
	return "[Scene backdrop:'"+this.backdrop.name+"']";
}

Scene.prototype.dump = function( verbose )
{
	console.log("  name: '"+this.name+"'");
	console.log("  backdrop: '"+this.backdrop.name+"'");
	console.log("  backdropDefaults:");
	for( var property in this.backdropDefaults )
	{
		var obj = this.backdropDefaults[property];
		if( obj ) console.log("    '"+property+"': true");
		else if( verbose ) console.log("    '"+property+"': false");
	}
	console.log("  actors:");
	for( var actorName in this.actors )
	{
		var actor = this.actors[actorName];
		console.log("    Actor '"+actor.name+"' : '"+actor.templateName+"' x:"+actor.x+
			" y:"+actor.y+" layer:"+actor.layer+" flipped:"+actor.flipped+" vflipped:"+actor.vflipped);
		if( verbose )
		{
			for( var keyName in actor.sproutKey )
			{
				if (actor.sproutKey.hasOwnProperty(keyName))
				{
					var key = actor.sproutKey[keyName];
					console.log("      key '"+keyName+"' : "+key);
				}
			}
		}
	}
}

Scene.prototype.setBackdropDefault = function( defaultName, value )
{
	this.backdropDefaults[defaultName] = value;
}

Scene.prototype.removeActor = function( actorName )
{
	if( this.actors[actorName] )
		delete this.actors[actorName];
}

Scene.prototype.addActor = function( actorName, actor )
{
	if( this.actors[actorName] )
	{
		console.log("Scene.addActor "+actorName+" actor name already exists.");
		return;
	}

	this.actors[actorName] = actor;
}

Scene.prototype.actorWithName = function( actorName )
{
	if (typeof this.actors[actorName] === "undefined"){
	    console.log('error: actor "'+actorName+'" not found for scene "'+this.name+'".');
	}
	return this.actors[actorName];
}

Scene.prototype.clone = function()
{
	var newScene = new Scene( this.name, this.backdrop.name );

	for( var property in this.backdropDefaults )
	{
		var obj = this.backdropDefaults[property];
		newScene.setBackdropDefault( property, obj );
	}

	for( var actorName in this.actors )
	{
		var actor = this.actors[actorName];
		var newActor = actor.clone();
		newScene.addActor( actorName, newActor );
	}

	return newScene;
}

function actorSort( a, b )
{
	if( b.layer < a.layer ) return 1;
	if( b.layer > a.layer ) return -1;
	if( b.y < a.y ) return 1;
	if( b.y > a.y ) return -1;
	return 0;
}

var gbRenderBackdrop = true;

Scene.prototype.draw = function( canvasContext )
{
	canvasContext.save();

	var actorList = [];
	for( var actorName in this.actors )
	{
		var actor = this.actors[actorName];
		actorList.push(actor);
	}
	actorList.sort( actorSort );

	var backdrop = this.backdrop;
	var numLayers = this.backdrop.numLayers();
	for( var i = 0; i < numLayers; i++ )
	{
		if( gbRenderBackdrop ) backdrop.renderLayer( canvasContext, i, this.backdropDefaults );

		for( var j = 0; j < actorList.length; j++ )
		{
			var actor = actorList[j];
			if( actor.layer == i )
			{
				canvasContext.save();
				canvasContext.translate( actor.x, actor.y );
				actor.draw( canvasContext );
				canvasContext.restore();
			}
		}
	}

	// draw actors above last layer
	for( var j = 0; j < actorList.length; j++ )
	{
		var actor = actorList[j];
		if( actor.layer >= numLayers )
		{
			canvasContext.save();
			canvasContext.translate( actor.x, actor.y );
			actor.draw( canvasContext );
			canvasContext.restore();
		}
	}



	canvasContext.restore();
}
