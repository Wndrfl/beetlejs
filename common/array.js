/**
* Provides custom array functions
* 
* @provides 
* 	WR.array
* 
* @requires
* 	WR.scaffold
*/

WR.extend('array',{
	
	forEach:function(item,fn,proto) {
		if(!item) {
			return;
		}

		if(Object.prototype.toString.apply(item) === '[object Array]' || (!(item instanceof Function) && typeof item.length == 'number')) {
			if(item.forEach) {
				item.forEach(fn);
			}else{
				for(var i=0, l=item.length; i<l; i++) {
					fn(item[i], i, item);
				}
			}
		}else{
			for(var key in item) {
				if(proto || item.hasOwnProperty(key)) {
					fn(item[key], key, item);
				}
			}
		}
	},
	
	hasKey:function(keyName,haystack) {
		if(typeof haystack === '[object Array]') {
			for(var key in haystack) {
				if(key == keyName) {
					return haystack[key];
				}
			}
			return false;
		}
	},
	
	inArray:function(needle,haystack) {
	    var i = haystack.length;
	    while(i--) {
	       if (haystack[i] === needle) {
	           return true;
	       }
	    }
	    return false;
	}
});