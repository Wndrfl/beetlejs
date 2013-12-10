/**
* Provides rudimentary communication between local
* frames (sharing the same domain) via custom event
* firing.
* 
* @provides
* 	BBB.communicator
* 
* @requires
* 	BBB.scaffold
**/

BBB.extend('communicator',{
	
	/**
	 * Stores a callback function for the
	 * catchResponse() method.
	 **/
	catchCallbackFunction:function(){},///--- catchCallbackFunction
	
	settings:{},///--- settings
	
	init:function(){},///--- init
	
	/**
	 * Used to catch a response thrown by the other frame.
	 * 
	 * Will either treat the response as a function (if it is a function)
	 * or will pass it to the catchCallbackFunction that was previously
	 * set.
	 **/
	catchResponse:function(response){
		if(typeof response == 'function') {
			return response();
		}
		if(typeof BBB.communicator.catchCallbackFunction == 'function') {
			return throwback = BBB.communicator.catchCallbackFunction(response);
		}
	},///--- catchResponse
	
	/**
	 * Set callback function to be called when the communicator
	 * receives a response from the other frame.
	 * 
	 * This function will be passed the response that is recieved.
	 **/
	setCatchCallbackFunction:function(cb){
		BBB.communicator.catchCallbackFunction = cb || BBB.communicator.catchCallbackFunction;
	},///--- setCatchCallbackFunction
	
	sendPostMessage:function(targ,targUrl,msg) {
		targ.postMessage(
			msg,
			targUrl
		);
	},///--- sendPostMessage
	
	/**
	 * Throws a response to the other frame's
	 * catchResponse() communicator function.
	 * 
	 * If a callback is supplied as the second argument,
	 * this will attempt to treat it as a function and pass it
	 * the response from the other frame.
	 **/
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