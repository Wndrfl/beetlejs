/**
* Header auth links element
* 
* jQuery
* 	true
* 
* @provides
* 	WR.ui.authLinks
* 
* @requires
* 	WR.scaffold
* 	WR.ui.element
*/

WR.subclass('ui.element','ui.authLinks',null,
{
	_attr:{},
	
	setupAndValidate:function() {
		if(dom = this.dom) {
			$(dom).click(function() {
				if($(this).children(".tools_dropdown").is(":hidden")) {
					$(this).addClass("selected").children(".tools_dropdown").show();
				}else{
					$(this).removeClass("selected").children(".tools_dropdown").hide();
				}
			});
			
			return true;
		}
		
		return false;
	}
});