/**
* User actions dropdown element
* 
* jQuery
* 	true
* 
* @provides
* 	WR.ui.userActions
* 
* @requires
* 	WR.scaffold
* 	WR.ui.element
* 	WR.brains.auth
* 	WR.ui.dialog
* 	WR.brains.follows
* 
*/

WR.subclass('ui.element','ui.userActions',null,
{
	_attr:{},
	
	setupAndValidate:function() {
		if(dom = this.dom) {
			var attr = {
				uid:this.getAttribute('data-user')
			}
		
			this._attr = attr;
			
			// set up drop down
			$(dom).find(".toggle_dropdown").click( function(e) {
				e.preventDefault();
				if($(this).hasClass("selected")) {
					this.dropMenu();
				}else{
					this.rollUpMenu();
				}
			});
			
			// set up block link
			$(dom).find("a.block-user").click(function(event) {
				WR.brains.auth.checkAuthStatus(function(response) { 
					if(response && response.id) {
						this.block();
					}else{
						WR.ui.dialog.templates.auth(function() { 
							WR.ui.dialog.close();
							this.block();
						});
					}
				});
			});
			
			return true;
		}
		
		return false;
	},
	
	block:function() {
		WR.brains.follows.blockFollower(button.uid, function(response) {
			if(response) {
				// acknowledge block somehow
				alert("This user is now blocked from following you.");
			}
		});
	},

	dropMenu:function() {
		$(this.dom).children(".toggle_dropdown").removeClass("selected");
		$(this.dom).children(".options").hide();
	},

	rollUpMenu:function() {
		$(this.dom).children(".toggle_dropdown").addClass("selected");
		$(this.dom).children(".options").show();
	}
});