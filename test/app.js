(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Class = function() {};
Class.extend = function(props) {

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

	proto._id = ___.prototype.util.guid();
	proto._initHooks = [];

	___.prototype.util.copy(proto,props,true);

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

module.exports = Class;
},{}],2:[function(require,module,exports){
module.exports = {
	
	/**
	 * Clears ALL event listeners.
	 **/
	clear:function(eventName) {
		var subscriptions = ___.events.subscriptions()[eventName];
		
		if(subscriptions) {
			for(var key in subscriptions) {
				subscriptions[key] = null;
			}
		}
	},
	
	/**
	 * Fires an event and passes each listener the
	 * supplied params.
	 **/
	fire:function(eventName,params) {

		___.log("EVENT FIRED: "+eventName);

		var subscriptions = ___.events.subscriptions()[eventName];
		if(subscriptions) {
			for(var key in subscriptions) {
				var cb = subscriptions[key];
				if(typeof cb == "function") {
					cb(params);
				}
			}
		}
	},

	once:function(eventName,cb) {
		var onceCb = function(params) {
			___.events.unsubscribe(eventName,cb);
			cb(params);
		}
		this.subscribe(eventName,onceCb);
	},
	
	/**
	 * Returns a list of all subscriptions for
	 * all events.
	 **/
	subscriptions:function() {
		if(!___.events.subscribers) {
			___.events.subscribers = []
		}
		return ___.events.subscribers;
	},
	
	/**
	 * Subscribes a callback to an event.
	 * 
	 * This callback will be called when the event
	 * is fired.
	 **/
	subscribe:function(eventName,cb) {
		var subscriptions = ___.events.subscriptions();
		
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
		var subscriptions = ___.events.subscriptions()[eventName];
		
		if(subscriptions) {
			for(var key in subscriptions) {
				var cb = subscriptions[key];
				if(cb == cbToRemove) {
					subscriptions[key] = null;
				}
			}
		}
	}
};
},{}],3:[function(require,module,exports){
window.___ = ___ = require('./kernel');

___.prototype.Class = require('./class');
___.prototype.events = require('./events');
___.prototype.networking = require('./networking');
___.prototype.util = require('./util');

// convenience shortcuts
___.prototype.log = ___.prototype.util.log;
___.prototype.uniqid = ___.prototype.util.uniqid;

module.exports = ___;
},{"./class":1,"./events":2,"./kernel":4,"./networking":5,"./util":6}],4:[function(require,module,exports){
module.exports = function() {

	var VERSION = '0.5.1',
		DEBUG = true;

	this._namespace = function(namespace,value) {

		var node = this;
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
	}

	this.entity = function(namespace,props,extend) {
		var extendable = extend ? this._namespace(extend) : this.Class;
		var extended = extendable.extend(props);
		return this._namespace(namespace,extended);
	}

	this.extend = function(namespace,object) {
		return this._namespace(namespace,object);
	}
};
},{}],5:[function(require,module,exports){
module.exports = {

	callbacks: {},

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
	    for(var key in params) {
	    	var val = params[key];
	    	if(val !== null && typeof val != 'undefined') {
	        	pairs.push(encode(key) + '=' + encode(val));
			}
	    }
	
	    pairs.sort();
	    return pairs.join(sep);
	},

	jsonp: function(url,cb) {

		// set up the callback
		var self = this;
		var uniqid = ___.uniqid('jsonp');
		var cb = cb || function() {};

		this[uniqid] = function(data) {
			cb(data);
			var script = document.getElementById(uniqid);
			script.parentNode.removeChild(script);
			delete self[uniqid];
		}

		// configure url
		var callback = '___.networking.'+uniqid;
		if(url.indexOf('?') !== -1) {
			var split = url.split('?');
			params = this.decode(split[1]);
			params['callback'] = callback;
			url = split[0]+'?'+this.encode(params);
		}else{
			url += '?callback='+callback;
		}

		// do jsonp
		var script = document.createElement('script');
		script.src = url;
		script.setAttribute('id',uniqid);
		document.head.appendChild(script);

		___.log("JSONP: "+url);

		return {
			abort: function() {
				___.log("ABORTING JSONP: "+url)
				delete self[uniqid];
				var script = document.getElementById(uniqid);
				script.parentNode.removeChild(script);
			}
		};
	}
};
},{}],6:[function(require,module,exports){
module.exports = {

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
};
},{}],7:[function(require,module,exports){
require('./../../src');

var app = window.app = new ___();

app.entity('button',{
	el:null,

	initialize: function(el) {
		var self = this;
		el.onclick = function() {
			self.doAlert();
		}
	},

	doAlert:function() {
		alert('ALERT!');
	}
});
},{"./../../src":3}]},{},[7]);
