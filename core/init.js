/**
* Initialization method for WR scaffolding
* 
* jQuery
* 	false
* 
* @provides
* 	WR.init
* 
* @requires
* 	WR.scaffold
*/

WR.extend('',{
	
	init:function(options) {
	
		var settings = {
			plugins:false,
			xd:false
		}
		WR.copy(settings,options);
	
		// initialize xd
		if(WR.xd) {
			WR.xd.init();
		}
	
		// initialize plugins
		if(WR.plugins) {
			if(WR.dom.isReady === true) {
				WR.plugins.init();
			}else{
				WR.events.subscribe('dom.ready',function() {
					WR.plugins.init();
				});
			}
		}
	
		// initialize UI elements
		if(WR.ui.elements) {
			if(WR.dom.isReady) {
				WR.ui.elements.parse();
			}else{
				WR.events.subscribe('dom.ready',function() {
					WR.ui.elements.parse();
				});
			}
		}
	
		// initialize form items
		if(WR.ui.forms) {
			if(WR.dom.isReady === true) {
				WR.ui.forms.parse();
			}else{
				WR.events.subscribe('dom.ready',function() {
					WR.ui.forms.parse();
				});
			}
		}
	}
});