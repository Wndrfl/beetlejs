/**
* Common util helper methods
* 
* jQuery
* 	false
* 
* @provides
* 	WR.util
* 
* @requires
* 	WR.scaffold
*/

WR.extend('util',{
	settings:{},///--- settings
	
	init:function(){},///--- init
	
	currentUrl:function() {
		return window.location.href;
	},///--- currentUrl
	
	guid:function() {
	    var S4 = function() {
	       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	    };
	    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());			
	},///--- guid
	
	keyboard:{
		
		getKeycode:function(e) {
			var code;
			if (!e) { var e = window.event;}
			if (e.keyCode) { 
				code = e.keyCode;
			}else if(e.which) {
				code = e.which;
			}
			return code;
		}////---- getKeycode
		
	},///--- keyboard
	
	parentIsLocal:function() {
		return (window.location == window.parent.location);
	},///--- parentIsLocal
	
	printPage:function(){
		window.print();
	},///--- printPage
	
	redirect:function(url){
		window.location = url;	
	},///--- redirect
	
	refreshPage:function(){
		window.location.reload();
	}///--- refreshPage
	
});