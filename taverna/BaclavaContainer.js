/**
 * Container represented by an image
 * @class BaclavaContainer
 * @extends WireIt.FormContainer
 * @constructor
 * @param {Object} options
 * @param {WireIt.Layer} layer
 */
WireIt.BaclavaContainer = function(options, layer) {
	WireIt.BaclavaContainer.superclass.constructor.call(this, options, layer);
};

YAHOO.lang.extend(WireIt.BaclavaContainer, WireIt.FormContainer, {

	/**
	 * @method setOptions
	 * @param {Object} options the options object
	 */
	setOptions: function(options) {
		WireIt.BaclavaContainer.superclass.setOptions.call(this, options);

		this.options.xtype = "WireIt.BaclavaContainer";

		this.options.className = options.className || "WireIt-Container URI Link Container";

		// Overwrite default value for options:
		this.options.resizable = (typeof options.resizable == "undefined") ? false : options.resizable;
		
		this.options.fields = this.options.fields || [];
		this.uriField = {
			"type": "uriLink",
			"inputParams" : {
				"name":"uri",    //Both fields intentionally have the same name so they share the same data
				"value":options.uri || "",
			},
		};
		this.options.fields.push(this.uriField);
		this.showField = {
			"type": "baclavaShowLink",
			"inputParams" : {
				"name":"uri",    //Both fields intentionally have the same name so they share the same data
				"value":options.uri || "",
			},
		};
		this.options.fields.push(this.showField);
		//console.log(this.options.fields)
	},
	
	endsWith: function(str, suffix) {
		return str.indexOf(suffix, str.length - suffix.length) !== -1;
	},

	/**
	 * @method render
	 */
	render: function() {
		WireIt.BaclavaContainer.superclass.render.call(this);
	},

});

//   *******   Raw Data Link  ******* //
(function() {

/**
 * Create a uneditable field where you can stick the html you want
 * Added Options:
 * <ul>
 *    <li>visu: inputEx visu type</li>
 * </ul>
 * Based on inputEx.UneditableField
 * @class inputEx.BaclavaShowLinkField
 * @extends inputEx.Field
 * @constructor
 * @param {Object} options inputEx.Field options object
 */
inputEx.BaclavaShowLinkField = function(options) {
	inputEx.BaclavaShowLinkField.superclass.constructor.call(this,options);
};
YAHOO.lang.extend(inputEx.BaclavaShowLinkField, inputEx.Field, {

	/**
	 * Set the default values of the options
	 * @param {Object} options Options object (inputEx inputParams) as passed to the constructor
	 */
	setOptions: function(options) {
		inputEx.BaclavaShowLinkField.superclass.setOptions.call(this,options);
		this.options.visu = options.visu;
	},

	endsWith: function(str, suffix) {
		return str.indexOf(suffix, str.length - suffix.length) !== -1;
	},

	/**
	 * Store the value and update the visu
	 * @param {Any} val The value that will be sent to the visu
	 * @param {boolean} [sendUpdatedEvt] (optional) Wether this setValue should fire the updatedEvt or not (default is true, pass false to NOT send the event)
	 */
	setValue: function(val, sendUpdatedEvt) {
		this.value = val;
		//console.log(this.value);
		
		var link = "The Link will go here.";
		
		 if (this.value){
			var text = "Fancy Baclava Output";
			//Link needs to be changed to fancy link.
			link = '<a href="' + this.value + '" target="_blank">' + text + '</a>';
		}

		inputEx.renderVisu(this.options.visu, link, this.fieldContainer);

		inputEx.BaclavaShowLinkField.superclass.setValue.call(this, val, sendUpdatedEvt);
	},

	/**
	 * Return the stored value
	 * @return {Any} The previously stored value
	 */
	getValue: function() {
		return this.value;
	}

});

// Register this class as "url" type
inputEx.registerType("baclavaShowLink", inputEx.BaclavaShowLinkField);

})();