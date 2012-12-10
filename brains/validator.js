/**
* Data validation / data checking 
* 
* jQuery
* 	true
* 
* @provides
* 	WR.brains.validator
* 
* @requires
* 	WR.scaffold
* 	
*/

WR.extend('brains.validator',{
	
	emailIsAvailable:function(email,cb){
		$.post(
			"/ajax/validation/email_available",
			{email:email},
			function(response) {
				if(response && response.status == 1) {
					var status = true;
				}else{
					var status = false;
				}
				if(cb) {
					cb(status);
				}
			},
			"json");
			
	},///--- emailIsAvailable
	
	urlIsAvailable:function(url,cb) {
		$.post(
			"/ajax/validation/url_available",
			{url:url},
			function(response) {
				if(response && response.status == 1) {
					var status = true;
				}else{
					var status = false;
				}
				if(cb) {
					cb(status);
				}
			},
			"json");
	},///--- urlIsAvailable
	
	validCustomUrl:function(url) {
		var invalid_chars = url.search(/[^A-Za-z0-9]/);
		return (invalid_chars !== -1) ? false : true;
	},///--- validCustomUrl
	
	validEmailAddress:function(email) {
		var atpos = email.indexOf("@");
		var dotpos = email.lastIndexOf(".");
		return (atpos<1 || dotpos<atpos+2 || dotpos+2>=email.length) ? false : true;
	}///--- validEmailAddress
	
});