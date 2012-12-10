/**
* Parent class for all plugin elements
* 
* jQuery
* 	false
* 
* @provides
* 	WR.plugins.element
* 
* @requires
* 	WR.scaffold
* 	WR.content
* 	WR.qs
*/

WR.Class('plugins.element',
	
	function(dom){
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
		
		getParams:function() {
			var params = this.getUrlBits().params;
			return params;
		},
		
		getSize:function() {},
		
		getUrl:function() {
			return WR.domains.www + 'plugins/' + this.getUrlBits().name + '/';
		},
		
		setup:function() {
			if(!this.setupAndValidate()) {
				return false;
			}
			
			var size = this.getSize() || {};
			
			var params = this.getParams();
			if(typeof params.referrer == 'undefined') {
				params.referrer = WR.util.currentUrl();
			}
			
			var url = this.getUrl() + '?' + WR.qs.encode(this.getParams());
			
			WR.content.insertIframe(this.dom,{
				src:url,
				width:size.width,
				height:size.height
			});
		},
		
		setupAndValidate:function() {
			return true;
		}
		
	});