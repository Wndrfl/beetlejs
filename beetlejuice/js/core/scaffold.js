/**
 * The main scaffolding for the entire framework.
 **/
(function() {
	if(typeof window.BBB === "undefined") {
		var BBB = window.BBB = {
			
			domains:{
				www:'http://www.beetlejuice.dev/'
			},
			
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
			}
		}
	}
})();