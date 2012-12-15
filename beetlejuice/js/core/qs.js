/**
* Packages and unpackages querystring messages
* 
* @provides
* 	BBB.qs
* 
* @requires
* 	BBB.scaffold
* 	BBB.array
**/

BBB.extend('qs',{
	
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
	    BBB.array.forEach(params,function(val, key) {
	      if(val !== null && typeof val != 'undefined') {
	        pairs.push(encode(key) + '=' + encode(val));
	      }
	    });
	
	    pairs.sort();
	    return pairs.join(sep);
	}
});