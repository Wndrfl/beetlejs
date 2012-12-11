/**
* Manager for interactive forms
* 
* jQuery
* 	false
* 
* @provides
* 	BBB.ui.forms
* 
* @requires
* 	BBB.scaffold
* 	BBB.dom
* 	BBB.array
*/
BBB.extend('ui.forms',{
	_dropdowns:[],
	_formItems:[],
	
	closeDropdowns:function(cb) {
		BBB.array.forEach(this._dropdowns,function(item) {
			item.closeDropdown();
		});
		if(cb) {
			cb();
		}
	},
	
	parseAll:function() {
		var self = this;
		
		var els = BBB.dom.getElementsByClassName('ui_form_item');
		BBB.array.forEach(els,function(el) {
			if(!BBB.array.inArray(els[i],self._formItems)) {
				if(BBB.dom.hasClass(el,'inline')) {
					var item = new BBB.ui.forms.item.inline(el);
				}else{
					var item = new BBB.ui.forms.item(el);
				}
			
				if(item.setup) {
					item.setup();
				}
			
				self._formItems.push(item);
			}
		});
		
		var els = BBB.dom.getElementsByClassName('ui_dropdown');
		BBB.array.forEach(els,function(el) {
			if(!BBB.array.inArray(els[i],self._formItems)) {
				var item = new BBB.ui.forms.dropdown(el);
			
				if(item.setup) {
					item.setup();
				}
			
				self._dropdowns.push(item);
			}
		});
	}
});