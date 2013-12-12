/**
 * Initializes the entire BBB framework.
 **/
BBB.run(function() {
	
	var settings = {
		elements:true
	}

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
});