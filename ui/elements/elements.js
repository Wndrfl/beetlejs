/**
* Manager for all UI elements
* 
* jQuery
* 	false
* 
* @provides
* 	WR.ui.elements
* 
* @requires
* 	WR.scaffold
* 	WR.array
*/

WR.extend('ui.elements',{

	parse:function() {
		WR.array.forEach(WR.ui.elements.elementTypes,function(type) {
			var els = WR.dom.getElementsByClassName(type.publicName);
			var obj = WR.create(type.className);

			for(i=0;i<els.length;i++) {
				var element = new obj(els[i]);
				element.setup();
			}
		});
	},
	
	elementTypes:[
		{publicName:'auth_links_tools',className:'ui.authLinks'},
		{publicName:'feedback_tab',className:'ui.feedbackTab'},
		{publicName:'follow_button_active',className:'ui.followButton'},
		{publicName:'help_link',className:'ui.helpLink'},
		{publicName:'user_actions',className:'ui.userActions'}
	]
});