/**
* Follow button element
* 
* jQuery
* 	true
* 
* @provides
* 	WR.ui.followButton
* 
* @requires
* 	WR.scaffold
* 	WR.ui.element
* 	WR.brains.auth
* 	WR.ui.dialog
* 	WR.util
* 	WR.brains.follows
*/

WR.subclass('ui.element','ui.followButton',null,
{
	_attr:{},

	setupAndValidate:function() {
		if(dom = this.dom) {
			
			var button = this;
			
			var attr = {
				actionCommand:this.getAttribute('data-action'),
				bid:this.getAttribute('data-business'),
				redirectTo:this.getAttribute('data-redirect'),
				ref:this.getAttribute('data-ref')
			}
			
			this._attr = attr;
			
			$(dom).click(function(event) {
				event.preventDefault();
				WR.brains.auth.checkAuthStatus(function(response) { 

					// signed in
					if(response && response.id) {
						button.toggle(function() {
							button.redirect();
						});

					// not signed in
					}else{
						WR.ui.dialog.templates.auth({ret:button._attr.redirectTo, follow:button._attr.bid},function(response) {
							if(response.id && response.id != 0) { 
								WR.ui.dialog.close();
								button.toggle(function() {
									if(response.redirect) {
										WR.util.redirect(response.redirect);
									}else{
										button.redirect();
									}
								});
							}else{
								if(response.redirect) {
									WR.util.redirect(response.redirect);
								}
							}
						});
					}
				});
			});
			
			return true;
		}
		
		return false;
	},
	
	recordAction: function(state) {
		if(state == 1) {
			_kmq.push(['record', 'Followed Business', { 'business_id' : this._attr.bid, 'ref' : this._attr.ref}]);
		}else{
			_kmq.push(['record', 'Unfollowed Business', { 'business_id' : this._attr.bid, 'ref' : this._attr.ref}]);
		}
	},
		
	redirect:function() {
		if(this._attr.redirectTo) {
			WR.util.redirect(this._attr.redirectTo);
		}
	},

	setState:function(state,count) {
		if(state == 1) {
			$(this.dom)
				.removeClass("normal")
				.addClass("selected")
				.children("strong")
				.text("Following");

			if(count > 0) {
				var counter = $(this.dom).parent().children(".counter");
				if(!$(counter).is(":visible")) {
					$(counter).fadeIn("slow");
				}
				$(counter).text(count);
			}

		}else{

			$(this.dom)
				.removeClass("selected")
				.addClass("normal")
				.children("strong")
				.text("Follow our Deals");

			var counter = $(this.dom).siblings(".counter");
			if(count == 0) {
				if($(counter).is(":visible")) {
					$(counter).fadeOut("slow");
				}
			}else{
				$(counter).text(count);	
			}

		}
	},

	toggle:function(cb) {
		var button = this;
		WR.brains.follows.toggleFollower(this._attr.bid,this._attr.actionCommand,function(response) {
			if(response) {
				button.setState(response.followState,response.totalFollowers);
				button.recordAction(response.followState);
			}
			
			if(cb) {
				cb(response);
			}
		});
	}
});