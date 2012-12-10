/**
* Feedback tab element
* 
* jQuery
* 	false
* 
* @provides
* 	WR.ui.feedbackTab
* 
* @requires
* 	WR.scaffold
* 	WR.ui.element
* 	WR.ui.dialog
*/

WR.subclass('ui.element','ui.feedbackTab',null,
{
	_attr:{},
	
	setupAndValidate:function() {
		if(dom = this.dom) {
			
			$(dom).click(function(e) {
				e.preventDefault();
				WR.ui.dialog.open('iframe','/ui/feedback',500,500);
			});
			
			return true;
		}
		
		return false;
	}
});