/**
* Provides common dom manipulation
* 
* @provides
* 	BBB.dom
* 
* @requires
* 	BBB.scaffold
* 	BBB.array
* 	BBB.events
*/

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