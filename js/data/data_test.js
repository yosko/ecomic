var gData_Default = {
	defaultImage: "img/bits-maxim.png",
	sprouts: {
		"HUMAN_ROOT" : {
			links: [
				{ linkName:"SHADOW", x:0, y:0 },
				{ linkName:"BODY", x:0, y:0 },
				{ linkName:"POST_EFFECT", x:0, y:-22 },
			],
		},

		"HUMAN_SHADOW" : {
			sprite: { x:56, y:24, width:33, height:11, anchorx:16, anchory:5 },
		},

		"BODY_MAXIM_STAND" : {
			sprite: { x:0, y:0, width:24, height:22, anchorx:12, anchory:20 },
			links: [
				{ linkName:"HEAD", x:0, y:-15 },
			],
		},
		"BODY_MAXIM_POINT" : {
			sprite: { x:25, y:0, width:30, height:22, anchorx:12, anchory:20 },
			links: [
				{ linkName:"HEAD", x:0, y:-15 },
			],
		},
		"BODY_MAXIM_SHRUG" : {
			sprite: { x:56, y:0, width:32, height:22, anchorx:15, anchory:20 },
			links: [
				{ linkName:"HEAD", x:0, y:-15 },
			],
		},

		"HEAD_BASIC_MALE" : {
			sprite: { x:0, y:23, width:26, height:26, anchorx:13, anchory:23 },
			links: [
				{ linkName:"MOUTH", x:0, y:-1 },
				{ linkName:"L_EYE", x:-1, y:-6 },
				{ linkName:"R_EYE", x:4, y:-6 },
				{ linkName:"HAIR", x:0, y:-12 },
			],
		},
		"HAIR_MAXIM" : {
			sprite: { x:27, y:23, width:26, height:26, anchorx:13, anchory:11 },
		},

		"LEYE_BASIC_MALE" : {
			sprite: { x:0, y:55, width:8, height:7, anchorx:3, anchory:3 },
		},
		"LEYE_BASIC_MALE_ANGRY" : {
			sprite: { x:9, y:55, width:8, height:7, anchorx:3, anchory:3 },
		},
		"LEYE_BASIC_MALE_VANGRY" : {
			sprite: { x:18, y:55, width:8, height:7, anchorx:3, anchory:3 },
		},

		"REYE_EYEPATCH" : {
			sprite: { x:0, y:63, width:10, height:9, anchorx:5, anchory:5 },
		},

		"MOUTH_BASIC_MALE" : {
			sprite: { x:0, y:50, width:8, height:4, anchorx:2, anchory:2 },
		},
		"MOUTH_BASIC_MALE_TALK" : {
			sprite: { x:9, y:50, width:8, height:4, anchorx:2, anchory:2 },
		},
		"MOUTH_BASIC_MALE_TALK2" : {
			sprite: { x:18, y:50, width:8, height:4, anchorx:2, anchory:2 },
		},
	}, // end sprouts


	templates: {
		"MAXIM_DEFAULT" : {
			"ROOT" : {sproutName:"HUMAN_ROOT"},
			"SHADOW":{sproutName:"HUMAN_SHADOW", alpha:0.30},
			"BODY" : {sproutName:"BODY_MAXIM_STAND"},
			"HEAD" : {sproutName:"HEAD_BASIC_MALE"},
			"HAIR" : {sproutName:"HAIR_MAXIM"},
			"L_EYE": {sproutName:"LEYE_BASIC_MALE"},
			"R_EYE": {sproutName:"REYE_EYEPATCH"},
			"MOUTH": {sproutName:"MOUTH_BASIC_MALE"},
		},
		"MAXIM_POINTING" : {
			"BODY" : {sproutName:"BODY_MAXIM_POINT"},
		},
		"ANGRY" : {
			"L_EYE": {sproutName:"LEYE_BASIC_MALE_ANGRY"},
		},
		"LOOKING_BACK" : {
			"HEAD": {flipped:true},
		},
		"MAXIM_HOVERING" : {
			"BODY": {offsety:-8},
		}
	}, // end templates

	backdrops: {
		"WARRIORS_GUILD" : {
			image:"img/place/warguild.png",
			width:375,
			height:95,
			defaults: {
				 "DOOR":false,
				 "DESK":true,
			}, // end defaults
			sweetSpots: {
				"BEHIND_DESK" : { x:200, y:72, layer:0 },
				"DESK_LEFT"   : { x:169, y:87, layer:1 },
				"DESK_RIGHT"  : { x:229, y:87, layer:1 },
				"IN_DOOR"     : { x:283, y:60, layer:1 },
				"DOOR_RIGHT"  : { x:320, y:85, layer:1 },
			}, // end sweetSpots
			layers: [
				[   // layer 0
					/* backdrop */  {x:0, y:0, width:375, height:95, drawx:0, drawy:0},
					{trigger:"DOOR", x:1, y:96, width:37, height:47, drawx:264, drawy:18},
				],[ // layer 1
					/* desk */ {x:39, y:96, width:69, height:26, drawx:166, drawy:55},
				],
			], // end layers
		}, // end WARRIORS_GUILD
	}, // end backdrops

	scenes: {
		"SCENE2" : {
			"backdrop": "WARRIORS_GUILD",
			"backdropDefaults": {"DOOR":false},
			"actors": {
				"MAXIM"  : { "templateName":"MAXIM", "sweetSpot":"BEHIND_DESK" },
				"MAXIM2" : { "templateName":"MAXIM", "sweetSpot":"DESK_LEFT" },
				"MAXIM3" : {
					"templateName":"MAXIM",
					"sweetSpot":"DESK_RIGHT",
					"x":40, "y":80, "layer":1,
					"state":["POINTING", "ANGRY"],
					"flipped":true }
			}
		}
	}
};
