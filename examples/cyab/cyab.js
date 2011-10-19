/**
 * cyab
 */
var cyab = {

	language: {
	
		languageName: "cyabTest1",
	
		modules: [
//			{
//				"name": "DemoModule",
//				"container": {
//					"xtype": "WireIt.FormContainer",
//					// inputEx options :
//					"title": "WireIt.FormContainer demo",
//					"collapsible": true,
//					"fields": [
//						{"type": "select", "inputParams": {"label": "Title", "name": "title", "selectValues": ["Mr","Mrs","Mme"] } },
//						{"inputParams": {"label": "Firstname", "name": "firstname", "required": true //} },
//						{"inputParams": {"label": "Lastname", "name": "lastname", "value":"Dupont"} },
//						{"type":"email", "inputParams": {"label": "Email", "name": "email", "required": true, "wirable": true}},
//						{"type":"boolean", "inputParams": {"label": "Happy to be there ?", "name": "happy"}},
//						{"type":"url", "inputParams": {"label": "Website", "name":"website", "size": 25}}
//					],
//					"legend": "Tell us about yourself..."
//		 		}
//			},
			{
				"name": "Input",
				"container": {
					"xtype": "WireIt.FormContainer",
					// inputEx options :
					"collapsible": true,
					"fields": [
						{"type": "string", "inputParams": {"label": "Input", "name": "output1", "required": true } },
					],
					"legend": "Please enter an input...",
					"terminals": [
						{"name": "output1", "direction": [-1,0], "offsetPosition": {"left": 90, "top": 50 }}
					]
				}
			},
			{
				"name": "Output",
				"container": {
					"xtype": "WireIt.FormContainer",
					// inputEx options :
					"collapsible": true,
					"legend": "here comes the output...",
					"fields": [
						{"type": "string", "inputParams": {"label": "Output", "name": "input1", "required": false } },
					],
					"terminals": [
						{"name": "input1", "direction": [1,0], "offsetPosition": {"left": 90,"top": -10}},
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
						{"type": "string", "inputParams": {"label": "PassThrough", "name": "both1", "required": false } },
					],
					"terminals": [
						{"name": "output1", "direction": [-1,0], "offsetPosition": {"left": 90, "top": 70 }},
						{"name": "input1", "direction": [1,0], "offsetPosition": {"left": 90,"top": -10}},
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
