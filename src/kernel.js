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