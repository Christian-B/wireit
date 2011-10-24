/**
 * cyab
 */
var cyab = {

	language: {
	
		languageName: "cyabTest1",
	
		modules: [
			{
				"name": "Echo",
				"category": "Taverna Workflow",
				"description": "Echoes input to output",
				"container" : {
					"xtype":"WireIt.TavernaWFContainer",
					"inputs": ["foo"],
					"outputs": ["bar"],
					"wfURI":"file://blah1"
				}
			},
			{
				"name": "HelloWorld",
				"category": "Taverna Workflow",
				"wfURI":"file://blah1",
				"container": {
					"xtype":"WireIt.TavernaWFContainer",
					"inputs": [],
					"outputs": ["Foo"],
				}
			},
			{
				"name": "Simple Input",
				"category": "input",
				"container": {
					"xtype": "WireIt.FormContainer",
					"title": "input",
					"fields": [
						{
							"ddConfig": {
								"type": "output",
								"allowedTypes": ["input"]
							},
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
							"offsetPosition": {"left": 86, "bottom": -15},
							"alwaysSrc":true,
							"ddConfig": {
								"type": "output",
								"allowedTypes": ["input"]
							}
						}
					]
				}
			},
			{
				"name": "List Input",
				"category": "input",
				"container": {
					"xtype": "WireIt.FormContainer",
					"title": "Input test",
					"fields": [{"type": "text", "inputParams": {"label": "List values", "name": "output", "wirable": false }} ],
					"terminals": [
						{
							"name": "output",
							"direction": [0,1],
							"offsetPosition": {"left": 86, "bottom": -15},
							"alwaysSrc":true,
							"ddConfig":{
								"type": "output",
								"allowedTypes": ["input"]
							}
						}
					]
				}
			},
			{
				"name": "Simple Output",
				"category": "output",
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
							"offsetPosition": {"left": 82, "top": -15 },
							"ddConfig": {
								"type": "input",
								"allowedTypes": ["output"]
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
							"offsetPosition": {"left": 90, "top": -10 },
							"ddConfig": {
								"type": "input",
								"allowedTypes": ["output"]
							},
							"nMaxWires": 1
						},
						{
							"name": "out",
							"direction": [0,1],
							"offsetPosition": {"left": 86, "bottom": -10},
							"alwaysSrc":true,
							"ddConfig": {
								"type": "output",
								"allowedTypes": ["input"]
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
	
	this.language.adapter = WireIt.WiringEditor.adapters.AjaxPlus;
	
   	this.editor = new cyab.WiringEditor(this.language);

	// Open the infos panel
	editor.accordionView.openPanel(2);
   },
   
   /**
    * Execute the module in the "ExecutionFrame" virtual machine
    * @method run
    * @static
    */
   run: function() {
      console.log("ready to run")
      var ef = new ExecutionFrame( this.editor);
      ef.run();
   }
   
};


/**
 * The wiring editor is overriden to add a button "RUN" to the control bar
 */
cyab.WiringEditor = function(options) {
   cyab.WiringEditor.superclass.constructor.call(this, options);
};

YAHOO.lang.extend(cyab.WiringEditor, WireIt.WiringEditor, {
   /**
    * Add the "run" button
    */
   renderButtons: function() {
      cyab.WiringEditor.superclass.renderButtons.call(this);

		// Add the run button to the toolbar
      var toolbar = YAHOO.util.Dom.get('toolbar');
      var runButton = new YAHOO.widget.Button({ label:"Run", id:"WiringEditor-runButton", container: toolbar });
      runButton.on("click", cyab.run, cyab, true);
   }
});
