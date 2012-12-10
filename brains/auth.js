/**
* Provides methods for accessing and managing
* an individual user's auth status with WalletRocket.
* 
* jQuery
* 	true
* 
* @provides
* 	WR.brains.auth
* 
* @requires
* 	WR.scaffold
*/

WR.extend('brains.auth',{
	
	account:{},
	requestSent:false,

	checkAuthStatus:function(cb){
		if(this.requestSent) {
			if(cb) {
				cb(this.account);
			}
			return;
		}

		$.post(
			"/ajax/auth/check_status",
			{},
			function(response) {
				if(response && response.id) {

					this.account = response;

				}else{
					this.account = {};
				}

				this.requestSent = true;

				if(cb) {
					cb(this.account);
				}
			},
			"json");
	},///--- checkAuthStatus
	
	resendConfirmationEmail:function(cb){
		this.checkAuthStatus(function(account) {
			var confirmationSent = false;
			if(account) {
				$.post(
					"/ajax/auth/resend_confirmation_email",
					{aid:account.id},
					function(response) {
						if(cb) {
							cb(response.status,response.message);
						}
					},
					"json");

			}else{
				if(cb) {
					cb(0,"User is not signed in.");
				}
			}
		});
	},///--- resendConfirmationEmail

	signIn:function(){},///--- signIn
	
	signOut:function(){}///--- signOut
   });