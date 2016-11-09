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
	fire:function(eventName,params,emittedByEl) {

		___.prototype.log("EVENT FIRED: "+eventName);

		var subscriptions = ___.prototype.events.subscriptions()[eventName];
		if(subscriptions) {
			for(var key in subscriptions) {
				var cb = subscriptions[key].cb;
				var listenedToEl = subscriptions[key].el;
				if(typeof cb == "function") {
					console.log(listenedToEl);
					console.log(emittedByEl);
					console.log(listenedToEl === emittedByEl);
					if(!listenedToEl || emittedByEl === listenedToEl) {
						cb(params);
					}
				}
			}
		}
	},

	once:function(eventName,cb,listenToEl) {
		var onceCb = function(params) {
			___.prototype.events.unsubscribe(eventName,cb,listenToEl);
			cb(params);
		}
		this.subscribe(eventName,onceCb,listenToEl);
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
	subscribe:function(eventName,cb,listenToEl) {
		var subscriptions = ___.prototype.events.subscriptions();
		
		if(!subscriptions[eventName]) {
			subscriptions[eventName] = [];
		}
		subscriptions[eventName].push({
			el: listenToEl,
			cb: cb
		});
	},
	
	/**
	 * Unsubscribes a callback from an event.
	 * 
	 * The cbToRemove argument must be exactly the same
	 * as the callback to remove.
	 **/
	unsubscribe:function(eventName,cbToRemove,listenToEl) {
		var subscriptions = ___.prototype.events.subscriptions()[eventName];
		
		if(subscriptions) {
			for(var key in subscriptions) {
				var cb = subscriptions[key].cb;
				var listenedToEl = subscriptions[key].el;
				if(cb == cbToRemove) {
					if(!listenedToEl || listenedToEl === listenToEl) {
						subscriptions[key] = null;
					}
				}
			}
		}
	}
};