 module.exports = function() {

	var VERSION = '0.5.1',
		DEBUG = true;

	this._bindables = [];

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

	this._makeBindable = function(bindTo,props,element,extend) {
		var extendable = this.Class.extend({
			selector: null,
			els: [],

			element: function(dom) {
				this.dom = dom;
			},

			bind: function() {
				if(!this.selector) {
					return;
				}
				if(this.bindTo) {
					this.bindTo.call(this,this.selector)
				}
			},

			bindTo:function() {
				console.log('No bindTo function supplied.');
			},

			make: function(dom) {
				var el = new this.element(dom);
				
				if(el.initialize) {
					el.initialize();
				}

				return el;
			},
		});

		props.bindTo = bindTo;
		var bindable = extendable.extend(props);

		if(element) {
			for(key in element) {
				bindable.prototype.element.prototype[key] = element[key];
			}
		}

		return bindable;
	}

	this.bindable = function(namespace,props,element,extend) {
		var bindable = this._makeBindable(function(el) {
			var doms = [];
			if(typeof el === 'string') {
				doms = document.querySelectorAll(this.selector);
			}else{
				doms.push(el);
			}

			for(i = 0; i < doms.length; ++i) {
				var obj = this.make(doms[i]);
				this.els.push(obj);
			}
		},props,element,extend);

		if(namespace) {
			var bindable = this._namespace(namespace,bindable);
			this._bindables[namespace] = bindable;
		}

		return bindable;
	}

	this.singleton = function(namespace,props,element,extend) {
		var self = this;
		var bindable = this._makeBindable(function(el) {
			var dom;
			if(typeof el === 'string') {
				dom = document.querySelector(this.selector);
			}else{
				dom = el;
			}

			var obj = this.make(dom);
			self._namespace(namespace,obj);
		},props,element,extend);

		if(namespace) {
			this._bindables[namespace] = bindable;
		}

		return bindable;
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