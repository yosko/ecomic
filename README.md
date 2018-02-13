Comic Engine
=====

Easy generation of pixel art webcomic strips/panels using sprites/sprouts. Once configured, and through the use of
a single and relatively simple JSON file, this engine can:
* Define the number of panels, their width, their row
* Define scenes and backdrops
* Define actors and scene used in each panel
* Define the template (group of properly order/aligned sprouts) used for the visual representation of each actor
* Update scene focus, backdrop elements, actors position/representation in each panel
* Keep a persistance of each update, so that every update to a panel will be applied to every following panel using this scene

Demo
-----

Demonstration available on the [Github page](https://yosko.github.io/ecomic/) of this repository.

Credits and Licence
-----

This Javascript based comic engine is based on the work of Sean Howard at [squidi.net](http://www.squidi.net/threep/eComic/index.php).
As he mentions there, this code is *PUBLIC DOMAIN and may be used for any reason and in any manner desired. Just don't be a jerk about it*.
The initial commit on this repository is Sean Howard's work untouched
(except the ```index.html``` which is new, but designed to make the same use of the prototype).

Unless stated otherwise explicitely, every updates here are also released to the PUBLIC DOMAIN.

Features
=====

List of features that were aded here (e.g. things that differ from the original eComic):
* ```gSettings``` object to make tweaking (sizes, ratios, path to images used, ...) easier and a bit more advanced
* logging to the console of a few more detected errors
* the documentation ([see below](#documentation))

Documentation
=====

Settings
-----

If you wish to use your own sprouts, backgrounds, header images, or your own custom settings, or change panels, margins, rows or
comics sizes and quantities, you first need to create a javascript file in ```js/data/``` named ```custom.js```, in wich
you can override any of these settings:

```js
// path to the "bits" image (sprites)
gSettings.BitsFile = "img/bits-maxim.png";

// path to the background image. Represents places where scenes happen.
gSettings.BackdropFile = "img/place/warguild.png";

// path to the header image
// This is the title header that will apprear above the panels of each comic strip.
gSettings.MastheadImage = "img/masthead.png";

// path to the Javascript file describing the scenes and comics.
// The bits file is a juxtaposition of every one of the sprites for your actors (body parts, items, etc...).
gSettings.SceneFile = "js/data/data_testscene.js";

// Absolute numeric values
gSettings.FramesPerSecond = 30; // unused
gSettings.ComicWidth = 640;        // width of each final comic image (in pixels)
gSettings.HeaderHeight = 48;    // height of the gSettings.MastheadImage image file (in pixels)
gSettings.PanelRatio = 3.8 / 3;    // ratio (height / width) of a single panel of the smallest size (panel size is {75,95} on Sean Howard's comics, which is close to 4/3 but not quite)
gSettings.PanelsPerRow = 4; // maximum number of panels of the smallest size on each row
gSettings.GlobalPixelScale = 2; // zoom (scaling does not apply on header)

// Numeric values bound to be scaled (multiplied by GlobalPixelScale)
gSettings.BorderSize = 1;   // black border around each panel (in pixels)
gSettings.PanelMargin = 1;  // margin between panels (in pixels)
gSettings.ComicMargin = 4;  // margin on the left, right and bottom of each comic (in pixels)

// background color for the comic (and each panel if there is no background image)
gSettings.backgroundColor = "#ffffff";

// border color for each panel
gSettings.borderColor = "#000000";

// data object for sprouts, templates and (optionally) scenes
// If not set here, then the object```gData_Default```set in ```data_test.js``` will be used.
gData = {};
```

Data object
-----
The data that can define sprouts, templates and backdrops is in the form of a Javascript object sent to ```initDataFile()```
ressembling the following:
```js
gData = {
    // relative path to image file
    "defaultImage": "",
    
    // list of sprouts. See **Sprouts** section below
    "sprouts": {},
    
    // list of templates. See **Templates** section below.
    "templates": {},
    
    // list of backdrops. See **Backdrops** section below.
    "backdrops": {},
    
    // list of scenes. See **Scenes** section below.
    "scenes": {},
}
```

Scene file
-----
The scene file that can define scenes and comics (strips/pages) is in the form of a JSON object sent to ```fetchDefaultSceneFile()```
(so that it appears in the textarea). Once in the textarea, this content can be used calling ```loadSceneJSON()```.

Base content (a list of scenes and a list of comics, both described in the following sections):
```js
{
    "scenes" : {},
    "comics" : []
}
```

Each of its part are documented below.
            
Sprouts
-----
Each sprout represant either a visual element or a container linked to other visual element (children). It can be both!.

Note that every children will be displayed **above** their parent and in the order of the links definition.

If it has a direct visual representation, then there must be a ```sprite``` declared with the following settings:
* ```x```: horizontal coordinates of the visual representation on the "bits" image
* ```y```: vertical coordinates of the visual representation on the "bits" image
* ```width```: width of the visual representation on the "bits" image
* ```height```: height of the visual representation on the "bits" image
* ```anchorx```: horizontal position of the anchor (between 0 and width - 1)
* ```anchory```: vertical position of the anchor (between 0 and height - 1)

If it has links to other elements (children), then these links can be described with the following settings:
* linkName: name of the **template** to attach
* x: horizontal position of the anchor for this child
* y: vertical position of the anchor for this child

Example:
```js
"HEAD_BASIC_MALE" : {
    sprite: { x:0, y:23, width:26, height:26, anchorx:13, anchory:23 },
    links: [
        { linkName:"MOUTH", x:0, y:-1 },
        { linkName:"L_EYE", x:-1, y:-6 },
        { linkName:"R_EYE", x:4, y:-6 },
        { linkName:"HAIR", x:0, y:-12 },
    ],
},
```

In this example, this sprout is a head. Its visual representation is a 26 pixel square and it appears on the "bits" image at {0,23}.
Its anchor will be {13,23}, which will be at the horizontal center (13 = 26/2) and almost at the bottom (23 on 26): it is the neck.

This head has a link to a **MOUTH** (the template for a mouth). Note that it is not indicated here which mouth. It is just a link to *a* mouth.
The link between the mouth and the head will be at {0,-1}, which is relative to the head anchor: the mouth will be 1 pixel above the neck.

Templates
-----
When applyling an actor's state, it is based on a template, which is a list of sprout keys. For each sprout key,
the following can be defined (all optional):

* ```sproutName```: a specific sprout.
* ```offsetx```: apply an horizontal offest to sprout key position.
* ```offsety```: apply a vertical offest to sprout key position.
* ```flipped```: indicates if template is flipped horizontally by default.
* ```alpha```: define transparency level (between 0.0 and 1.0).

Example:
```js
"TEMPLATE_NAME": {
    "SPROUT_KEY": {
        "sproutName": "SPROUT_NAME",
        
    },
    
},
```

Backdrops
-----
A backdrop is a background image depicting a place, and a number of layers in which can be placed actors or other specific elements of the background (called *props*)
that can appear above actors and/or can (dis)appear.

Example:
```js
"WARRIORS_GUILD" : {
    // path to the source image including background and props
    image: "img/place/warguild.png",
    
    // size of the complete displayable place
    width: 375,
    height: 95,
    
    // complete List of triggers and their original state
    defaults: {
        "TRIGGER_NAME": true,
    },
    
    // complete list of sweet spots and their position
    sweetSpots: {
        "SWEET_SPOT_NAME" : { x:200, y:72, layer:0 },
    },
    layers: [
        [   // layer 0
            /* backdrop */  {x:0, y:0, width:375, height:95, drawx:0, drawy:0},
        ],[ // layer 1
            {trigger:"TRIGGER_NAME", x:1, y:96, width:37, height:47, drawx:264, drawy:18},
            {x:1, y:96, width:37, height:47, drawx:264, drawy:18, flipped:true, vflipped:true},
        ],
    ],
},
```

You can define multiple props for a backdrop. These props may represent a door, a desk, a tree or anything you like. The base image for the backdrop is also defined as a prop.
* A prop within layer N will always appear above props (and actors) of layer N-1.
* A prop within layer N will always appear under the actors of the same layer.
* Some props can be linked to a trigger. This mean they can appear in the scene or not, depending on the state of the trigger
  (which can be defined in the backdrops default, and then changed in the scene's ```backdropDefaults``` or even on a panel basis via ```changeBackdropState```).
* Each prop is defined by its ```{x,y}``` coordinates (where they should appear on the image file depicting the place),
  their ```{width,height}``` and the ```{drawx,drawy}``` coordinates where they should appear in the backdrop.
* Each prop can be flipped horizontally by adding ```flipped:true``` and/or vertically by adding ```vflipped:true```.

Scenes
-----

Scenes can be defined either in the data file along with sprouts, sprout keys and backdrops, or in the comic data file, along with comics.
Scenes in comic file override scenes in data file. Examples can be found in the data file (```data_test.js```)
or the scene file (```data_testscene.js```).

```js
"SCENE_NAME" : {
	"backdrop": "BACKDROP_NAME", // references an existing backdrop
	"backdropDefaults": {"TRIGGER_NAME":false}, // set some of the existing triggers (they can still be changed on a Panel level)
	"actors": {
		"ACTOR_NAME"  : {
		    // see Actors section on what to set here
        },
        
	}
},
```

### Actors
* ```templateName```: template name (without the _DEFAULT nor any other suffix)
* ```sweetSpot```: sweet spot where to place actor
* ```x```: coordinates where to place actor
* ```y```: coordinates where to place actor
* ```layer```: defines in which layer the actor will appear
* ```flipped```: indicates if actor should be flipped horizontally.
* ```state```: (array) apply a list of states defined alongside with the templates

Comics
-----

A comic is a page/strip. It can be constituted of one or more rows of panels Comics are defined in ```data_testscene.js```.

```js
"comics" : [
{
    "name": "ecumeuses-01-01",
    "rows": 3, // how many rows of panels to display
    "panels": [] // list of panels (see Panels section)
}
```

### Panels
A panel is defined within a comic, and depicts one specific scenes (from the scenes declared before).

```js
{
    // for a
    "gridLocation":[0,0],
    "panelsWide":1,
    "panelsHigh":1,
    "scene":"Scene_1",
    "sceneUpdates": []  // list of updates (see Scene updates section)
}
```

The panel in the gridLocation [x,y] will be on the (x+1) position in the (y+1) row. A detailed example of this grid system:

If you want to have the following :
* 1st row: a triple panel and a single one
* 2nd row: two single panel and a double one
* 3rd row: a quadruple panel

Then you will need to declare :
```js
"comics" : [
{
    "name": "test-panel",
    "rows": 3,
    "panels": [
        // The first row
        { "gridLocation":[0,0], "panelsWide":3, },
        { "gridLocation":[1,0], "panelsWide":1, },
        
        { "gridLocation":[0,1], "panelsWide":1, },
        { "gridLocation":[1,1], "panelsWide":1, },
        { "gridLocation":[2,1], "panelsWide":2, },
        
        { "gridLocation":[0,2], "panelsWide":4, },
    ]
}
```

What it will look like:
```
[       ][ ]
[ ][ ][    ]
[          ]
```

#### Scene updates

List of updates to apply to the scene from this point/panel and beyond.

##### Focus updates
* ```["focusOn", "ACTOR_NAME"]```: defines **actor** to set focus on
* ```["focusOnSpot", "SPOT_NAME"]```: defines current backdrop's **sweet spot** to set focus on
* ```["focusBetween", "ACTOR_NAME_1", "ACTOR_NAME_2"]```: defines two actors to set focus in between.
* ```["focusAt", X_COORD, Y_COORD]```: defines **absolute coordinates** to set focus on.
* ```["shiftFocus", X_COORDINATE, Y_COORD]```: defines coordinates to set focus on, **relative to previous focus**.

##### Backdrop updates
* ```["changeBackdropState", "TRIGGER_NAME", BOOL_VALUE]```: change state of an existing trigger defined for this background.</li>

##### Actor position and layer updates</h6>
* ```["actorMoveToSpot", "ACTOR_NAME", "SPOT_NAME"]```: move actor to current backdrop's sweet spot.
* ```["actorMoveTo", "ACTOR_NAME", X_COORD, Y_COORD]```: move actor to absolute coordinates.
* ```["actorShift", "ACTOR_NAME", X_COORD, Y_COORD]```: move actor to coordinates relative to his/her previous position.
* ```["actorChangeLayer", "ACTOR_NAME", LAYER_ID]```: move actor to another layer (to place him/her behind or in front of other elements).

##### Actor state updates
* ```["actorReset", "ACTOR_NAME"]```: rest actor to his/her original state.
* ```["actorFlip", "ACTOR_NAME", BOOL_VALUE]```: indicates if actor should be horizontally flipped (change direction (s)he is looking).
* ```["actorApplyState", "ACTOR_NAME", "STATE_1", "STATE_2", etc...]```: apply a list of different states to apply to the actor.
* ```["actorSetSprout", "ACTOR_NAME", "SPROUT_KEY", "SPROUT_NAME"]```: define a specific sprout key to replace on actor with given sprout, without using a template.
* ```["actorReset", "ACTOR_NAME", BOOL_VALUE]```: defines if actor is visible or not.
