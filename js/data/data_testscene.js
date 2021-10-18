{
	"scenes" : {
		"SCENE1" : {
			"backdrop": "WARRIORS_GUILD",
			"backdropDefaults": {"DOOR":false},
			"actors": {
				"MAXIM"  : { "templateName":"MAXIM", "sweetSpot":"BEHIND_DESK" },
				"MAXIM2" : { "templateName":"MAXIM_BLUE", "sweetSpot":"DESK_LEFT" },
				"MAXIM3" : {
					"templateName":"MAXIM",
					"sweetSpot":"DESK_RIGHT",
					"x":40, "y":80, "layer":1,
					"state":["POINTING", "ANGRY", "HOVERING"],
					"flipped":true
				}
			}
		}
	},

	"comics" : [
		{
			"name":"amdonline-001",
			"rows":2,
			"panels":[ {
					"gridLocation":[0,0],
					"panelsWide":1,
					"scene":"SCENE1",
					"wordBubbles": [
						[
							{"name":"A", "def":["bubble",75,0, 75, 64] }
						],[
							{"name":"BOX", "def":["box",0,0] }
						]
					],
					"dialogue": {
						"A": {
							"speaker":"MAXIM",
							"textLines": [
								"Hello, World!",
								"Now is the time for all good",
								"men to come to the aid of their country. Friends,",
								"countrymen - Lend me your ears.",
								"But not your feet. You",
								"can keep those."
							]
						},
						"BOX": {
							"textLines": ["Previously..."]
						}
					},
					"sceneUpdates": [
						["changeBackdropState", "DOOR", true],
						["focusOn", "MAXIM"]
					]
				},{
					"gridLocation":[1,0],
					"panelsWide":2,
					"wordBubbles": [
						[ {"name":"A", "def":["bubble",150,64, 150, 64] } ]
					],
					"dialogue": {
						"A": {
							"speaker":"MAXIM2",
							"pointOffsetX":0,
							"pointerOriginOffsetX":36,
							"pointerOriginOffsetY":20,
							"pointerOriginRadiusL":60,
							"pointerOriginRadiusR":24,
							"textLines": [
								"Hey, I think",
								"there might be someone",
								"at the door..."
							]
						}
					},
					"sceneUpdates": [
						["actorFlip", "MAXIM3"],
						["focusBetween", "MAXIM3", "MAXIM2"]
					]
				},{
					"gridLocation":[3,0],
					"panelsWide":1,
					"wordBubbles": [
						[ {"name":"A", "def":["bubble",75,64, 32, 16] } ]
					],
					"dialogue": {
						"A": {
							"speaker":"MAXIM3",
							"textMarginSize":40,
							"textLines": [
								"Nah."
							]
						}
					},
					"sceneUpdates": [
						["actorReset", "MAXIM3"],
						["focusOnSpot", "IN_DOOR"]
					]
				},{
					"gridLocation":[0,1],
					"panelsWide":2,
					"wordBubbles": [
						[ {"name":"A", "def":["bubble",220, 64] } ]
					],
					"dialogue": {
						"A": {
							"speaker":"MAXIM3",
							"textLines": [
								"Hey, I think",
								"there might be someone",
								"at the door..."
							]
						}
					},
					"sceneUpdates": [
						["actorFlip", "MAXIM"],
						["actorMoveToSpot", "MAXIM", "IN_DOOR"],
						["actorApplyState", "MAXIM", "UPSIDE_DOWN"],
						["changeBackdropState", "DOOR", false],
						["focusOnSpot", "IN_DOOR"],
						["shiftFocus", -30, 0]
					]
				},{
					"gridLocation":[2,1],
					"panelsWide":2,
					"sceneUpdates": [
						["focusOn", "MAXIM2"],
						["focusOnSpot", "IN_DOOR"]
					]
				}
			]
		}, {
			"name":"amdonline-002",
			"rows":3,
			"panels":[ {
					"gridLocation":[0,0],
					"scene":"SCENE1",
					"sceneUpdates": [
						["focusOn", "MAXIM"]
					]
				},{
					"gridLocation":[1,0],
					"sceneUpdates": [
						["changeBackdropState", "DOOR", true],
						["actorReset", "MAXIM"],
						["actorMoveToSpot", "MAXIM", "BEHIND_DESK"],
						["focusBetween", "MAXIM3", "MAXIM2"]
					]
				},{
					"gridLocation":[2,0],
					"sceneUpdates": [
						["actorChangeLayer", "MAXIM", 1],
						["actorShift", "MAXIM", 0, 15],
						["focusBetween", "MAXIM3", "MAXIM2"]
					]
				},{
					"gridLocation":[3,0],
					"panelsWide":1,
					"sceneUpdates": [
						["actorSetSprout", "MAXIM", "HEAD", "HAIR_MAXIM"],
						["actorApplyState", "MAXIM2", "POINTING", "ANGRY", "LOOKING_BACK", "HOVERING"],
						["changeBackdropState", "DOOR", false],
						["focusOnSpot", "IN_DOOR"]
					]
				},{
					"gridLocation":[0,1],
					"panelsWide":4,
					"sceneUpdates": [
						["actorSetVisible", "MAXIM2", false],
						["focusOn", "MAXIM"]
					]
				},{
					"gridLocation":[0,2],
					"panelsWide":4,
					"wordBubbles": [
						[
							{"name":"A", "def":["bubble",170 ,64, 75, 64] },
							{"name":"AtoB", "def":["line",170,64,500,80] },
							{"name":"B", "def":["bubble",500 ,80, 75, 64] }
						],[
							{"name":"BOX", "def":["box",0,0] }
						]
					],
					"dialogue": {
						"A": {
							"speaker":"MAXIM3",
							"textLines": [
								"Hello, World!",
								"Now is the time for all good",
								"men to come to the aid of their country. Friends,",
								"countrymen - Lend me your ears.",
								"But not your feet. You",
								"can keep those."
							]
						},
						"AtoB": {
							"speaker":"MAXIM3"
						},
						"B": {
							"speaker":"MAXIM3",
							"bDrawPointer":false,
							"textLines": [
								"Well, that's",
								"what I think, anyways.",
								"Bye bye"
							]
						},
						"BOX": {
							"textLines": [
								"This is two lines of text.",
								"Don't read it. You suck."
							]
						}
					},
					"sceneUpdates": [
						["actorSetVisible", "MAXIM2", true],
						["focusOn", "MAXIM2"]
					]
				}
			]
		}
	]
}
