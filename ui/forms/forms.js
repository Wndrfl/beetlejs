/**
* Manager for interactive forms
* 
* jQuery
* 	false
* 
* @provides
* 	WR.ui.forms
* 
* @requires
* 	WR.scaffold
* 	WR.dom
* 	WR.array
*/
WR.extend('ui.forms',{
	parse:function() {
		var els = WR.dom.getElementsByClassName('form_item');
		WR.array.forEach(els,function(el) {
			if(WR.dom.hasClass(el,'inline')) {
				var item = new WR.ui.forms.item.inline(el);
			}else{
				var item = new WR.ui.forms.item(el);
			}
			
			if(item.setup) {
				item.setup();
			}
		});
	}
});