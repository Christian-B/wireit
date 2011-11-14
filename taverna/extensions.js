/**
 * The wiring editor is overriden to add a button "RUN" to the control bar
 */
tavernaLanguage.WiringEditor = function(options) {
	tavernaLanguage.WiringEditor.superclass.constructor.call(this, options);
};

inputEx.spacerUrl = "../lib/inputex/images/space.gif";

YAHOO.lang.extend(tavernaLanguage.WiringEditor, WireIt.WiringEditor, {
	/**
	 * Add the "run" button
	 */
	renderButtons: function() {
		tavernaLanguage.WiringEditor.superclass.renderButtons.call(this);

		// Add the run button to the toolbar
		var toolbar = YAHOO.util.Dom.get('toolbar');
		var runButton = new YAHOO.widget.Button({ label:"Run", id:"WiringEditor-runButton", container: toolbar });
		runButton.on("click", tavernaLanguage.run, tavernaLanguage, true);
	},

	/**
	 * Copied from WiringEditor loadPipe
	 * @method loadWiring
	 * @param {Object} Wiring (pipe)
	 */
	loadWiring: function(wiring) {
		// TODO: check if current wiring is saved...
		this.layer.clear();

		this.propertiesForm.setValue(wiring.properties, false); // the false tells inputEx to NOT fire the updatedEvt

		//console.log(wiring)
		//console.log(wiring.modules)
		
		if(YAHOO.lang.isArray(wiring.modules)) {
			// Containers
			for(i = 0 ; i < wiring.modules.length ; i++) {
				var m = wiring.modules[i];
				if(this.modulesByName[m.name]) {
					var baseContainerConfig = this.modulesByName[m.name].container;
					YAHOO.lang.augmentObject(m.config, baseContainerConfig); 
					m.config.title = m.name;
					var container = this.layer.addContainer(m.config);
					YAHOO.util.Dom.addClass(container.el, "WiringEditor-module-"+m.name);
					container.setValue(m.value);
				}
				else {
					throw new Error("WiringEditor: module '"+m.name+"' not found !");
				}
			}

			// Wires
			if(YAHOO.lang.isArray(wiring.wires)) {
				for(i = 0 ; i < wiring.wires.length ; i++) {
					// On doit chercher dans la liste des terminaux de chacun des modules l'index des terminaux...
					this.layer.addWire(wiring.wires[i]);
				}
			}
		}

		this.preventLayerChangedEvent = false;
	},
	

	/**
	* Overwrites the orginal function to display more than the name.
	* Add a module definition to the left list
	*/
	addModuleToList: function(module) {
	
		var div = WireIt.cn('div', {className: "WiringEditor-module"});
	
		if(module.description) {
			div.title = module.description;
		}
	
		if(module.container.icon) {
			div.appendChild( WireIt.cn('img',{src: module.container.icon}) );
		}
		//Replaced simply using the name as the innerHtml object
		//div.appendChild( WireIt.cn('span', null, null, module.name) );
		//With looking for a title and otherwise using name
		var title = module.title || module.name;
		div.appendChild( WireIt.cn('span', null, null, title) );
	
		var ddProxy = new WireIt.ModuleProxy(div, this);
		ddProxy._module = module;
	
		// Get the category element in the accordion or create a new one
		var category = module.category || "main";
		var el = YAHOO.util.Dom.get("module-category-"+category);
		if( !el ) {
			this.modulesAccordionView.addPanel({
				label: category,
				content: "<div id='module-category-"+category+"'></div>"
			});
			this.modulesAccordionView.openPanel(this.modulesAccordionView._panels.length-1);
			el = YAHOO.util.Dom.get("module-category-"+category);
			}
	
		el.appendChild(div);
	},
 
 
	/**
	 * Overwrites the Redner function with the sole purpose of overwriting the layer.addWire Function.
	 * Add the rendering of the layer
	 */
	render: function() {
 
		tavernaLanguage.WiringEditor.superclass.render.call(this);
 
 		this.layer.addWire = function(wireConfig) {
			console.log("in overwritten");
			var type = eval(wireConfig.xtype || "WireIt.Wire");
			var src = wireConfig.src;
			var tgt = wireConfig.tgt;
	
			var terminal1 = this.containers[src.moduleId].getTerminal(src.terminal);
			var terminal2 = this.containers[tgt.moduleId].getTerminal(tgt.terminal);
			//Removed version which depended on wireConfig for the options.
				//As only src and tgt are saved
			//var wire = new type( terminal1, terminal2, this.el, wireConfig);
			//Replaced with version that gets the options from the source.
			var wire = new type( terminal1, terminal2, this.el, terminal1.options.wireConfig);
			wire.redraw();
		
			return wire;
		}
	},

	 /**
	 * add a module at the given pos
	 */
	addModule: function(module, pos) {
		try {
			var containerConfig = module.container;
			containerConfig.position = pos;
			//Removed line that always uses the name as the title.
			//containerConfig.title = module.name;
			//Replaced it with one that uses the title if available
			containerConfig.title = module.title || module.name;
			var container = this.layer.addContainer(containerConfig);
			YAHOO.util.Dom.addClass(container.el, "WiringEditor-module-"+module.name);
		}
		catch(ex) {
			this.alert("Error Layer.addContainer: "+ ex.message);
		}
	},


});
