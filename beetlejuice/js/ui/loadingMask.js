/**
* UI loading mask
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
	BBB.extend('ui.loadingMask',{
		
		hide:function(cb) {
			$('#bbb_loading_targ').remove();
			BBB.ui.mask.hide(cb);
		},
		
		show:function(text,cb){
			var self = this;
			var t = (text) ? text : 'loading...';
			BBB.ui.mask.show(function() {
				$('body').append('<div id="bbb_loading_targ"><div id="bbb_loading_content">'+t+'</div></div>');
				if(cb) {
					cb();
				}
			});
		}	
	});
})();