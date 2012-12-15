/**
* Data validation / data checking 
* 
* @provides
* 	BBB.brains.validator
* 
* @requires
* 	BBB.scaffold
**/

BBB.extend('brains.validator',{
	
	/**
	 * Validates the structure of an email address.
	 **/
	validEmailAddress:function(email) {
		var atpos = email.indexOf("@");
		var dotpos = email.lastIndexOf(".");
		return (atpos<1 || dotpos<atpos+2 || dotpos+2>=email.length) ? false : true;
	}///--- validEmailAddress
	
});