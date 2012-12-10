/**
* UI screen mask - used to slightly fade out parent
* window so that model dialogs are easier to read.
* 
* jQuery
* 	true
* 
* @provides
* 	WR.ui.mask
* 
* @requires
* 	WR.scaffold
*/

(function() {
	WR.extend('ui.mask',{
		_mask:null,
		_maskOn:false,
		
		show:function(cb){
			if(WR.ui.mask._maskOn === false) {
				$('body').append('<div id="ui_popup_bg"></div>');
				$('#ui_popup_bg').css('opacity','0.4').show();
				WR.ui.mask._maskOn = true;
			}
			if(cb) {
				cb();
			}
		},
		
		hide:function(cb) {
			if(WR.ui.mask._maskOn === true) {
				$('#ui_popup_bg').fadeOut('slow',function() { $('#ui_popup_bg').remove();});
				WR.ui.mask._maskOn = false;
			}
			if(cb) {
				cb();
			}
		}
			
	});
})();