/*! beetlejuice - v0.0.1 - 2013-12-11
* Copyright (c) 2013 ; Licensed  */
(function() {
	if(typeof window.BBB === "undefined") {
		var BBB = window.BBB = {
			
			_settings:{},
			
			bind:function(scope, fn) {
			    return function() {
			        return fn.apply(scope,Array.prototype.slice.call(arguments));
			    };
			},
			
			/**
			 * Creates a new Javascript "Class" under the 
			 * BBB namespace that can be extended and inherited from.
			 **/
			Class:function(name,constructor,proto) {
				if(!BBB.CLASSES) {
					BBB.CLASSES = {}
				}
				
				if(BBB.CLASSES[name]) {
					return BBB.CLASSES[name];
				}
				
				var obj = constructor || function() {};
				obj.prototype = proto;
				obj.prototype.bind = function(fn) {
					BBB.bind(this,fn);
				}
				
				BBB.create(name,obj);
				BBB.CLASSES[name] = obj;
				
				return BBB.CLASSES[name];
			},
			
			/**
			 * Copies one array/object into another, optionally
			 * replacing the values if a duplicate key is found.
			 **/
			copy:function(target,source,overwrite) {
				for(var key in source) {
					if(overwrite || typeof target[key] === "undefined") {
						target[key] = source[key];
					}
				}
				return target;
			},
			
			/**
			 * Finds or creates a supplied value (an object by default) 
			 * in the BBB namespace, at the supplied target.
			 * 
			 * The target should be a dot-separated name, like so:
			 * "this.is.my.target.name".
			 **/
			create:function(target,value) {
				
				var node = window.BBB;
				value = (value) ? value : {};
				
				var tp = target ? target.split('.') : [];
				for(i=0;i<tp.length;i++) {
					
					var p = tp[i];
					var hasNode = node[p];
					
					if(!hasNode) {
						node[p] = (value && i+1 == tp.length) ? value : {};
					}
					
					node = node[p];
				}
				
				return node;
			},

			/**
			 * Completely destory an object recursively
			 **/
			destroy:function(obj) {
    			for (var o in obj) if (isNaN(parseInt(o))) this.destroy(obj[o]); console.log('hi')
    			obj = null;
    			delete obj;
			},
			
			/**
			 * Extends an object by adding the source argument
			 * to it.
			 * 
			 * If target is a string, it creates a blank namespace 
			 * in the BBB framework.
			 * 
			 * The target is extended by copying all items in the source
			 * into the target object.
			 **/
			extend:function(target,source) {
				var targetNode = (typeof target === "string") 
						? BBB.create(target) : target;
				BBB.copy(targetNode,source);
			},
			
			/**
			 * Custom console logging.
			 **/
			log:function() { 
				if(window.console && window.console.log) {
					var logme = (arguments.length == 1) ? arguments : Array.prototype.slice.call(arguments);
					window.console.log(logme);
				}
			},

			/**
			 * Imports framework settings into BBB.
			 **/
			importSettings:function(settings) {
				for(var key in settings) {
					BBB._settings[key] = settings[key];
				}
			},
			
			/**
			 * Returns all BBB settings.
			 **/
			settings:function(key) {
				return (BBB._settings[key]) ? BBB._settings[key] : false;
			},
			
			/**
			 * Subsclasses a parent class.
			 * 
			 * If parent class does not already exist, it creates 
			 * it on the fly.
			 **/
			subclass:function(parentName,name,constructor,proto) {
				if(BBB.CLASSES[name]) {
					return BBB.CLASSES[name];
				}
				
				if(!BBB.CLASSES) {
					BBB.CLASSES = {}
				}
				
				// copy parent methods into proto (don't overwrite)
				var parentClass = BBB.create(parentName);
				BBB.copy(proto,parentClass.prototype);
				
				return BBB.Class(name,
					constructor ? constructor : function() {
				        if (parentClass.apply) {
				          parentClass.apply(this, arguments);
				        }
				      },
				      proto);
			},

			whitelabel:function(targetName) {
				if(typeof targetName !== "string") {
					return false;
				}
				if(typeof window[targetName] === "undefined") {
					window[targetName] = {};
					this.extend(window[targetName],this);
				}
				return false;
			}
		}
	}
})();
BBB.extend('array',{
	
	/**
	 * Provides functionality to loop through a 
	 * supplied array and apply a function to each 
	 * array item.
	 **/
	forEach:function(item,fn,proto) {
		if(!item) {
			return;
		}

		if(Object.prototype.toString.apply(item) === '[object Array]' || (!(item instanceof Function) && typeof item.length == 'number')) {
			if(item.forEach) {
				item.forEach(fn);
			}else{
				for(var i=0, l=item.length; i<l; i++) {
					fn(item[i], i, item);
				}
			}
		}else{
			for(var key in item) {
				if(proto || item.hasOwnProperty(key)) {
					fn(item[key], key, item);
				}
			}
		}
	},
	
	/**
	 * Checks to see if an array contains a supplied
	 * array key.
	 **/
	hasKey:function(keyName,haystack) {
		if(typeof haystack === '[object Array]') {
			for(var key in haystack) {
				if(key == keyName) {
					return haystack[key];
				}
			}
			return false;
		}
	},
	
	/**
	 * Checks to see if an array container a supplied value.
	 **/
	inArray:function(needle,haystack) {
	    var i = haystack.length;
	    while(i--) {
	       if (haystack[i] === needle) {
	           return true;
	       }
	    }
	    return false;
	}
});
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
BBB.extend('content',{
	
	/**
	 * Append either a string or a DOM element
	 * to a parent DOM element
	 **/
	append:function(parent,content) {
		if(typeof content === "string") {
			var div = document.createElement('div');
			div.innerHTML = content;
			return parent.appendChild(div);
		}else{
			return parent.appendChild(content);
		}
	},
	
	/**
	 * Append an iframe with the provided
	 * parameters to a parent DOM element.
	 **/
	insertIframe:function(parent,params) {
		if(!parent) {
			BBB.log('No parent was provided for the iframe.');
		}
		
		// if IE
		if(window.attachEvent) {
			var i = "<iframe src='" + params.src + "'" + 
					" id='" + params.id + "'" +
					" width='" + params.width + "'" +
					" height='" + params.height + "'" +
					(params.className ? " class='" + params.className + "'" : "") +
					" style='border:0;overflow:hidden;" + 
						(params.width ? "width:" + params.width + "px;" : "") +
						(params.height ? "height:" + params.height + "px;" : "") +
					"'" + 
					" scrolling='no'" +
					" frameborder='0'" +
					" allowtransparency='true'></iframe>";
	
			BBB.content.append(parent,i);
		
		// non IE	
		}else{
			
			i = document.createElement('iframe');
			i.id = params.id;
			if(params.className) {
				i.className = params.className;
			}
			if(params.height) {
				i.style.height = params.height+"px";
			}
			if(params.width) {
				i.style.width = params.width+"px";
			}
			
			i.scrolling = "no";
			i.frameBorder = 0;
			i.style.background = "transparent";
			i.style.border = "0";
			i.style.overflow = "hidden";

			BBB.content.append(parent,i);
			
			i.setAttribute("src",params.src);
		}
	}
});
BBB.extend('dom',{

	/**
	 * Stores current state of document DOM.
	 **/
	isReady:false,
	
	/**
	 * Adds a CSS file to the document <head>.
	 **/
	addCssFile:function(url) {
		var head = document.head || document.getElementsByTagName('head')[0] || document.documentElement,
		script;
		
		var css = document.createElement("link");
		css.setAttribute("rel","stylesheet");
		css.setAttribute("type","text/css");
		css.setAttribute("href",filename);
		head.appendChild(script);
	},//-- addCssFile
	
	/**
	 * Adds inline CSS styles to the document <head>.
	 **/
	addCssRules:function(styles, names) {
		
	    if(!BBB.dom._cssRules) {
			BBB.dom._cssRules = {};
		}

		// note, we potentially re-include CSS if it comes with other CSS that we
		// have previously not included.
		var allIncluded = true;
		BBB.array.forEach(names, function(id) {
			if(!(id in BBB.dom._cssRules)) {
				allIncluded = false;
				BBB.dom._cssRules[id] = true;
			}
		});

		if(allIncluded) {
			return;
		}

		//#JSCOVERAGE_IF
		if(BBB.dom.getBrowserType() != 'ie') {
			var style = document.createElement('style');
			style.type = 'text/css';
			style.textContent = styles;
			document.getElementsByTagName('HEAD')[0].appendChild(style);
		}else{
			try {
				document.createStyleSheet().cssText = styles;
			}catch (exc){
				// major problem on IE : You can only create 31 stylesheet objects with
				// this method. We will have to add the styles into an existing
				// stylesheet.
				if (document.styleSheets[0]) {
					document.styleSheets[0].cssText += styles;
				}
			}
		}
	},//-- addCssRules
	
	/**
	 * Adds a class name to a provided DOM element.
	 **/
	addClass:function(dom,className) {
		var oldClasses = dom.className.split(' ');
		
		var inClass = false;
		BBB.array.forEach(oldClasses,function(cn) {
			if(cn == className) {
				inClass = true;
			}
		});
		
		if(!inClass) {
			oldClasses.push(className);
		}
		
		dom.className = oldClasses.join(' ');
	},
	
	/**
	 * Adds a Javascript file to the document <head>.
	 **/
	addJsFile:function(url) {
		script = document.createElement('script');
		script.async = "async";
		script.src = url;
		script.onload = script.onreadystatechange = function(){
			if(!this.readyState || this.readyState === "loaded" || this.readyState === "complete"){
				script.onload = script.onreadystatechange = null;
			}
		}
		head.appendChild(script);
	},//--- addJsFile
	
	/**
	 * Attaches an event listener to the DOM
	 **/
	attachEvent:function(dom,eventName,cb) {
		if(dom.addEventListener) {
			dom.addEventListener(eventName,cb,false);
		}else if(dom.attachEvent) {
			dom.attachEvent(eventName,cb);
		}
	},
	
	/**
	 * Attempts to detect the current browser type.
	 **/
	getBrowserType:function() {
		if(!BBB.dom._browserType) {
	      var
	        userAgent = window.navigator.userAgent.toLowerCase(),
	        // list of known browser. NOTE: the order is important
	        keys = ['msie', 'firefox', 'safari', 'gecko'],
	        names = ['ie', 'mozilla', 'safari', 'mozilla'];
	      for (var i = 0; i < keys.length; i++) {
	        if (userAgent.indexOf(keys[i]) >= 0) {
	          BBB.dom._browserType = names[i];
	          break;
	        }
	      }
	    }
	    return BBB.dom._browserType;
	},//-- getBrowserType
	
	
	/**
	 * Gets all elements found with a given class name.
	 * 
	 * Elements can optionally be filtered by their tag name.
	 * 
	 * A dom element can be supplied to look in,
	 * otherwise, will look in the entire document for these 
	 * elements.
	 * 
	 * Developed by Robert Nyman, http://www.robertnyman.com
	 * Code/licensing: http://code.google.com/p/getelementsbyclassname/
	 **/
	getElementsByClassName:function(className,tag,elm) {
		if (document.getElementsByClassName) {
			getElementsByClassName = function (className, tag, elm) {
				elm = elm || document;
				var elements = elm.getElementsByClassName(className),
					nodeName = (tag)? new RegExp("\\b" + tag + "\\b", "i") : null,
					returnElements = [],
					current;
				for(var i=0, il=elements.length; i<il; i+=1){
					current = elements[i];
					if(!nodeName || nodeName.test(current.nodeName)) {
						returnElements.push(current);
					}
				}
				return returnElements;
			};
		}
		else if (document.evaluate) {
			getElementsByClassName = function (className, tag, elm) {
				tag = tag || "*";
				elm = elm || document;
				var classes = className.split(" "),
					classesToCheck = "",
					xhtmlNamespace = "http://www.w3.org/1999/xhtml",
					namespaceResolver = (document.documentElement.namespaceURI === xhtmlNamespace)? xhtmlNamespace : null,
					returnElements = [],
					elements,
					node;
				for(var j=0, jl=classes.length; j<jl; j+=1){
					classesToCheck += "[contains(concat(' ', @class, ' '), ' " + classes[j] + " ')]";
				}
				try	{
					elements = document.evaluate(".//" + tag + classesToCheck, elm, namespaceResolver, 0, null);
				}
				catch (e) {
					elements = document.evaluate(".//" + tag + classesToCheck, elm, null, 0, null);
				}
				while ((node = elements.iterateNext())) {
					returnElements.push(node);
				}
				return returnElements;
			};
		}
		else {
			getElementsByClassName = function (className, tag, elm) {
				tag = tag || "*";
				elm = elm || document;
				var classes = className.split(" "),
					classesToCheck = [],
					elements = (tag === "*" && elm.all)? elm.all : elm.getElementsByTagName(tag),
					current,
					returnElements = [],
					match;
				for(var k=0, kl=classes.length; k<kl; k+=1){
					classesToCheck.push(new RegExp("(^|\\s)" + classes[k] + "(\\s|$)"));
				}
				for(var l=0, ll=elements.length; l<ll; l+=1){
					current = elements[l];
					match = false;
					for(var m=0, ml=classesToCheck.length; m<ml; m+=1){
						match = classesToCheck[m].test(current.className);
						if (!match) {
							break;
						}
					}
					if (match) {
						returnElements.push(current);
					}
				}
				return returnElements;
			};
		}
		return getElementsByClassName(className, tag, elm);
	},
	
	/**
	 * Gets elements by their tag name.
	 * 
	 * A dom element can be supplied to look in,
	 * otherwise, will look in the entire document for these 
	 * elements.
	 **/
	getElementsByTagName:function(tagName,dom) {
		var dom = (dom) ? dom : document.body;
		if(typeof tagName == "string") {
			var tagParts = tagName.split(',');
			var els = new Array();
			BBB.array.forEach(tagParts,function(tag) {
				var found = dom.getElementsByTagName(tag);
				for(i=0;i<found.length;i++) {
					els.push(found[i]);
				}
			});
			
			return els;
		}
	},
	
	/**
	 * Checks to see if a DOM element has a given class name.
	 **/
	hasClass:function(el,match) {
		var c;
	    if (el && el.className && typeof match === "string") {
	        c = el.getAttribute("class");
	        c = " "+ c + " ";
	        return c.indexOf(" " + match + " ") > -1;
	    } else {
	        return false;
	    }
	},
	
	/**
	 * Hides an element via CSS
	 **/
	hide:function(dom,cb) {
		dom.style.display = "none";
		
		if(cb) {
			cb(dom);
		}
	},
	
	/**
	 * Checks to see if an element is currently
	 * visible (not hidden).
	 **/
	isVisible:function(dom) {
		if(dom.offsetHeight == 0 || dom.offsetWidth == 0) { 
			return false;
		}
		if(dom.style.visibility == "hidden" || dom.style.display == "none") {
			return false;
		}
		
		return true;
	},
	
	/**
	 * Completely removes an element from the DOM.
	 **/
	remove:function(dom) {
		BBB.dom.replace(dom,null);
	},
	
	/**
	 * Removes a class name from a given DOM element's
	 * classes.
	 **/
	removeClass:function(dom,className) {
		var oldClasses = dom.className.split(' ');
		
		BBB.array.forEach(oldClasses,function(cn,key) {
			if(cn == className) {
				delete oldClasses[key];
			}
		});
		
		dom.className = oldClasses.join(' ');
	},
	
	/**
	 * Replaces one dom element with another.
	 **/
	replace:function(dom,replacement) {
		if(!dom.parentNode) {
			return;
		}
		
		var replaced = dom.parentNode.replaceChild(replacement,dom);
		
		return replaced;
	},
	
	/**
	 * Shows a previously hidden DOM element via CSS.
	 **/
	show:function(dom,cb) {
		dom.style.display = "block";
		
		if(cb) {
			cb(dom);
		}
	}
	
});

