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