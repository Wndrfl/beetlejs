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