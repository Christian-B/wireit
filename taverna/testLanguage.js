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
				"tavernaInfo" : {
					"wfURI":"Workflows/Echo.t2flow",
					"inputs": [{"name":"Bar", "depth":0}],
					"outputs": [{"name":"Foo", "depth":0}],
					"showWorkflow": true,
					"helpPage": "Workflows/Echo.html",
					"links" : [
						{"uri": "Workflows/Echo.html","text": "Workflow Description"},
						{"uri": "Workflows/Echo.t2flow","text": "Workflow Definition"},
					],
				},
				"container" : {
					"xtype":"WireIt.TavernaWFContainer",
				},
			},
			{
				"name": 'HelloWorld',
				"description": 'The classical no input, just output "HelloWorld" demonstration Workflow',
				"category": "Taverna Workflow",
				"tavernaInfo" : {
					"wfURI":"Workflows/HelloWorld.t2flow",
					"inputs": [],
					"outputs": [{"name":"Foo", "depth":0}],
					"showWorkflow": true,
					"helpPage": "Workflows/Echo.html",
					"links" : [
						{"uri": "Workflows/HelloWorld.html","text": "Workflow Description"},
						{"uri": "Workflows/HelloWorld.t2flow","text": "Workflow Definition"},
					]
				},
				"container": {
					"xtype":"WireIt.TavernaWFContainer",
				},
			},
			{
				"name": 'Triple Echo',
				"description": "Test workflow which simply passes the three inputs to the output with the same name. No processing is carried out",
				"category": "Taverna Workflow",
				"tavernaInfo" : {
					"wfURI":"Workflows/ThreeStrings.t2flow",
					"inputs": [
						{"name":"in_Left", "depth":0},
						{"name":"in_Middle", "depth":0},
						{"name":"in_Right", "depth":0}],
					"outputs": [
						{"name":"out_Left", "depth":0},
						{"name":"out_Middle", "depth":0},
						{"name":"out_Right", "depth":0}],
					"showWorkflow": "true",
					"helpPage": "Workflows/ThreeStrings.html",
					"links" : [
						{"uri": "Workflows/ThreeStrings.html","text": "Workflow Description"},
						{"uri": "Workflows/ThreeStrings.t2flow","text": "Workflow Definition"},
					]
				},
				"container": {
					//"icon":"taverna/taverna.jpg",
					"xtype":"WireIt.TavernaWFContainer",
				},
			},
			{
				"name": "Mixed Concatenation",
				"category": "Taverna Workflow",
				"description": "Concatenates a mixture of single Strings and Lists of Strings",
				"tavernaInfo" : {
					"wfURI":"Workflows/MixedWorkflow.t2flow",
					"inputs": [
						{"name":"LeftList", "depth":1, "description":"Cool this works"},
						{"name":"LeftNoList", "depth":0},
						{"name":"RightList", "depth":1},
						{"name":"RightNoList", "depth":0}],
					"outputs": [{"name":"Result", "depth":1}],
					"helpPage": "Workflows/MixedWorkflow.html",
					"showWorkflow": false,
					"links" : [
						{"uri": "Workflows/MixedWorkflow.html","text": "Workflow Description"},
						{"uri": "Workflows/MixedWorkflow.t2flow","text": "Workflow Definition"},
					]
				},
				"container": {
					"xtype":"WireIt.TavernaWFContainer",
				},
			},
			{
				"name": "Simple Input",
				"description": "Place to enter a single value",
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
							"description":"Cool this works",
							"offsetPosition": {"right": -14, "top": 25},
							"alwaysSrc":true,
							 wireConfig: { drawingMethod: "arrows"},
							"ddConfig": {
								"type": "outputString",
								"allowedTypes": ["inputString","inputDepthZero","inputDepthOne"],
							}
						}
					]
				}
			},
			{
				"name": "URL Input",
				"description": "Place to enter a single url.",
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
							"offsetPosition": {"right": -14, "top": 25},
							"alwaysSrc":true,
							 wireConfig: { drawingMethod: "arrows", color: "#EE11EE", bordercolor:"#FF00FF"},
							"ddConfig": {
								"type": "outputURL",
								"allowedTypes": ["inputURL","inputDepthZero","inputDepthOne"],
							}
						}
					]
				}
			},
			{
				"name": "URL To List Input",
				"description": "Place to enter the url to a list and the delimiter between list elements.",
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
								"name": "url",
								"required": true
							}
						},
						{
							"inputParams": {
								"label": "Delimiter", 
								"name": "delimiter",
								"required": true,
								"maxLength": 2
							}
						},
					],
					"terminals": [
						{
							"name": "output",
							"offsetPosition": {"right": -14, "top": 25},
							"alwaysSrc":true,
							 wireConfig: {width: 5, borderwidth:3, drawingMethod: "arrows", color: "#EE11EE", bordercolor:"#FF00FF"},
							"ddConfig": {
								"type": "outputDelimitedURL",
								"allowedTypes": ["inputURL","inputDepthOne"],
							}
						}
					]
				}
			},
			{
				"name": "List Input",
				"description": "Place to enter a list of item. Each line is considered one item. NewLine within an item not supported.",
				"category": "Input",
				"container": {
					"xtype": "WireIt.FormContainer",
					"title": "Input test",
					"fields": [{"type": "text", "inputParams": {"label": "List values", "name": "output", "wirable": false }} ],
					"terminals": [
						{
							"name": "output",
							"offsetPosition": {"right": -14, "top": 75},
							"alwaysSrc":true,
							"ddConfig":{
								"type": "outputList",
								"allowedTypes": ["inputList", "inputDepthOne"]
							},
							wireConfig:{width: 5, borderwidth:3, drawingMethod: "arrows"}
						}
					],
				}
			},
			{
				"name": "Triple Echo Baclava Input",
				"category": "Input",
				"description": "Workflow input for the Triple Echo workflow.",
				"container": {
					"width": 350,
					"xtype": "WireIt.BaclavaContainer",
					"title": "input",
					"uri" : "Inputs/BaclavaTripleEchoInput.xml",
					"terminals": [
						{
							"name": "output",
							"offsetPosition": {"right": -14, "top": 25},
							"alwaysSrc":true,
							 "wireConfig": { drawingMethod: "arrows", color: "#FF0000", bordercolor:"#FF00FF"},
							"ddConfig": {
								"type": "outputBaclava",
								"allowedTypes": ["inputBaclava"],
							}
						}
					]
				}
			},			
			{
				"name": "Simple Output",
				"category": "Output",
				"description": "Single port Workflow output in String format. ",
				"container": {
					"xtype": "WireIt.FormContainer",
					"title": "output",
					"fields": [ 
						{"type": "uneditable", "inputParams": {"label": "Value", "name": "input", "wirable": false}}
					],
					"terminals": [
						{
							"name": "input",
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
				"name": "Baclava Output",
				"category": "Output",
				"description": "Baclava Workflow output as a clickable link.",
				"container": {
					"width": 350,
					"xtype": "WireIt.BaclavaContainer",
					"title": "output",
					"terminals": [
						{
							"name": "input",
							"offsetPosition": {"left": -14, "top": 25 },
							"ddConfig": {
								"type": "inputBaclava",
								"allowedTypes": ["outputBaclava"]
							},
							"nMaxWires": 1
						}
					]
				}
			},			
			{
				"name": "URL Link Output",
				"category": "Output",
				"description": "Output as a clickable link.",
				"container": {
					"width": 350,
					"xtype": "WireIt.URILinkContainer",
					"title": "output",
					"terminals": [
						{
							"name": "input",
							"offsetPosition": {"left": -14, "top": 25 },
							"ddConfig": {
								"type": "inputURL",
								"allowedTypes": ["outputURL", "outputDelimitedURL"]
							},
							"nMaxWires": 1
						}
					]
				}
			},			
			{
				"name": "List Output",
				"category": "Output",
				"description": "Single port workflow output. As a flattened list of Strings",
				"container": {
					"xtype": "WireIt.FormContainer",
					"title": "Output test",
					"fields": [
						{"type": "text", "inputParams": {"label": "List values", "name": "input", "wirable": false}}
					],
					"terminals": [
						{
							"name": "input",
							"offsetPosition": {"left": -14, "top": 75},
							"alwaysSrc":false,
							"ddConfig":{
								"type": "inputList",
								"allowedTypes": ["outputDepthOne", "outputList"]
							}
						}
					]
				}
			},
			{
				"name": "PassThrough",
				"category": "Pass Through",
				"description": "Field that can be placed between the output of one workflow and the Input of another one. Shows the value being passed as a String",
				"container": {
					"xtype": "WireIt.FormContainer",
					// inputEx options :
					"collapsible": true,
					"legend": "here comes the passthrough...",
					"fields": [
						{"type": "uneditable", "inputParams": {"label": "PassThrough", "name": "both", "required": false } },
					],
					"terminals": [
						{
							"name": "input",
							"offsetPosition": {"left": -14, "top": 33 },
							"ddConfig": {
								"type": "inputString",
								"allowedTypes": ["outputString"]
							},
							"nMaxWires": 1
						},
						{
							"name": "output",
							"offsetPosition": {"right": -14, "top": 33},
							"alwaysSrc":true,
							 wireConfig: { drawingMethod: "arrows"},
							"ddConfig": {
								"type": "outputString",
								"allowedTypes": ["inputString", "inputDepthZero"],
							}
						}
					]
				}
			},
			{
				"name": "URL Pass Through",
				"description": "Field that can be placed between the Baclava output of one workflow and the Baclava Input of another one. Provides a clickable URI to the file being passed",
				"category": "Pass Through",
				"container": {
					"width": 350,
					"xtype": "WireIt.URILinkContainer",
					"terminals": [
						{
							"name": "input",
							"offsetPosition": {"left": -14, "top": 25 },
							"ddConfig": {
								"type": "inputURL",
								"allowedTypes": ["outputURL", "outputDelimitedURL"]
							},
							"nMaxWires": 1
						},
						{
							"name": "output",
							"offsetPosition": {"right": -14, "top": 25},
							"alwaysSrc":true,
							 wireConfig: { drawingMethod: "arrows", color: "#EE11EE", bordercolor:"#FF00FF"},
							"ddConfig": {
								"type": "outputURL",
								"allowedTypes": ["inputURL","inputDepthZero","inputDepthOne"],
							}
						}
					]
				}
			},			
			{
				"name": "Baclava Pass Through",
				"description": "Field that can be placed between the Baclava output of one workflow and the Baclava Input of another one. Provides a clickable URI to the file being passed",
				"category": "Pass Through",
				"container": {
					"width": 350,
					"xtype": "WireIt.BaclavaContainer",
					"terminals": [
						{
							"name": "input",
							"offsetPosition": {"left": -14, "top": 25 },
							"ddConfig": {
								"type": "inputBaclava",
								"allowedTypes": ["outputBaclava"]
							},
							"nMaxWires": 1
						},
						{
							"name": "output",
							"offsetPosition": {"right": -14, "top": 25},
							"alwaysSrc":true,
							 wireConfig: { drawingMethod: "arrows", color: "#FF0000", bordercolor:"#FF00FF"},
							"ddConfig": {
								"type": "outputBaclava",
								"allowedTypes": ["inputBaclava"],
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

	moduleByName: function(name) {
		var language = this.language;
		var modules = language.modules
		for(var i = 0 ; i < modules.length ; i++) {
			if (modules[i].name == name) {
				return modules[i];
			}
		}
		return null;
	},
		
	titleByName: function(name) {
		module = this.moduleByName(name);
		var tavernaLink = ""
		if (module.tavernaInfo.showWorkflow){	
			var tavernaTitle = module.tavernaInfo.wfToolTip || "Click here to see workflow script";
			var tavernaLink	= '<a href="' + module.container.wfURI +'" target="_blank"><IMG SRC="taverna/taverna.jpg" title="' + tavernaTitle + '"></a> '
		}
		var helpLink = "";
		if (module.tavernaInfo.helpPage) {
			var helpTitle = module.tavernaInfo.helpToolTip || "Click here to more information";
			helpLink = ' <a href="' + module.tavernaInfo.helpPage +'" target="_blank"><IMG SRC="images/icons/help.png" title="' + helpTitle + '"></a>'
		}
		return (tavernaLink + module.name + helpLink);
	},
	
	iconByName: function(name) {
		module = this.moduleByName(name);
		if (module.tavernaInfo.showWorkflow){	
			return null
		} else {
			return module.container.icon || "taverna/taverna.jpg";
		}
	},

	/**
	 * @method init
	 * @static
	 */
	init: function() {

		try {
			this.language.adapter = WireIt.WiringEditor.adapters.AjaxAdapter;
			
			for(var i = 0 ; i < this.language.modules.length ; i++) {
				module = this.language.modules[i];
				if (module.container.xtype == "WireIt.TavernaWFContainer"){
					module.title = this.titleByName(module.name);
					module.container.icon = this.iconByName(module.name);
				}
			}

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


