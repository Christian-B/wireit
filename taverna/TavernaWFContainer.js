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
		this.bodyEl.appendChild(WireIt.cn('div', null, {lineHeight: "30px", textAlign: "center"}, baclavaName));
		
		//Normal input
		for(var i = 0 ; i < this.options.inputs.length ; i++) {
			var input = this.options.inputs[i];
			var ddConfig = {};
			var showName = {};
			if (input.depth == 1) {
				ddConfig.type = "inputDepthOne";
				ddConfig.allowedTypes = ["outputString","outputURL","outputList","outputDelimitedURL"];			
				showName = input.name + " (list)";
			} else {
				ddConfig.type = "inputDepthZero";
				ddConfig.allowedTypes = ["outputString","outputURL"];
				showName = input.name;
			}		
			this.options.terminals.push({
				"name": input.name, 
				"direction": [-1,0], 
				"offsetPosition": {"left": -14, "top": 3+30*(i+2) }, 
				"nMaxWires": 1,
				"ddConfig": ddConfig,
			});
			this.bodyEl.appendChild(WireIt.cn('div', null, {lineHeight: "30px"}, showName));
		}
		
		//Normal Output
		for(i = 0 ; i < this.options.outputs.length ; i++) {
			var output = this.options.outputs[i];
			var ddConfig = {};
			var showName = {};
			if (output.depth == 1) {
				ddConfig.type = "outputList";
				ddConfig.allowedTypes = ["inputList","inputDepthOne"];
				showName = output.name + " (list)";
			} else {
				ddConfig.type = "outputString";
				ddConfig.allowedTypes = ["inputString","inputDepthOne","inputDepthZero"];	
				showName = output.name;
			}		
			this.options.terminals.push({
				"name": output.name, 
				"direction": [1,0], 
				"offsetPosition": {"right": -14, "top": 3+30*(i+2+this.options.inputs.length) }, 
				"ddConfig": ddConfig,
				"alwaysSrc": true
			});
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