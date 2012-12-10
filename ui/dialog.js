/**
* Manages the creation and display of UI dialogs - 
* modal (iframe and AJAX) or popup
* 
* jQuery
* 	true
* 
* @provides
* 	WR.ui.dialog
* 
* @requires
* 	WR.scaffold
* 	WR.ui.mask
* 	WR.xd
* 	
*/

WR.extend('ui.dialog',{
	
	dialogIsOpen:false,
	dialogPopup:null,
	dialogType:'auto',
	
	close:function(){
		if(WR.ui.dialog.dialogIsOpen !== true) {
			return;
		}
		
		if(WR.ui.dialog.dialogPopup) {
			WR.ui.dialog.dialogPopup.close();
			WR.ui.dialog.dialogIsOpen = false;
		}else{
			WR.ui.mask.hide(function() {
				$('#ui_popup_targ').remove();
				WR.ui.dialog.dialogIsOpen = false;
			});
		}
	},////---- close
	
	closeSelf:function() {
		parent.WR.ui.dialog.close();
	},////---- closeSelf
	
	open:function(type,url,w,h,cb){
		
		if(WR.ui.dialog.dialogIsOpen === false) {
			if(!type) { var type = 'auto';}
			if(type === 'auto') { type = (WR.util.parentIsLocal()) ? "iframe" : "popup";}
			if(!w) { var w = 400;}
			if(!h) { var h = 300;}
			var win_w = document.documentElement.clientWidth;
			var win_h = document.documentElement.clientHeight;
			var left = win_w/2 - w/2;
			var top = $(window).scrollTop()+100;

			// popup
			if(type == 'popup') {
				WR.ui.dialog.dialogPopup = window.open(url,WR.ui.dialog.dialogPopupName, 'height='+h+',width='+w+',left='+left+',top='+top+',resizable=no,scrollbars=yes,toolbar=no,menubar=no,location=no,directories=no,status=no');
				WR.xd.addWindow(WR.ui.dialog.dialogPopupName,WR.ui.dialog.dialogPopup);
				WR.ui.dialog.dialogIsOpen = true;
				return;
			}
			
			WR.ui.mask.show(function() {
				$('body').append('<div id="ui_popup_targ"><div id="ui_popup_loading">Loading...</div></div>');
				$('#ui_popup_targ').append('<div id="ui_popup_close"></div>');
				$('#ui_popup_targ').css('width',w);
				$('#ui_popup_targ').css('height',h);
				$('#ui_popup_targ').css('left',left);
				$('#ui_popup_targ').css('top',top);
				
				// iframe
				if(type == 'iframe') {
					$('#ui_popup_targ').html('<iframe id="ui_popup_iframe" src="'+url+'" width="100%" height="100%" scrolling="no"></iframe>');
					WR.xd.addWindow('ui_popup_iframe',$('#ui_popup_iframe'));
					WR.ui.dialog.dialogType='iframe';

				// ajax
				}else if(type == 'ajax') {
					$('#ui_popup_targ').css('background','transparent').css('border','0').load(url);
					WR.ui.dialog.dialogType='ajax';
				}
				
				$('#ui_popup_targ').fadeIn('fast');
				
				// setup fade out
				$('#ui_popup_close,#ui_popup_bg').click(function() {
					WR.ui.dialog.close();
				});

				WR.ui.dialog.dialogIsOpen = true;

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