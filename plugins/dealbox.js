WR.subclass('plugins.element','plugins.dealbox',null,{
	
	_attr:{},
	
	_defaults:{
		height:200,
		width:400
	},
	
	_settings:{
		minHeight:200,
		minWidth:170
	},
	
	getSize:function() {
		return {width:this._attr.width,height:this._attr.height}
	},
	
	getUrlBits:function() {
		return {name:'dealbox',params:this._attr}
	},
	
	setupAndValidate:function() {
		var attr = {
			business:this.getAttribute('data-business'),
			width:this.getAttribute('data-width',this._defaults.width),
			height:this.getAttribute('data-height',this._defaults.height)
		}
		
		if(attr.width < this._settings.minWidth) {
			attr.width = this._settings.minWidth;
		}
		
		if(attr.height < this._settings.minHeight) {
			attr.height = this._settings.minHeight;
		}
		
		if(!attr.business) {
			return false;
		}
		
		this._attr = attr;
		return true;
	}
});