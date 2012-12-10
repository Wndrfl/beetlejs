/**
* Manager for all plugins
* 
* jQuery
* 	false
* 
* @provides
* 	WR.plugins
* 
* @requires
* 	WR.scaffold
* 	WR.array
* 	WR.dom
* 	WR.events
* 	WR.xd
* 	WR.util
* 	WR.qs
*/

WR.extend('plugins',{
	
	init:function() {
		
		// blind redirect
		WR.xd.exposeFunction('redirect',function(opts) {
			if(!opts || typeof opts.redirect == 'undefined') {
				return;
			}
			WR.util.redirect(opts.redirect);
		});
		
		// go to sign in and redirect back here
		WR.xd.exposeFunction('signIn',function(opts) {
			var params = {
				error:(typeof opts.error !== 'undefined') ? opts.error : null,
				ret:(typeof opts.ret !== 'undefined') ? opts.ret : WR.util.currentUrl()
			}
			var signin = WR.domains.www + 'signin?' + WR.qs.encode(params);
			WR.util.redirect(signin);
		});
		
		// go to sign out and redirect back here
		WR.xd.exposeFunction('signOut',function(opts) {
			var params = {
				error:(typeof opts.error !== 'undefined') ? opts.error : null,
				ret:(typeof opts.ret !== 'undefined') ? opts.ret : WR.util.currentUrl(),
			}
			var signin = WR.domains.www + 'signOut?' + WR.qs.encode(params);
			WR.util.redirect(signin);
		});
		
		WR.plugins.parse();
	},

	parse:function() {
		WR.array.forEach(WR.plugins.pluginTypes,function(type) {

			var els = WR.dom.getElementsByClassName(type.publicName);
			var obj = WR.create(type.className);

			for(i=0;i<els.length;i++) {
				var element = new obj(els[i]);

				element.setup();
			}
		});
	},
	
	pluginTypes:[
		{publicName:'wr-dealbox',className:'plugins.dealbox'}
	]
});