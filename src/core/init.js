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
			elements:true
		}
		
		BBB.copy(settings,options,true);
	
		// initialize UI elements
		if(settings.elements && BBB.ui.elements) {
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