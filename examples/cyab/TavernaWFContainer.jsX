/**
 * Container with left inputs and right outputs for Taverna Workflows
 * @class TavernaWFContainer
 * @extends WireIt.InOutContainer
 * @constructor
 * @param {Object} options
 * @param {WireIt.Layer} layer
 */
WireIt.TavernaWFContainer = function(options, layer) {
   WireIt.TavernaWFContainer.superclass.constructor.call(this, options, layer);
};

YAHOO.lang.extend(WireIt.TavernaWFContainer, WireIt.InOutContainer, {

	/**
	 * @method setOptions
	 * @param {Object} options the options object
	 */
	setOptions: function(options) {
		WireIt.TavernaWFContainer.superclass.setOptions.call(this, options);

		this.options.resizable = (typeof options.resizable == "undefined") ? false : options.resizable;

		this.options.inputs = options.inputs || [];
		this.options.outputs = options.outputs || [];

		this.options.xtype = "WireIt.TavernaWFContainer";

		this.options.className = options.className || "WireIt.TavernaWFContainer";      
	},

	render: function() {
		WireIt.TavernaWFContainer.superclass.render.call(this);

		for(var i = 0 ; i < this.options.terminals.length ; i++) {
			if (this.options.terminals[i].name == "input") {
				this.options.terminals[i].nMaxWires = 1;
			}
		}
	}

});