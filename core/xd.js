/**
* Manages cross-domain communication
* 
* jQuery
* 	false
* 
* @provides
* 	BBB.xd
* 
* @requires
* 	BBB.scaffold
* 	BBB.qs
* 	BBB.events
*/

BBB.extend('xd',{
	
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
			BBB.xd.addWindow("parent",window.parent,'*');
		}
		
		BBB.xd.getXdmMethod();
		
		// set up listener
		if(BBB.xd.xdmMethod === 'postmessage') {
			if(typeof window.addEventListener !== 'undefined') { 
				window.addEventListener('message',function(e) {
					BBB.xd.onPostMessageReceived(e);
				},false); 
			}else if(typeof window.attachEvent !== 'undefined') { 
			  	window.attachEvent('onmessage',function(e) {
					BBB.xd.onPostMessageReceived(e);
				}); 
			}
		}
		
		// tell BBB that xd is setup
		BBB.events.fire('xd.ready');
		
	},///--- init
	
	addWindow:function(windowName,object,url) {
		BBB.xd.windows[windowName] = {
			cb:function(){},
			object:object,
			url:url
		}
	},///--- addWindow
	
	callExposedFunction:function(name,params) {
		var fn = BBB.xd.exposedFunctions[name];
		return fn(params);
	},///--- callExposedFunction
	
	exposeFunction:function(name,fn,tmp) {
		if(typeof fn === "function") {
			name = (name) ? name : BBB.util.guid();
			BBB.xd.exposedFunctions[name] = fn;
			
			if(tmp) {
				BBB.xd.exposedFunctionsTmp[name] = true;
			}
			
			return name;
		}
	},///--- exposeFunction
	
	fragmentListener:function() {
		
		// TODO: listen for fragment
		
		BBB.xd.fragmentListenerTimer = setTimeout(BBB.xd.fragmentListener,BBB.xd.fragmentListenerInterval);
	},///--- fragmentListener
	
	functionIsExposed:function(name) {
		if(typeof BBB.xd.exposedFunctions[name] === "function") {
			return true;
		}
		return false;
	},///--- functionIsExposed
	
	getWindow:function(windowName) {
		if(BBB.xd.hasWindow(windowName)) {
			return BBB.xd.windows[windowName];
		}
	},///--- getWindow
	
	getXdmMethod:function() {
		if(window.postMessage) {
			BBB.xd.xdmMethod = 'postmessage';
			return;
		}
		BBB.xd.xdmMethod = 'fragment';
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
		return (typeof BBB.xd.windows[windowName] !== "undefined") ? true : false;
	},///--- hasWindow
	
	onPostMessageReceived:function(message) {
		if(BBB.xd.originIsAllowed(message.origin)) {
			var data = BBB.qs.decode(message.data);
			if(data.method && BBB.xd.functionIsExposed(data.method)) {
				
					console.log(message);
				var cb = BBB.xd.exposedFunctions[data.method];
				if(BBB.xd.exposedFunctionsTmp[data.method]) {
					delete BBB.xd.exposedFunctions[data.method],
						BBB.xd.exposedFunctionsTmp[data.method];
				}
				
				var cbResponse = cb(data);
				
				if(data.cb) {
					var sendBack = {'response':cbResponse}
					BBB.xd.send('parent',data.cb,sendBack);
				}
			}
		}
	},///--- onPostMessageReceived
	
	
	originIsAllowed:function(origin) {
		if(BBB.xd.originBlacklist.length > 0) {
			if(origin in BBB.xd.originBlacklist) {
				return false;
			}
		}
		
		if(BBB.xd.originWhitelist.length > 0) {
			if(origin in BBB.xd.originWhitelist) {
				return true;
			}
			return false;
		}
		
		return true;
	},///--- originIsAllowed
	

	
	send:function(windowName,method,params,cb) {
		if(!BBB.xd.hasWindow(windowName)) {
			return false;
		}
		
		var targ = BBB.xd.windows[windowName];
		
		// add a tmp cb if necessary
		if(cb) {
			var callBackName = BBB.xd.addExposedFunction(null,cb,true);
		}
		
		// setup object payload
		var obj = {};
		obj.method = method;
		obj.cb = (callBackName) ? callBackName : null;
		for(var param in params) {
			obj[param] = params[param];
		}
		
		// send message according to settings
		if(BBB.xd.xdmMethod == "postmessage") {
			targ.object.postMessage(
				BBB.qs.encode(obj),
				targ.url
			);
			
		}else if(BBB.xd.xdmMethod == "fragment") {
			
			// TODO: send via frag id
			
		}
		
	},///--- send
	
	registerFragmentCallback:function(windowName) {
		if(BBB.xd.hasWindow(windowName)) {
			
			// TODO: need to check for redundancies
			
			BBB.xd.waitingOnFragment.push(windowName);
			BBB.xd.toggleFragmentListener(true);
		}
	},///--- registerFragmentCallback
	
	toggleFragmentListener:function(toggle) {
		if(toggle === true) {
			BBB.xd.fragmentListenerTimer = setTimeout(BBB.xd.fragmentListener(),BBB.xd.fragmentListenerInterval);
		}else if(toggle === false) {
			BBB.xd.fragmentListenerTimer = clearTimeout();
		}
	}///--- toggleFragmentListener
});