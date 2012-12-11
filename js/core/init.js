/**
* Initialization method for BBB scaffolding
* 
* jQuery
* 	false
* 
* @provides
* 	BBB.init
* 
* @requires
* 	BBB.scaffold
*/

BBB.extend('',{
	
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
	
		// initialize form items
		if(BBB.ui.forms) {
			if(BBB.dom.isReady === true) {
				BBB.ui.forms.parseAll();
			}else{
				BBB.events.subscribe('dom.ready',function() {
					BBB.ui.forms.parseAll();
				});
			}
		}
	}
});