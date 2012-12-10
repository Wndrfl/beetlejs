/**
* Parent class for all UI elements
* 
* jQuery
* 	false
* 
* @provides
* 	WR.ui.element
* 
* @requires
* 	WR.scaffold
*/

WR.Class('ui.element',
	function(dom) {
		this.dom = dom;
	},
	{
		getAttribute:function(name,defaultValue,transform) {
			var value = (
			  this.dom.getAttribute(name) ||
		      this.dom.getAttribute(name.replace(/-/g, '_')) ||
		      this.dom.getAttribute(name.replace(/-/g, ''))
		    );
		    return value ? (transform ? transform(value) : value) : defaultValue;
		},
		
		setup:function() {
			if(!this.setupAndValidate()) {
				WR.log('setup failed');
				return false;
			}
		},
		
		setupAndValidate:function() {
			return true;
		}
	});