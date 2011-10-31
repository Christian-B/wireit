/**
 * Container with left inputs and right outputs
 * Based on WireIt's InOutContainer
 * @class TavernaWFContainer
 * @extends WireIt.Container
 * @constructor
 * @param {Object} options
 * @param {WireIt.Layer} layer
 */
WireIt.TavernaWFContainer = function(options, layer) {
   WireIt.TavernaWFContainer.superclass.constructor.call(this, options, layer);
};

YAHOO.lang.extend(WireIt.TavernaWFContainer, WireIt.Container, {

	/**
	 * @method setOptions
	 * @param {Object} options the options object
	 */
	setOptions: function(options) {
		WireIt.TavernaWFContainer.superclass.setOptions.call(this, options);

		this.options.xtype = "WireIt.TavernaWFContainer";

		this.options.className = options.className || "WireIt-Container WireIt-TavernaWFContainer";

		// Overwrite default value for options:
		this.options.resizable = (typeof options.resizable == "undefined") ? false : options.resizable;

		this.options.inputs = options.inputs || [];
		this.options.outputs = options.outputs || [];
		
		this,options.wfURI = options.wfURI;

	},

	render: function() {
		WireIt.TavernaWFContainer.superclass.render.call(this);

		var baclavaName;
		//Baclava Input if needed
		if (this.options.inputs.length > 0) {
			//This adds the terminal dot.
			this.options.terminals.push({
				"name": "Baclava Input", 
				"direction": [-1,0], 
				"offsetPosition": {"left": -14, "top": 33 }, 
				"nMaxWires": 1,
				"ddConfig": {
					"type": "inputURL",
					"allowedTypes": ["outputURL"]
					}
			});	
			baclavaName = "Baclava format Input/Output"
		} else {
			baclavaName = "Baclava format Output"
		}
		
		//Baclava Output
		//This adds the terminal dot.
		this.options.terminals.push({
			"name": "Baclava Output", 
			"direction": [1,0], 
			"offsetPosition": {"right": -14, "top": 33 }, 
			"ddConfig": {
				"type": "outputURL",
				"allowedTypes": ["inputURL"]
			},
			"alwaysSrc": true
		});
		//This adds the text name to the form
		this.bodyEl.appendChild(WireIt.cn('div', null, {lineHeight: "30px", textAlign: "center"}, baclavaName));
		
		//Normal input
		for(var i = 0 ; i < this.options.inputs.length ; i++) {
			var input = this.options.inputs[i];
			var showName = {};			
			var newTerminal = {};
			newTerminal.ddConfig = {};
			
			newTerminal.name = input.name;
			newTerminal.direction = [-1,0];
			newTerminal.offsetPosition = {"left": -14, "top": 3+30*(i+2) }; 
			newTerminal.nMaxWires = 1;
			
			if (input.depth == 1) {
				newTerminal.ddConfig.type = "inputDepthOne";
				newTerminal.ddConfig.allowedTypes = ["outputString","outputURL","outputList","outputDelimitedURL"];			
				showName = input.name + " (list)";
			} else {
				newTerminal.ddConfig.type = "inputDepthZero";
				newTerminal.ddConfig.allowedTypes = ["outputString","outputURL"];
				showName = input.name;
			}		
			//This adds the terminal dot.
			this.options.terminals.push(newTerminal);
			//This adds the text name to the form
			this.bodyEl.appendChild(WireIt.cn('div', null, {lineHeight: "30px"}, showName));
		}
		
		//Normal Output
		for(i = 0 ; i < this.options.outputs.length ; i++) {
			var output = this.options.outputs[i];
			var showName = {};
			var newTerminal = {};
			newTerminal.ddConfig = {};
			
			newTerminal.name = output.name;
			newTerminal.direction = [1,0];
			newTerminal.offsetPosition = {"right": -14, "top": 3+30*(i+2+this.options.inputs.length) };
			newTerminal.alwaysSrc = true;
			
			if (output.depth == 1) {
				newTerminal.ddConfig.type = "outputList";
				newTerminal.ddConfig.allowedTypes = ["inputList","inputDepthOne"];
				showName = output.name + " (list)";
				newTerminal.wireConfig = {width: 5, borderwidth:3, drawingMethod: "bezierArrows"}				
			} else {
				newTerminal.ddConfig.type = "outputString";
				newTerminal.ddConfig.allowedTypes = ["inputString","inputDepthOne","inputDepthZero"];	
				showName = output.name;
				newTerminal.wireConfig = {drawingMethod: "bezierArrows"}				
			}		
			//This adds the terminal dot.
			this.options.terminals.push(newTerminal);
			//This adds the text name to the form
			this.bodyEl.appendChild(WireIt.cn('div', null, {lineHeight: "30px", textAlign: "right"}, showName));
		}
		
	},

	/**
	 * Return the config of this container.
	 * Exstended from Container.getConfig()
	 * @method getConfig
	 */
	getConfig: function() {
		var obj = {};

		// Position
		obj.position = YAHOO.util.Dom.getXY(this.el);
		if(this.layer) {
			// remove the layer position to the container position
			var layerPos = YAHOO.util.Dom.getXY(this.layer.el);
			obj.position[0] -= layerPos[0];
			obj.position[1] -= layerPos[1];
			// add the scroll position of the layer to the container position
			obj.position[0] += this.layer.el.scrollLeft;
			obj.position[1] += this.layer.el.scrollTop;
		}

		// xtype
		if(this.options.xtype) {
			obj.xtype = this.options.xtype;
		}
		
		//TavernaWF Extra   Add the workflowURI
		obj.wfURI = this.options.wfURI;
		
		return obj;
	},
});