/**
 * Self-executing function that monitors the DOM
 * for readiness.
 * 
 * This is required to tell when the DOM becomes
 * ready.
 **/
(function() {
	
	function domIsReady() {
		BBB.dom.isReady = true;
		BBB.events.fire('dom.ready');
		BBB.events.clear('dom.ready');
		
	}
	
	// check to see if already ready
	if(BBB.dom.isReady == true || document.readyState == 'complete') {
		domIsReady();
		return;
	}
	
	// listen for onload
	if(document.addEventListener) {	
		document.addEventListener('DOMContentLoaded',function() { domIsReady();},false);
	}else if(document.attachEvent) {
		document.attachEvent('onreadystatechange',function() { domIsReady();});
	}
	
	// Bad citizens.
  	// If IE is used and page is not in a frame, continuously check to see if
  	// the document is ready
  	if(BBB.dom.getBrowserType() == 'ie' && window === top) {
    	(function() {
      		try {
        		// If IE is used, use the trick by Diego Perini
        		// http://javascript.nwbox.com/IEContentLoaded/
        		document.documentElement.doScroll('left');
      		} catch(error) {
        		setTimeout(arguments.callee, 0);
        		return;
      		}

      		// and execute any waiting functions
      		domIsReady();
    	})();
	
		// fallback
		saveOldOnload = window.onload;
		window.onload = function() {
			domIsReady();
	
			if(saveOldOnload) {
				if(typeof saveOldOnload == "string") {
					eval(saveOldOnload);
				}else{
					saveOldOnload();
				}
			}
		}
	}
})();
BBB.extend('ui.elements',{

	_elements:[],
	
	parse:function() {
		var self = this;
		BBB.array.forEach(BBB.ui.elements.elementTypes,function(type) {
			
			self._elements[type] = new Array();
			
			var els = BBB.dom.getElementsByClassName(type.publicName);
			var obj = BBB.create(type.className);
			console.log(type.className);

			for(i=0;i<els.length;i++) {
				var element = new obj(els[i]);
				element.setup();
				
				self._elements[type].push(els[i]);
			}
		});
	},
	
	/*
	 * Find all new instances of publicName and bind
	**/
	parseNew:function(publicName) {
		var els = BBB.dom.getElementsByClassName(publicName);
		if(els.length == 0) {
			return;
		}
		
		var self = this;
		
		BBB.array.forEach(BBB.ui.elements.elementTypes,function(type) {
			if(type.publicName == publicName) {
				var obj = BBB.create(type.className);

				for(i=0;i<els.length;i++) {
					if(!BBB.array.inArray(els[i],self._elements)) {
						var element = new obj(els[i]);
						element.setup();
				
						self._elements[type].push(els[i]);
					}
				}
			}
		});
	},
	
	elementTypes:[
		{ publicName:'alertButton', className:'ui.alertButton'},
	]
});
BBB.Class('ui.element',
	function(dom) {
		this.dom = dom;
	},
	{
		getAttribute:function(name,defaultValue,transform) {
			var value = (
			  this.dom.getAttribute(name) ||
		      this.dom.getAttribute(name.replace(/-/g, '_')) ||
		      this.dom.getAttribute(name.replace(/-/g, ''))
		    );
		    return value ? (transform ? transform(value) : value) : defaultValue;
		},
		
		setup:function() {
			if(!this.setupAndValidate()) {
				BBB.log('setup failed');
				return false;
			}
		},
		
		setupAndValidate:function() {
			return true;
		}
	});
