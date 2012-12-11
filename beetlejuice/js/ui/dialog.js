/**
* Manages the creation and display of UI dialogs - 
* modal (iframe and AJAX) or popup
* 
* jQuery
* 	true
* 
* @provides
* 	BBB.ui.dialog
* 
* @requires
* 	BBB.scaffold
* 	BBB.ui.mask
* 	BBB.xd
* 	
*/

BBB.extend('ui.dialog',{
	
	dialogIsOpen:false,
	dialogPopup:null,
	dialogType:'auto',
	
	close:function(){
		if(BBB.ui.dialog.dialogIsOpen !== true) {
			return;
		}
		
		if(BBB.ui.dialog.dialogPopup) {
			BBB.ui.dialog.dialogPopup.close();
			BBB.ui.dialog.dialogIsOpen = false;
		}else{
			BBB.ui.mask.hide(function() {
				$('#ui_popup_targ').remove();
				BBB.ui.dialog.dialogIsOpen = false;
			});
		}
	},////---- close
	
	closeSelf:function() {
		parent.BBB.ui.dialog.close();
	},////---- closeSelf
	
	open:function(type,url,w,h,cb){
		
		if(BBB.ui.dialog.dialogIsOpen === false) {
			if(!type) { var type = 'auto';}
			if(type === 'auto') { type = (BBB.util.parentIsLocal()) ? "iframe" : "popup";}
			if(!w) { var w = 400;}
			if(!h) { var h = 300;}
			var win_w = document.documentElement.clientWidth;
			var win_h = document.documentElement.clientHeight;
			var left = win_w/2 - w/2;
			var top = $(window).scrollTop()+100;

			// popup
			if(type == 'popup') {
				BBB.ui.dialog.dialogPopup = window.open(url,BBB.ui.dialog.dialogPopupName, 'height='+h+',width='+w+',left='+left+',top='+top+',resizable=no,scrollbars=yes,toolbar=no,menubar=no,location=no,directories=no,status=no');
				BBB.xd.addWindow(BBB.ui.dialog.dialogPopupName,BBB.ui.dialog.dialogPopup);
				BBB.ui.dialog.dialogIsOpen = true;
				return;
			}
			
			BBB.ui.mask.show(function() {
				$('body').append('<div id="ui_popup_targ"><div id="ui_popup_loading">Loading...</div></div>');
				$('#ui_popup_targ').append('<div id="ui_popup_close"></div>');
				$('#ui_popup_targ').css('width',w);
				$('#ui_popup_targ').css('height',h);
				$('#ui_popup_targ').css('left',left);
				$('#ui_popup_targ').css('top',top);
				
				// iframe
				if(type == 'iframe') {
					$('#ui_popup_targ').html('<iframe id="ui_popup_iframe" src="'+url+'" width="100%" height="100%" scrolling="no"></iframe>');
					BBB.xd.addWindow('ui_popup_iframe',$('#ui_popup_iframe'));
					BBB.ui.dialog.dialogType='iframe';

				// ajax
				}else if(type == 'ajax') {
					$('#ui_popup_targ').css('background','transparent').css('border','0').load(url);
					BBB.ui.dialog.dialogType='ajax';
				}
				
				$('#ui_popup_targ').fadeIn('fast');
				
				// setup fade out
				$('#ui_popup_close,#ui_popup_bg').click(function() {
					BBB.ui.dialog.close();
				});

				BBB.ui.dialog.dialogIsOpen = true;

				if(cb) {
					cb();
				}
			});
		}
		
	},////---- open
	
	resize:function(w,h){
		
		var parentTarg = $("#ui_popup_targ", parent.document.body);

		if(w) { 
			var win_w = parent.document.documentElement.clientWidth;
			var left = win_w/2 - w/2;
			$(parentTarg).css('width',w).css('left',left);
		}

		if(h) {
			if(h == 'auto') { h = $('body').height();}
			var win_h = parent.document.documentElement.clientHeight;
			var top = win_h/2 - h/2;
			$(parentTarg).css('height',h);
		}
		
	}////---- resize
});