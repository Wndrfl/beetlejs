/**
* Queues and fires custom events.
* 
* jQuery
* 	false
* 
* @provides
* 	WR.events
* 
* @requires
* 	WR.scaffold
* 	WR.array
*/

WR.extend('events',{
	
	clear:function(eventName) {
		var subscriptions = WR.events.subscriptions()[eventName];
		
		if(subscriptions) {
			WR.array.forEach(subscriptions,function(subscription,key){
				subscriptions[key] = null;
			});
		}
	},
	
	fire:function(eventName,params) {
		var subscriptions = WR.events.subscriptions()[eventName];
		
		if(subscriptions) {
			WR.array.forEach(subscriptions,function(cb){
				if(typeof cb == "function") {
					cb(params);
				}
			});
		}
	},
	
	subscriptions:function() {
		if(!WR.events.subscribers) {
			WR.events.subscribers = []
		}
		return WR.events.subscribers;
	},
	
	subscribe:function(eventName,cb) {
		var subscriptions = WR.events.subscriptions();
		
		if(!subscriptions[eventName]) {
			subscriptions[eventName] = [];
		}
		subscriptions[eventName].push(cb);
	},
	
	unsubscribe:function(eventName,cbToRemove) {
		var subscriptions = WR.events.subscriptions()[eventName];
		
		if(subscriptions) {
			WR.array.forEach(subscriptions,function(cb,key) {
				if(cb == cbToRemove) {
					subscriptions[key] = null;
				}
			});
		}
	}
});