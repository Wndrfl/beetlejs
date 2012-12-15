/**
* Initialization method for BBB scaffolding
* 
* @provides
* 	BBB.init
* 
* @requires
* 	BBB.scaffold
**/

BBB.extend('',{
	
	/**
	 * Initializes the entire BBB framework.
	 **/
	init:function(options) {
	
		var settings = {
			plugins:false,
			xd:false
		}
		BBB.copy(settings,options);
	
		// initialize xd
		if(BBB.xd) {
			BBB.xd.init();
		}
	
		// initialize UI elements
		if(BBB.ui.elements) {
			if(BBB.dom.isReady) {
				BBB.ui.elements.parse();
			}else{
				BBB.events.subscribe('dom.ready',function() {
					BBB.ui.elements.parse();
				});
			}
		}
	}
});