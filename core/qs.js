/**
* Packages and unpackages querystring messages
* 
* jQuery
* 	false
* 
* @provides
* 	WR.qs
* 
* @requires
* 	WR.scaffold
* 	WR.array
*/

WR.extend('qs',{
	
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
	
	encode:function(params,sep,encode) {
		/*
		var message = JSON.stringify(obj);
		return message;
		*/
		
		sep = sep === undefined ? '&' : sep;
	    encode = encode === false ? function(s) { return s; } : encodeURIComponent;

	    var pairs = [];
	    WR.array.forEach(params,function(val, key) {
	      if(val !== null && typeof val != 'undefined') {
	        pairs.push(encode(key) + '=' + encode(val));
	      }
	    });
	
	    pairs.sort();
	    return pairs.join(sep);
	}
});