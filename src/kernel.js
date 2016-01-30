module.exports = function() {

	var VERSION = '0.5.1',
		DEBUG = true;

	this._bindables = [];

	this._makeBindable = function(props) {
		var extendable = this.Class.extend({
			bind: function() {
				if(this._doBind) {
					this._doBind.call(this);
				}
			},

			_doBind:function() {
				console.log('No _doBind function supplied.');
			},
		});

		var bindable = extendable.extend(props);

		return bindable;
	}

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

	this.element = function(namespace,selector,factoryNamespace) {

		var self = this;

		var factory = this;
		var tp = factoryNamespace.split('.');
		for(i=0;i<tp.length;i++) {
			
			var p = tp[i];

			if(!factory[p]) {
				throw new Error(factoryNamespace+' does not exist.');
			}
			
			factory = factory[p];
		}

		var props = {};
		props.factory = factory;
		props.selector = selector;
		props._doBind = function() {
			var dom;
			dom = document.querySelector(this.selector);

			var obj = this.factory.make(dom);
			self._namespace(namespace,obj);
		};

		var bindable = this._makeBindable(props);

		if(namespace) {
			this._bindables[namespace] = bindable;
		}
	}
	
	this.factory = function(namespace,element) {

		var self = this;

		var factory = this.Class.extend({
			els: [],
			element: function(dom) {
				this.dom = dom;
			},
			make: function(dom) {
				var el = new this.element(dom);
				if(el.initialize) {
					el.initialize();
				}
				return el;
			},
		});

		if(element) {
			for(key in element) {
				factory.prototype.element.prototype[key] = element[key];
			}
		}

		if(namespace) {
			var factory = new factory();
			this._namespace(namespace,factory);
		}

		return factory;
	}
	
	this.bindAll = function() {
		for(key in this._bindables) {
			if(this._bindables[key].prototype.bind) {
				this._bindables[key].prototype.bind();
			}
		}
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