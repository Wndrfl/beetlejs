/**
* Provides rudimentary communication between local
* frames (sharing the same domain) via custom event
* firing.
* 
* jQuery
* 	false
* 
* @provides
* 	WR.communicator
* 
* @requires
* 	WR.scaffold
*/

WR.extend('communicator',{
	
	catchCallbackFunction:function(){},///--- catchCallbackFunction
	
	settings:{},///--- settings
	
	init:function(){},///--- init
	
	catchResponse:function(response){
		if(typeof response == 'function') {
			return response();
		}
		if(typeof WR.communicator.catchCallbackFunction == 'function') {
			return throwback = WR.communicator.catchCallbackFunction(response);
		}
	},///--- catchResponse
	
	setCatchCallbackFunction:function(cb){
		WR.communicator.catchCallbackFunction = cb || WR.communicator.catchCallbackFunction;
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
			if(typeof window.opener.WR.communicator.catchResponse == 'function') {
				response = window.opener.WR.communicator.catchResponse(response);
			}

		// if iframe
		}else if(window.parent) {
			if(typeof window.parent.WR.communicator.catchResponse == 'function') { 
				response = window.parent.WR.communicator.catchResponse(response);
			}
		}
		
		return (typeof callback == 'function') ? callback(response) : true;
	}///--- throwResponse
	
});