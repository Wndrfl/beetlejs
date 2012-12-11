/**
* UI screen mask - used to slightly fade out parent
* window so that model dialogs are easier to read.
* 
* jQuery
* 	true
* 
* @provides
* 	BBB.ui.mask
* 
* @requires
* 	BBB.scaffold
*/

(function() {
	BBB.extend('ui.mask',{
		_mask:null,
		_maskOn:false,
		
		show:function(cb){
			if(BBB.ui.mask._maskOn === false) {
				$('body').append('<div id="bbb_popup_bg"></div>');
				$('#bbb_popup_bg').css('opacity','0.4').show();
				BBB.ui.mask._maskOn = true;
			}
			if(cb) {
				cb();
			}
		},
		
		hide:function(cb) {
			if(BBB.ui.mask._maskOn === true) {
				$('#bbb_popup_bg').fadeOut('slow',function() { $('#bbb_popup_bg').remove();});
				BBB.ui.mask._maskOn = false;
			}
			if(cb) {
				cb();
			}
		}
			
	});
})();