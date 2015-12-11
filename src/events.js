module.exports = {
	
	/**
	 * Clears ALL event listeners.
	 **/
	clear:function(eventName) {
		var subscriptions = ___.prototype.events.subscriptions()[eventName];
		
		if(subscriptions) {
			for(var key in subscriptions) {
				subscriptions[key] = null;
			}
		}
	},
	
	/**
	 * Fires an event and passes each listener the
	 * supplied params.
	 **/
	fire:function(eventName,params) {

		___.prototype.log("EVENT FIRED: "+eventName);

		var subscriptions = ___.prototype.events.subscriptions()[eventName];
		if(subscriptions) {
			for(var key in subscriptions) {
				var cb = subscriptions[key];
				if(typeof cb == "function") {
					cb(params);
				}
			}
		}
	},

	once:function(eventName,cb) {
		var onceCb = function(params) {
			___.prototype.events.unsubscribe(eventName,cb);
			cb(params);
		}
		this.subscribe(eventName,onceCb);
	},
	
	/**
	 * Returns a list of all subscriptions for
	 * all events.
	 **/
	subscriptions:function() {
		if(!___.prototype.events.subscribers) {
			___.prototype.events.subscribers = []
		}
		return ___.prototype.events.subscribers;
	},
	
	/**
	 * Subscribes a callback to an event.
	 * 
	 * This callback will be called when the event
	 * is fired.
	 **/
	subscribe:function(eventName,cb) {
		var subscriptions = ___.prototype.events.subscriptions();
		
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
		var subscriptions = ___.prototype.events.subscriptions()[eventName];
		
		if(subscriptions) {
			for(var key in subscriptions) {
				var cb = subscriptions[key];
				if(cb == cbToRemove) {
					subscriptions[key] = null;
				}
			}
		}
	}
};