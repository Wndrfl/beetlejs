/**
* Manages cross-domain communication
* 
* jQuery
* 	false
* 
* @provides
* 	WR.xd
* 
* @requires
* 	WR.scaffold
* 	WR.qs
* 	WR.events
*/

WR.extend('xd',{
	
	exposedFunctions:{},///--- exposedFunctions
	exposedFunctionsTmp:{},///--- exposedFunctionsTmp
	fragmentListenerInterval:100,///--- fragmentListenerInterval
	fragmentListenerTimer:null,///--- fragmentListenerTimer
	originBlacklist:{},///--- originBlacklist
	originWhitelist:{},///--- originWhitelist
	windows:{},///--- windows
	xdmMethod:null,///--- xdmMethod
	
	init:function() {
		if(window !== top) {
			WR.xd.addWindow("parent",window.parent,'*');
		}
		
		WR.xd.getXdmMethod();
		
		// set up listener
		if(WR.xd.xdmMethod === 'postmessage') {
			if(typeof window.addEventListener !== 'undefined') { 
				window.addEventListener('message',function(e) {
					WR.xd.onPostMessageReceived(e);
				},false); 
			}else if(typeof window.attachEvent !== 'undefined') { 
			  	window.attachEvent('onmessage',function(e) {
					WR.xd.onPostMessageReceived(e);
				}); 
			}
		}
		
		// tell WR that xd is setup
		WR.events.fire('xd.ready');
		
	},///--- init
	
	addWindow:function(windowName,object,url) {
		WR.xd.windows[windowName] = {
			cb:function(){},
			object:object,
			url:url
		}
	},///--- addWindow
	
	callExposedFunction:function(name,params) {
		var fn = WR.xd.exposedFunctions[name];
		return fn(params);
	},///--- callExposedFunction
	
	exposeFunction:function(name,fn,tmp) {
		if(typeof fn === "function") {
			name = (name) ? name : WR.util.guid();
			WR.xd.exposedFunctions[name] = fn;
			
			if(tmp) {
				WR.xd.exposedFunctionsTmp[name] = true;
			}
			
			return name;
		}
	},///--- exposeFunction
	
	fragmentListener:function() {
		
		// TODO: listen for fragment
		
		WR.xd.fragmentListenerTimer = setTimeout(WR.xd.fragmentListener,WR.xd.fragmentListenerInterval);
	},///--- fragmentListener
	
	functionIsExposed:function(name) {
		if(typeof WR.xd.exposedFunctions[name] === "function") {
			return true;
		}
		return false;
	},///--- functionIsExposed
	
	getWindow:function(windowName) {
		if(WR.xd.hasWindow(windowName)) {
			return WR.xd.windows[windowName];
		}
	},///--- getWindow
	
	getXdmMethod:function() {
		if(window.postMessage) {
			WR.xd.xdmMethod = 'postmessage';
			return;
		}
		WR.xd.xdmMethod = 'fragment';
	},///--- getXdmMethod
	
	getUrlVars:function(url) {
	    var vars = [], hash;
	    var hashes = url.slice(url.indexOf('?') + 1).split('&');
	    for(var i = 0; i < hashes.length; i++) {
	        hash = hashes[i].split('=');
	        vars.push(hash[0]);
	        vars[hash[0]] = hash[1];
	    }
	    return vars;
	},///--- getUrlVars
	
	hasWindow:function(windowName) {
		return (typeof WR.xd.windows[windowName] !== "undefined") ? true : false;
	},///--- hasWindow
	
	onPostMessageReceived:function(message) {
		if(WR.xd.originIsAllowed(message.origin)) {
			var data = WR.qs.decode(message.data);
			if(data.method && WR.xd.functionIsExposed(data.method)) {
				
					console.log(message);
				var cb = WR.xd.exposedFunctions[data.method];
				if(WR.xd.exposedFunctionsTmp[data.method]) {
					delete WR.xd.exposedFunctions[data.method],
						WR.xd.exposedFunctionsTmp[data.method];
				}
				
				var cbResponse = cb(data);
				
				if(data.cb) {
					var sendBack = {'response':cbResponse}
					WR.xd.send('parent',data.cb,sendBack);
				}
			}
		}
	},///--- onPostMessageReceived
	
	
	originIsAllowed:function(origin) {
		if(WR.xd.originBlacklist.length > 0) {
			if(origin in WR.xd.originBlacklist) {
				return false;
			}
		}
		
		if(WR.xd.originWhitelist.length > 0) {
			if(origin in WR.xd.originWhitelist) {
				return true;
			}
			return false;
		}
		
		return true;
	},///--- originIsAllowed
	

	
	send:function(windowName,method,params,cb) {
		if(!WR.xd.hasWindow(windowName)) {
			return false;
		}
		
		var targ = WR.xd.windows[windowName];
		
		// add a tmp cb if necessary
		if(cb) {
			var callBackName = WR.xd.addExposedFunction(null,cb,true);
		}
		
		// setup object payload
		var obj = {};
		obj.method = method;
		obj.cb = (callBackName) ? callBackName : null;
		for(var param in params) {
			obj[param] = params[param];
		}
		
		// send message according to settings
		if(WR.xd.xdmMethod == "postmessage") {
			targ.object.postMessage(
				WR.qs.encode(obj),
				targ.url
			);
			
		}else if(WR.xd.xdmMethod == "fragment") {
			
			// TODO: send via frag id
			
		}
		
	},///--- send
	
	registerFragmentCallback:function(windowName) {
		if(WR.xd.hasWindow(windowName)) {
			
			// TODO: need to check for redundancies
			
			WR.xd.waitingOnFragment.push(windowName);
			WR.xd.toggleFragmentListener(true);
		}
	},///--- registerFragmentCallback
	
	toggleFragmentListener:function(toggle) {
		if(toggle === true) {
			WR.xd.fragmentListenerTimer = setTimeout(WR.xd.fragmentListener(),WR.xd.fragmentListenerInterval);
		}else if(toggle === false) {
			WR.xd.fragmentListenerTimer = clearTimeout();
		}
	}///--- toggleFragmentListener
});