BBB.extend('events',{
	
	/**
	 * Clears ALL event listeners.
	 **/
	clear:function(eventName) {
		var subscriptions = BBB.events.subscriptions()[eventName];
		
		if(subscriptions) {
			BBB.array.forEach(subscriptions,function(subscription,key){
				subscriptions[key] = null;
			});
		}
	},
	
	/**
	 * Fires an event and passes each listener the
	 * supplied params.
	 **/
	fire:function(eventName,params) {
		var subscriptions = BBB.events.subscriptions()[eventName];
		
		if(subscriptions) {
			BBB.array.forEach(subscriptions,function(cb){
				if(typeof cb == "function") {
					cb(params);
				}
			});
		}
	},
	
	/**
	 * Returns a list of all subscriptions for
	 * all events.
	 **/
	subscriptions:function() {
		if(!BBB.events.subscribers) {
			BBB.events.subscribers = []
		}
		return BBB.events.subscribers;
	},
	
	/**
	 * Subscribes a callback to an event.
	 * 
	 * This callback will be called when the event
	 * is fired.
	 **/
	subscribe:function(eventName,cb) {
		var subscriptions = BBB.events.subscriptions();
		
		if(!subscriptions[eventName]) {
			subscriptions[eventName] = [];
		}
		subscriptions[eventName].push(cb);
	},
	
	/**
	 * Unsubscribes a callback from an event.
	 * 
	 * The cbToRemove argument must be exactly the same
	 * as the callback to remove.
	 **/
	unsubscribe:function(eventName,cbToRemove) {
		var subscriptions = BBB.events.subscriptions()[eventName];
		
		if(subscriptions) {
			BBB.array.forEach(subscriptions,function(cb,key) {
				if(cb == cbToRemove) {
					subscriptions[key] = null;
				}
			});
		}
	}
});
BBB.extend('',{
	
	/**
	 * Initializes the entire BBB framework.
	 **/
	init:function(options) {
	
		var settings = {
			elements:true
		}
		
		BBB.copy(settings,options,true);
	
		// initialize UI elements
		if(settings.elements && BBB.ui.elements) {
			if(BBB.dom.isReady) {
				BBB.ui.elements.parse();
			}else{
				BBB.events.subscribe('dom.ready',function() {
					BBB.ui.elements.parse();
				});
			}
		}
	}
});
BBB.extend('qs',{
	
	/**
	 * Decode str from url-friendly values.
	 **/
	decode:function(str) {
		var
		      decode = decodeURIComponent,
		      params = {},
		      parts = str.split('&'),
		      i,
		      pair;

		    for (i=0; i<parts.length; i++) {
		      pair = parts[i].split('=', 2);
		      if (pair && pair[0]) {
		        params[decode(pair[0])] = decode(pair[1]);
		      }
		    }

		    return params;
	},
	
	/**
	 * Encode string into url-friendly values.
	 **/
	encode:function(params,sep,encode) {
		sep = sep === undefined ? '&' : sep;
	    encode = encode === false ? function(s) { return s; } : encodeURIComponent;

	    var pairs = [];
	    BBB.array.forEach(params,function(val, key) {
	      if(val !== null && typeof val != 'undefined') {
	        pairs.push(encode(key) + '=' + encode(val));
	      }
	    });
	
	    pairs.sort();
	    return pairs.join(sep);
	}
});
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
BBB.extend('brains.validator',{
	
	/**
	 * Validates the structure of an email address.
	 **/
	validEmailAddress:function(email) {
		var atpos = email.indexOf("@");
		var dotpos = email.lastIndexOf(".");
		return (atpos<1 || dotpos<atpos+2 || dotpos+2>=email.length) ? false : true;
	}///--- validEmailAddress
	
});
BBB.subclass('ui.element','ui.alertButton',function(dom) {
	this.dom = dom;
	console.log('Constructing the alertButton!');
},{

	// will be run automatically
	setupAndValidate:function() {
	
		var self = this; // set a local copy of 'this'
	
		this.dom.onclick = function() {
			self.logMessage();
		}
		
		this.dom.onmouseover = function() {
			self.logMessage();
		}
		
		return true;
	},
	
	// method to print message to console
	logMessage:function() {
		console.log('Hey! You clicked me!');
	}
	
});BBB.init();