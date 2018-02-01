Comic Engine
=====

Ease generation of pixel art webcomic strips/panels using sprites/sprouts. Once configured, and throught the use of a single and relatively simple JSON file, this engine an:
* Define the number of panels, their width, their row
* Define scenes and backdrops
* Define actors present and scene used in each panel
* Define the template (group of properly order/aligned sprouts) used for the visual representation of each actor
* Update scene focus, backdrops elements, actors position/representation in each panel
* Keep a persistance of each update, so that every update to a panel will be applied to every following panel using this scene

## Credits and Licence

This Javascript based comic engine is based on the work of Sean Howard at [squidi.net](http://www.squidi.net/threep/eComic/index.php). As he mentions here, this code was //PUBLIC DOMAIN and may be used for any reason and in any manner desired. Just don't be a jerk about it//. The initial commit on this repository is Sean Howard's work untouched.

Unless stated otherwise explicitely, every updates here are also released to the PUBLIC DOMAIN.

## Documentation

### Change source PNGs
If you wish to use your own sprouts, here is a list of each image file, what they are used for and how to replace them.

#### Header
This is the title header that will apprear above the panels of each comic strip.

In ```main.js```, change the following line:
```js
var gMastheadImage = "img/masthead.png";
```

#### Bits
The bits file is a juxtaposition of every one of the sprouts/sprites for your actors (body parts, items, etc...)

At the end of ```main.js``` in the function ```initializeGame```, change the following line:
```js
prepareToLoadImage( "img/bits-maxim.png" );
```

In the loaded data file (default: ```data_test.js```), change the line:
```js
defaultImage: "img/bits-maxim.png",
```

#### Background
Represents places where scenes happen.

At the end of ```main.js``` in the function ```initializeGame```, change the following line:
```js
prepareToLoadImage( "img/place/warguild.png" );
```

In the loaded data file (default: ```data_test.js```), define a background image for each **backdrop**:
```json
backdrops: {
    "WARRIORS_GUILD" : {
        "image":"img/place/warguild.png",
		
	}
}
```

### Data
The data that can define sprouts, templates and backdrops is in the form of a JSON object sent to ```initDataFile()``` ressembling the following:
```json
{
    defaultImage: "",
    sprouts: {},
    templates: {},
    backdrops: {},
    scenes: {},
}
```

Each of its part are documented below.
	        
### Sprouts

### Templates
When applyling an actor's state, it is based on a template, which is a list of sprout keys. For each sprout key, the following can be defined (all optional):

* ```sproutName```: a specific sprout.
* ```offsetx```: apply an horizontal offest to sprout key position.
* ```offsety```: apply a vertical offest to sprout key position.
* ```flipped```: indicates if template is flipped horizontally by default.
* ```alpha```: define transparency level (between 0.0 and 1.0).

Example:
```json
templates: {
    "TEMPLATE_NAME": {
        "SPROUT_KEY": {
            sproutName: "SPROUT_NAME",
            [...]
        },
        [...]
    },
    [...]
},
```

### Backdrops
A backdrop is a background image depicting a place, and a number of layers in which can be placed actors or other elements of the background that can appear above actors and/or can (dis)appear.

**WORK IN PROGRESS**

### Scenes
Scenes can be defined either in the data file along with sprouts, sprout keys and backdrops, or in the comic data file, along with comics. Scenes in comic file override scenes in data file. Examples can be found in ```data_test.js``` or ```data_testscene.js```.
	        
#### Actors
* ```templateName```: template name (without the _DEFAULT nor any other suffix)
* ```sweetSpot```: sweet spot where to place actor
* ```x```: coordinates where to place actor
* ```y```: coordinates where to place actor
* ```layer```: defines in which layer the actor will appear
* ```flipped```: indicates if actor should be flipped horizontally.
* ```state```: (array) apply a list of states defined alongside with the templates

### Comics
A comic is a page/strip. It can be constituted of one or more rows of panels Comics are defined in ```data_testscene.js```.

**WORK IN PROGRESS**

#### Panels
A panel is defined within a comic, and depicts one particulare scenes (from the scenes declared before).

**WORK IN PROGRESS**

##### Scene updates

List of updates to apply to the scene from this point/panel and beyond.

###### Focus updates
* ```["focusOn", "ACTOR_NAME"]```: defines **actor** to set focus on
* ```["focusOnSpot", "SPOT_NAME"]```: defines current backdrop's **sweet spot** to set focus on
* ```["focusBetween", "ACTOR_NAME_1", "ACTOR_NAME_2"]```: defines two actors to set focus in between.
* ```["focusAt", X_COORD, Y_COORD]```: defines **absolute coordinates** to set focus on.
* ```["shiftFocus", X_COORDINATE, Y_COORD]```: defines coordinates to set focus on, **relative to previous focus**.

###### Backdrop updates
* ```["changeBackdropState", "TRIGGER_NAME", BOOL_VALUE]```: change state of an existing trigger defined for this background.</li>

###### Actor position and layer updates</h6>
* ```["actorMoveToSpot", "ACTOR_NAME", "SPOT_NAME"]```: move actor to current backdrop's sweet spot.
* ```["actorMoveTo", "ACTOR_NAME", X_COORD, Y_COORD]```: move actor to absolute coordinates.
* ```["actorShift", "ACTOR_NAME", X_COORD, Y_COORD]```: move actor to coordinates relative to his/her previous position.
* ```["actorChangeLayer", "ACTOR_NAME", LAYER_ID]```: move actor to another layer (to place him/her behind or in front of other elements).

###### Actor state updates
* ```["actorReset", "ACTOR_NAME"]```: rest actor to his/her original state.
* ```["actorFlip", "ACTOR_NAME", BOOL_VALUE]```: indicates if actor should be horizontally flipped (change direction (s)he is looking).
* ```["actorApplyState", "ACTOR_NAME", "STATE_1", "STATE_2", etc...]```: apply a list of different states to apply to the actor.
* ```["actorSetSprout", "ACTOR_NAME", "SPROUT_KEY", "SPROUT_NAME"]```: define a specific sprout key to replace on actor with given sprout, without using a template.
* ```["actorReset", "ACTOR_NAME", BOOL_VALUE]```: defines if actor is visible or not.
