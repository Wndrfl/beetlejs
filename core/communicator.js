/**
* Provides rudimentary communication between local
* frames (sharing the same domain) via custom event
* firing.
* 
* jQuery
* 	false
* 
* @provides
* 	BBB.communicator
* 
* @requires
* 	BBB.scaffold
*/

BBB.extend('communicator',{
	
	catchCallbackFunction:function(){},///--- catchCallbackFunction
	
	settings:{},///--- settings
	
	init:function(){},///--- init
	
	catchResponse:function(response){
		if(typeof response == 'function') {
			return response();
		}
		if(typeof BBB.communicator.catchCallbackFunction == 'function') {
			return throwback = BBB.communicator.catchCallbackFunction(response);
		}
	},///--- catchResponse
	
	setCatchCallbackFunction:function(cb){
		BBB.communicator.catchCallbackFunction = cb || BBB.communicator.catchCallbackFunction;
	},///--- setCatchCallbackFunction
	
	sendPostMessage:function(targ,targUrl,msg) {
		targ.postMessage(
			msg,
			targUrl
		);
	},///--- sendPostMessage
	
	throwResponse:function(response,cb) {
		// if popup
		if(window.opener) {
			if(typeof window.opener.BBB.communicator.catchResponse == 'function') {
				response = window.opener.BBB.communicator.catchResponse(response);
			}

		// if iframe
		}else if(window.parent) {
			if(typeof window.parent.BBB.communicator.catchResponse == 'function') { 
				response = window.parent.BBB.communicator.catchResponse(response);
			}
		}
		
		return (typeof callback == 'function') ? callback(response) : true;
	}///--- throwResponse
	
});