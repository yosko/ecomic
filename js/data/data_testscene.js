{
	"scenes" : {
		"SCENE1" : {
			"backdrop": "WARRIORS_GUILD",
			"backdropDefaults": {"DOOR":false},
			"actors": {
				"MAXIM"  : { "templateName":"MAXIM", "sweetSpot":"BEHIND_DESK" },
				"MAXIM2" : { "templateName":"MAXIM", "sweetSpot":"DESK_LEFT" },
				"MAXIM3" : {
					"templateName":"MAXIM",
					"sweetSpot":"DESK_RIGHT",
					"x":40, "y":80, "layer":1,
					"state":["POINTING", "ANGRY", "HOVERING"],
					"flipped":true }
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
					"sceneUpdates": [
						["changeBackdropState", "DOOR", true],
						["focusOn", "MAXIM"]
					]
				},{
					"gridLocation":[1,0],
					"panelsWide":2,
					"sceneUpdates": [
						["actorFlip", "MAXIM3"],
						["focusBetween", "MAXIM3", "MAXIM2"]
					]
				},{
					"gridLocation":[3,0],
					"panelsWide":1,
					"sceneUpdates": [
						["actorReset", "MAXIM3"],
						["focusOnSpot", "IN_DOOR"]
					]
				},{
					"gridLocation":[0,1],
					"panelsWide":2,
					"sceneUpdates": [
						["actorFlip", "MAXIM"],
						["actorMoveToSpot", "MAXIM", "IN_DOOR"],
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
					"sceneUpdates": [
						["actorSetVisible", "MAXIM2", true],
						["focusOn", "MAXIM2"]
					]
				}
			]
		}
	]
}
