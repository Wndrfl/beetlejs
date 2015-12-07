window.___ = ___ = function() {

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
}

/**
 * CLASS
 */

___.prototype.Class = function() {
	var self = this;
}
___.prototype.Class.extend = function(props) {

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

___.prototype.events = require('./events');
___.prototype.networking = require('./networking');
___.prototype.util = require('./util');

// convenience shortcuts
___.prototype.log = ___.prototype.util.log;
___.prototype.uniqid = ___.prototype.util.uniqid;

module.exports = ___;