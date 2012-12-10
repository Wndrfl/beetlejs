/**
* Queues and fires custom events.
* 
* jQuery
* 	false
* 
* @provides
* 	BBB.events
* 
* @requires
* 	BBB.scaffold
* 	BBB.array
*/

BBB.extend('events',{
	
	clear:function(eventName) {
		var subscriptions = BBB.events.subscriptions()[eventName];
		
		if(subscriptions) {
			BBB.array.forEach(subscriptions,function(subscription,key){
				subscriptions[key] = null;
			});
		}
	},
	
	fire:function(eventName,params) {
		var subscriptions = BBB.events.subscriptions()[eventName];
		
		if(subscriptions) {
			BBB.array.forEach(subscriptions,function(cb){
				if(typeof cb == "function") {
					cb(params);
				}
			});
		}
	},
	
	subscriptions:function() {
		if(!BBB.events.subscribers) {
			BBB.events.subscribers = []
		}
		return BBB.events.subscribers;
	},
	
	subscribe:function(eventName,cb) {
		var subscriptions = BBB.events.subscriptions();
		
		if(!subscriptions[eventName]) {
			subscriptions[eventName] = [];
		}
		subscriptions[eventName].push(cb);
	},
	
	unsubscribe:function(eventName,cbToRemove) {
		var subscriptions = BBB.events.subscriptions()[eventName];
		
		if(subscriptions) {
			BBB.array.forEach(subscriptions,function(cb,key) {
				if(cb == cbToRemove) {
					subscriptions[key] = null;
				}
			});
		}
	}
});