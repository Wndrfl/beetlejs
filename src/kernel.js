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

	this.bindable = function(namespace,props,element,extend) {
		var extendable = this.Class.extend({
			bindTo: '',
			els: [],

			element: function(dom) {
				this.dom = dom;
			},

			bindAll: function() {
				var doms = document.querySelectorAll(this.bindTo);

				for(i = 0; i < doms.length; ++i) {
					this.els.push(this.make(doms[i]));
				}
			},

			make: function(dom) {
				var el = new this.element(dom);
				
				if(el.initialize) {
					el.initialize();
				}

				return el;
			},
		});
		var extended = extendable.extend(props);

		if(element) {
			for(key in element) {
				extended.prototype.element.prototype[key] = element[key];
			}
		}

		var bindable = this._namespace(namespace,extended);
		
		this._bindables[namespace] = bindable;

		return bindable;
	}
	
	this.bindAll = function() {
		for(key in this._bindables) {
			if(this._bindables[key].prototype.bindAll) {
				this._bindables[key].prototype.bindAll();
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