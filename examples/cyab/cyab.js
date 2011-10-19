/**
 * cyab
 */
var cyab = {
	   
   language: {
	
	   languageName: "cyabTest1",
	
		modules: [
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
