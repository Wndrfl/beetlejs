(function() {
	
	'use strict';

	var ___ = window.___ = {

		VERSION: '1.0.0',
		DEBUG: true,

		_namespace:function(namespace,value) {

			var node = window.___;
			value = (value) ? value : {};
			
			var tp = namespace ? namespace.split('.') : [];
			for(i=0;i<tp.length;i++) {
				
				var p = tp[i];
				
				//
				if(!node[p]) {
					node[p] = (value && i+1 == tp.length) ? value : {};
				}
				
				node = node[p];
			}
			
			return node;
		},

		entity:function(namespace,props,extend) {
			var extendable = extend ? ___._namespace(extend) : ___.Class;
			var extended = extendable.extend(props);
			return ___._namespace(namespace,extended);
		},

		extend:function(namespace,object) {
			return this._namespace(namespace,object);
		},
		
	};

	/**
	 * CLASS
	 */
	
	___.Class = function() {}
	___.Class.extend = function(props) {

		// extended class with the new prototype
		var NewClass = function () {

			// call the constructor
			if(this.initialize) {
				this.initialize.apply(this,arguments);
			}

			// call all constructor hooks
			if(this._initHooks) {
				this.callInitHooks();
			}
		};

		// instantiate class without calling constructor
		var F = function() {};
		F.prototype = this.prototype;

		var proto = new F();
		proto.constructor = NewClass;

		NewClass.prototype = proto;

		//inherit parent's statics
		for (var i in this) {
			if (this.hasOwnProperty(i) && i !== 'prototype') {
				NewClass[i] = this[i];
			}
		}

		proto._id = ___.util.guid();
		proto._initHooks = [];

		___.util.copy(proto,props,true);

		var parent = this;
		// jshint camelcase: false
		NewClass.prototype.__super__ = parent.prototype;

		// add method for calling all hooks
		proto.callInitHooks = function () {

			if (this._initHooksCalled) { return; }

			if(parent.prototype.callInitHooks) {
				parent.prototype.callInitHooks.call(this);
			}

			this._initHooksCalled = true;

			for (var i = 0, len = proto._initHooks.length; i < len; i++) {
				proto._initHooks[i].call(this);
			}
		};

		return NewClass;
	};

	___.extend('util',{

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

		guid:function() {
		    var S4 = function() {
		       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		    };
		    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());			
		},

		log:function(data) {
			if(arguments.length > 1) {
				data = Array.prototype.slice.call(arguments);
			}
			if(___.DEBUG) console.log(data);
		},

		uniqid: function (pr) {
			var pr = pr || '', en = en || false, result;
	  
			this.seed = function (s, w) {
				s = parseInt(s, 10).toString(16);
				return w < s.length ? s.slice(s.length - w) : (w > s.length) ? new Array(1 + (w - s.length)).join('0') + s : s;
			};

			result = pr + this.seed(parseInt(new Date().getTime() / 1000, 10), 8) + this.seed(Math.floor(Math.random() * 0x75bcd15) + 1, 5);

			return result;
		},
	});

	// convenience shortcuts
	___.log = ___.util.log;
	___.uniqid = ___.util.uniqid;

})();