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
					"inputs": [{"name":"Bar", "depth":0}],
					"outputs": [{"name":"Foo", "depth":0}],
					"wfURI":"Echo.t2flow"
				}
			},
			{
				"name": "HelloWorld",
				"category": "Taverna Workflow",
				"container": {
					"xtype":"WireIt.TavernaWFContainer",
					"inputs": [],
					"outputs": [{"name":"Foo", "depth":0}],
					"wfURI":"HelloWorld.t2flow",
				}
			},
			{
				"name": "Triple Echo",
				"category": "Taverna Workflow",
				"container": {
					"xtype":"WireIt.TavernaWFContainer",
					"inputs": [
						{"name":"in_Left", "depth":0},
						{"name":"in_Middle", "depth":0},
						{"name":"in_Right", "depth":0}],
					"outputs": [
						{"name":"out_Left", "depth":0},
						{"name":"out_Middle", "depth":0},
						{"name":"out_Right", "depth":0}],
					"wfURI":"ThreeStrings.t2flow",
				}
			},
			{
				"name": "Mixed Concatenation",
				"category": "Taverna Workflow",
				"container": {
					"xtype":"WireIt.TavernaWFContainer",
					"inputs": [
						{"name":"LeftList", "depth":1},
						{"name":"LeftNoList", "depth":0},
						{"name":"RightList", "depth":1},
						{"name":"RightNoList", "depth":0}],
					"outputs": [{"name":"Result", "depth":0}],
					"wfURI":"MixedWorkflow.t2flow",
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
								"allowedTypes": ["inputString","inputDepthZero","inputDepthOne"]
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
								"allowedTypes": ["inputURL","inputDepthZero","inputDepthOne"]
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

			//Open the minimap
			this.editor.accordionView.openPanel(2);

			// Open the infos panel
			//this.editor.accordionView.openPanel(3);
			

			var runStatusFields = [
				{"type": "string", inputParams: {"name": "status", label: "Status", typeInvite: "Enter a title" } },
				{"type": "text", inputParams: {"name": "details", label: "Description", cols: 50, rows: 4} }
			];

			this.editor.runStatusForm = new inputEx.Group({
				parentEl: YAHOO.util.Dom.get('runStatus'),
				fields: runStatusFields
			});
			
			var testProp = {};
			testProp.status = "Not yet run."
			testProp.details = "Please setup the pipe and press run."
			this.editor.runStatusForm.setValue(testProp , false); // the false tells inputEx to NOT fire the updatedEvt
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


