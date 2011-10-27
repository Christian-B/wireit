/**
 * TavernaLanguage
 */
var tavernaLanguage = {

	language: {
	
		languageName: "tavernaTestLanguage",
	
		modules: [
			{
				"name": "Echo",
				"category": "Taverna Workflow",
				"description": "Echoes input to output",
				"container" : {
					"xtype":"WireIt.TavernaWFContainer",
					"inputs": ["Bar"],
					"outputs": ["Foo"],
					"wfURI":"Echo.t2flow"
				}
			},
			{
				"name": "HelloWorld",
				"category": "Taverna Workflow",
				"container": {
					"xtype":"WireIt.TavernaWFContainer",
					"inputs": [],
					"outputs": ["Foo"],
					"wfURI":"HelloWorld.t2flow",
				}
			},
			{
				"name": "Triple Echo",
				"category": "Taverna Workflow",
				"container": {
					"xtype":"WireIt.TavernaWFContainer",
					"inputs": ["in_Left","in_Middle","in_Right"],
					"outputs": ["out_Left","out_Middle","out_Right"],
					"wfURI":"ThreeStrings.t2flow",
				}
			},
			{
				"name": "Simple Input",
				"category": "Input",
				"container": {
					"xtype": "WireIt.FormContainer",
					"title": "input",
					"fields": [
						{
							"inputParams": {
								"label": "Value", 
								"name": "output",
								"required": true
							}
						},
					],
					"terminals": [
						{
							"name": "output",
							"direction": [0,1],
							"offsetPosition": {"right": -14, "top": 25},
							"alwaysSrc":true,
							"ddConfig": {
								"type": "outputString",
								"allowedTypes": ["inputString","inputDepthZero"]
							}
						}
					]
				}
			},
			{
				"name": "URL Input",
				"category": "Input",
				"container": {
					"xtype": "WireIt.FormContainer",
					"width": 350,
					"title": "input",
					"fields": [
						{
							"type": 'url',
							"inputParams": {
								"label": "URL", 
								"name": "output",
								"required": true
							}
						},
					],
					"terminals": [
						{
							"name": "output",
							"direction": [0,1],
							"offsetPosition": {"right": -14, "top": 25},
							"alwaysSrc":true,
							"ddConfig": {
								"type": "outputURL",
								"allowedTypes": ["inputURL","inputDepthZero"]
							}
						}
					]
				}
			},
			{
				"name": "List Input",
				"category": "Input",
				"container": {
					"xtype": "WireIt.FormContainer",
					"title": "Input test",
					"fields": [{"type": "text", "inputParams": {"label": "List values", "name": "output", "wirable": false }} ],
					"terminals": [
						{
							"name": "output",
							"direction": [0,1],
							"offsetPosition": {"right": -14, "top": 75},
							"alwaysSrc":true,
							"ddConfig":{
								"type": "outputList",
								"allowedTypes": ["inputDepthOne"]
							}
						}
					]
				}
			},
			{
				"name": "Simple Output",
				"category": "Output",
				"description": "Workflow output",
				"container": {
					"xtype": "WireIt.FormContainer",
					"title": "output",
					"fields": [ 
						{"type": "string", "inputParams": {"label": "Value", "name": "input", "wirable": false}}
					],
					"terminals": [
						{
							"name": "input",
							"direction": [0,-1],
							"offsetPosition": {"left": -14, "top": 25 },
							"ddConfig": {
								"type": "inputString",
								"allowedTypes": ["outputString"]
							},
							"nMaxWires": 1
						}
					]
				}
			},
			{
				"name": "URL Output",
				"category": "Output",
				"description": "Workflow output",
				"container": {
					"width": 350,
					"xtype": "WireIt.FormContainer",
					"title": "output",
					"fields": [ 
						{
							"type": 'url',
							"inputParams": {
								"label": "URL",
								"name": "input",
								"wirable": false
						}	}
					],
					"terminals": [
						{
							"name": "input",
							"direction": [0,-1],
							"offsetPosition": {"left": -14, "top": 25 },
							"ddConfig": {
								"type": "inputURL",
								"allowedTypes": ["outputURL"]
							},
							"nMaxWires": 1
						}
					]
				}
			},
			{
				"name": "PassThrough",
				"container": {
					"xtype": "WireIt.FormContainer",
					// inputEx options :
					"collapsible": true,
					"legend": "here comes the passthrough...",
					"fields": [
						{"type": "string", "inputParams": {"label": "PassThrough", "name": "both", "required": false } },
					],
					"terminals": [
						{
							"name": "input",
							"direction": [0,-1],
							"offsetPosition": {"left": -14, "top": 33 },
							"ddConfig": {
								"type": "inputString",
								"allowedTypes": ["outputString"]
							},
							"nMaxWires": 1
						},
						{
							"name": "output",
							"direction": [0,1],
							"offsetPosition": {"right": -14, "top": 33},
							"alwaysSrc":true,
							"ddConfig": {
								"type": "outputString",
								"allowedTypes": ["inputString","inputDepthZero"]
							}
						}
					]
				}
			},
			{
				"name": "comment",
				"container": {
					"xtype": "WireIt.FormContainer",
					"title": "My Comment",
					"fields": [
						{"type": "text", "inputParams": {"label": "", "name": "comment", "wirable": false }}
					]
				},
				"value": {
					"input": {
						"type":"url","inputParams":{}
					}
				}
			},
		]
	},

	/**
	 * @method init
	 * @static
	 */
	init: function() {

		try {
			this.language.adapter = WireIt.WiringEditor.adapters.AjaxAdapter;

			this.editor = new tavernaLanguage.WiringEditor(this.language);

			// Open the infos panel
			//this.editor.accordionView.openPanel(2);
			
			//Open the minimap
			this.editor.accordionView.openPanel(1);
		} catch(ex) {
			console.log("Error while initialising: ", ex);
		}
	},

	/**
	 * Execute the module in the "ExecutionFrame" virtual machine
	 * @method run
	 * @static
	 */
	run: function() {
		var ef = new ExecutionFrame( this.editor);
		ef.run();
	}

};


