(function() {

WireIt.BaclavaTerminal = function(parentEl, options, container) {
	WireIt.BaclavaTerminal.superclass.constructor.call(this, parentEl, options, container);
	individualTerminals = [];
};

YAHOO.lang.extend(WireIt.BaclavaTerminal, WireIt.Terminal, {

	setOptions: function(options) {
		console.log("in BaclavaTerminal setOptions");
		//console.log(options);
		WireIt.BaclavaTerminal.superclass.setOptions.call(this, options);
	},

	addWire: function(wire) {
		//console.log("addWire:");
		WireIt.BaclavaTerminal.superclass.addWire.call(this, wire);
		for(var i = 0 ; i < individualTerminals.length ; i++) {
			individualTerminals[i].removeAllWires();
		}
	},
		
	addIndividualTerminal: function(terminal){
		individualTerminals.push(terminal);
		terminal.setBaclavaTerminal(this);
	},
	
});

})();

/*******/

(function() {

WireIt.IndividualTerminal = function(parentEl, options, container) {
	WireIt.IndividualTerminal.superclass.constructor.call(this, parentEl, options, container);
	//The following line only works if the Baclava input is added FIRST!
	container.terminals[0].addIndividualTerminal(this);
};

YAHOO.lang.extend(WireIt.IndividualTerminal, WireIt.Terminal, {

	setOptions: function(options) {
		console.log("in IndividualTerminal setOptions");
		//console.log(options);
		WireIt.IndividualTerminal.superclass.setOptions.call(this, options);
		//console.log("again");
	},
	
	setBaclavaTerminal: function(baclavaTerminal){
		baclava = baclavaTerminal;
		//console.log ("baclava set");
	},
	
	addWire: function(wire) {
		WireIt.BaclavaTerminal.superclass.addWire.call(this, wire);
		baclava.removeAllWires();
	},

});

})();
