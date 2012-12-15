/**
* Queues and fires custom events.
* 
* @provides
* 	BBB.events
* 
* @requires
* 	BBB.scaffold
* 	BBB.array
**/

BBB.extend('events',{
	
	/**
	 * Clears ALL event listeners.
	 **/
	clear:function(eventName) {
		var subscriptions = BBB.events.subscriptions()[eventName];
		
		if(subscriptions) {
			BBB.array.forEach(subscriptions,function(subscription,key){
				subscriptions[key] = null;
			});
		}
	},
	
	/**
	 * Fires an event and passes each listener the
	 * supplied params.
	 **/
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
	
	/**
	 * Returns a list of all subscriptions for
	 * all events.
	 **/
	subscriptions:function() {
		if(!BBB.events.subscribers) {
			BBB.events.subscribers = []
		}
		return BBB.events.subscribers;
	},
	
	/**
	 * Subscribes a callback to an event.
	 * 
	 * This callback will be called when the event
	 * is fired.
	 **/
	subscribe:function(eventName,cb) {
		var subscriptions = BBB.events.subscriptions();
		
		if(!subscriptions[eventName]) {
			subscriptions[eventName] = [];
		}
		subscriptions[eventName].push(cb);
	},
	
	/**
	 * Unsubscribes a callback from an event.
	 * 
	 * The cbToRemove argument must be exactly the same
	 * as the callback to remove.
	 **/
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