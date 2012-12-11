/**
* Beetlejuice, Beetlejuice, Beetlejuice...
*/
(function($) {
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
			
			copy:function(target,source,overwrite) {
				for(var key in source) {
					if(overwrite || typeof target[key] === "undefined") {
						target[key] = source[key];
					}
				}
				return target;
			},
			
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
			
			devMode:function() {
				var tld = document.location.href.split("/")[3].split(".")[document.location.href.split("/")[3].split(".").length];
				
				return (tld == 'dev') ? true : false;
			},
			
			extend:function(target,source) {
				var targetNode = (typeof target === "string") 
						? BBB.create(target) : target;
				BBB.copy(targetNode,source);
			},

			
			log:function() { 
				if(window.console && window.console.log) {
					var logme = (arguments.length == 1) ? arguments : Array.prototype.slice.call(arguments);
					window.console.log(logme);
				}
			},

			importSettings:function(settings) {
				for(var key in settings) {
					BBB._settings[key] = settings[key];
				}
			},
			
			settings:function(key) {
				return (BBB._settings[key]) ? BBB._settings[key] : false;
			},
			
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
		
		// check for jQuery
		if(typeof $ === "undefined" || $ !== window.jQuery) {
			BBB.log('Please include jQuery.');
			
		// double check jQuery version (must be above v. 1.3)
		}else{
			(function($){$.isVersion=function(left,oper,right){if(left){var pre=/pre/i,replace=/[^\d]+/g,oper=oper||"==",right=right||$().jquery,l=left.replace(replace,''),r=right.replace(replace,''),l_len=l.length,r_len=r.length,l_pre=pre.test(left),r_pre=pre.test(right);l=(r_len>l_len?parseInt(l)*((r_len-l_len)*10):parseInt(l));r=(l_len>r_len?parseInt(r)*((l_len-r_len)*10):parseInt(r));switch(oper){case"==":{return(true===(l==r&&(l_pre==r_pre)));}case">=":{return(true===(l>=r&&(!l_pre||l_pre==r_pre)));}case"<=":{return(true===(l<=r&&(!r_pre||r_pre==l_pre)));}case">":{return(true===(l>r||(l==r&&r_pre)));}case"<":{return(true===(l<r||(l==r&&l_pre)));}}}return false;}})(jQuery);

			if(!jQuery.isVersion('1.3', '<')){
				// load fresh copy of jquery
				BBB.log('Please include a newer version of jQuery');
			}
		}
	}
})(jQuery);