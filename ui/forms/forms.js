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
	parse:function() {
		var els = BBB.dom.getElementsByClassName('form_item');
		BBB.array.forEach(els,function(el) {
			if(BBB.dom.hasClass(el,'inline')) {
				var item = new BBB.ui.forms.item.inline(el);
			}else{
				var item = new BBB.ui.forms.item(el);
			}
			
			if(item.setup) {
				item.setup();
			}
		});
	}
});