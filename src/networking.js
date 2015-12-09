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