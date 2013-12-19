/**
 * The main scaffolding for the entire framework.
 **/
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
			 * main namespace that can be extended and inherited from.
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
			 * in the main namespace, at the supplied target.
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
			 * Extends an object by adding the source argument
			 * to it.
			 * 
			 * If target is a string, it creates a blank namespace 
			 * in the framework.
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
			 * Custom console logging
			 **/
			log:function() { 
				if(window.console && window.console.log) {
					var logme = (arguments.length == 1) ? arguments : Array.prototype.slice.call(arguments);
					window.console.log(logme);
				}
			},

			/**
			 * Imports framework settings
			 **/
			importSettings:function(settings) {
				for(var key in settings) {
					BBB._settings[key] = settings[key];
				}
			},
			
			/**
			 * Subsclasses a parent class
			 * 
			 * If parent class does not already exist, it creates 
			 * it on the fly.
			 **/
			namespace:function(namespace,extend,construct,proto) {
				
				if(!BBB.CLASSES) {
					BBB.CLASSES = {}
				}
				
				if(typeof namespace === 'object') {
					extend = namespace.extend;
					construct = namespace.construct;
					proto = namespace.proto;
					namespace = namespace.namespace;
				}
				
				if(BBB.CLASSES[namespace]) {
					return BBB.CLASSES[namespace];
				}
				
				// copy parent methods into proto (don't overwrite)
				
				// if extend in array form
				var parentClass = function() {};
				if(typeof extend === 'array') {
					
					for(i=0;i<extend.length;i++) {
						parentClass = BBB.create(extend[i]);
						BBB.copy(proto,parentClass.prototype);
					}
				
				// if extend in string form
				}else if(typeof extend === 'string') {
					parentClass = BBB.create(extend);
					BBB.copy(proto,parentClass.prototype);
				}

				
				return BBB.Class(namespace,
					construct ? construct : function() {
				        if (parentClass.apply) {
				          parentClass.apply(this, arguments);
				        }
				      },
				      proto);
			},

			/**
			 * Run a function in the scope of the framework
			 **/
			run:function(fn) {
				if(fn.apply)
					fn.apply(this);
			},
			
			/**
			 * Returns all framework settings
			 **/
			settings:function(key) {
				return (BBB._settings[key]) ? BBB._settings[key] : false;
			}
			
		}
	}
})();