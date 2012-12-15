/**
* Common util helper methods
* 
* @provides
* 	BBB.util
* 
* @requires
* 	BBB.scaffold
*/

BBB.extend('util',{
	settings:{},///--- settings
	
	init:function(){},///--- init
	
	/**
	 * Returns current URL
	 **/
	currentUrl:function() {
		return window.location.href;
	},///--- currentUrl
	
	/**
	 * Creates a random guid.
	 **/
	guid:function() {
	    var S4 = function() {
	       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	    };
	    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());			
	},///--- guid
	
	/**
	 * Provides functions for analyzing keyboard events.
	 **/
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
	
	/**
	 * Determines whether the parent of the current window
	 * is on the same domain or not.
	 **/
	parentIsLocal:function() {
		return (window.location == window.parent.location);
	},///--- parentIsLocal
	
	/**
	 * Prints the current page.
	 **/
	printPage:function(){
		window.print();
	},///--- printPage
	
	/**
	 * Redirects the browser to a supplied URL.
	 **/
	redirect:function(url){
		window.location = url;	
	},///--- redirect
	
	/**
	 * Refreshes the page.
	 **/
	refreshPage:function(){
		window.location.reload();
	}///--- refreshPage
	
});