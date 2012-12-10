/**
* Common dialog templates
* 
* jQuery
* 	false
* 
* @provides
* 	BBB.ui.dialog.templates
* 
* @requires
* 	BBB.scaffold
* 	BBB.ui.dialog
* 	BBB.communicator
*/

BBB.extend('ui.dialog.templates',{
		
	auth:function(params,cb) {
		BBB.communicator.setCatchCallbackFunction(cb);
		
		var p = new Array();
		if(params) {
			if(params.phrase) { p.push('action_phrase='+params.phrase);}
			if(params.follow) { p.push('follow='+params.follow);}
			if(params.ret) { p.push('ret='+params.ret);}
		}
		
		var uri = (p.length > 0) ? "?"+p.join('&') : "";
		
		BBB.ui.dialog.open("auto","/ui/auth"+uri,500,500);
	},
	
	pluginAuth:function(params,cb) {
		BBB.communicator.setCatchCallbackFunction(cb);
		
		var p = new Array();
		if(params) {
			if(params.follow) { p.push('follow='+params.follow);}
			if(params.ret) { p.push('ret='+params.ret);}
		}
		
		var uri = (p.length > 0) ? "?"+p.join('&') : "";
		
		BBB.ui.dialog.open("auto","/plugins/auth/social"+uri,500,500);
	}
});