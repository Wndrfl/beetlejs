BBB.subclass('ui.element','ui.sampleElement',function() {
	console.log('Constructing the sampleElement!');
},{

	// will be run automatically
	setupAndValidate:function() {
	
		var self = this; // set a local copy of 'this'
	
		this.dom.onclick = function() {
			self.logMessage();
		}
		
		this.dom.onmouseover = function() {
			self.logMessage();
		}
		
		return true;
	},
	
	// method to print message to console
	logMessage:function() {
		console.log('Hey! You clicked me!');
	}
	
});