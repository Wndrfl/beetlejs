/**
* Provides methods for managing the follow status
* between users and businesses
* 
* jQuery
* 	true
* 
* @provides
* 	WR.brains.follows
* 
* @requires
* 	WR.scaffold
*/

WR.extend('brains.follows',{
	
	addFollower:function(bid,cb){
		this.toggleFollower(bid,'follow',cb);
	},///--- addFollower
	
	blockFollower:function(uid){
		$.post(
			"/ajax/follow/block/",
			{uid:uid},
			function(data) {
				if(data) {
					if(data.status == "1") {
						status = this.createStatusObject(0,data.count);
					}else{
						status = this.createStatusObject();
					}
				}
				
				if(cb) {
					cb(status);
				}
			},
			"json");
	},///--- blockFollower
	
	createStatusObject:function(state,count){
		if(!state) { state = null;}
		if(!count) { count = 0;}
		var obj = {
			followState:state,
			totalFollowers:count
		}
		return obj;
	},///--- createStatusObject
	
	removeFollower:function(bid,cb){
		this.toggleFollower(bid,'unfollow',cb);
	},///--- removeFollower
	
	toggleFollower:function(bid,action,cb){
		if(!action) { action = 'auto';}
		$.post(
			"/ajax/follow/toggle/",
			{
				bid:bid,
				action:action
			},
			function(data) {
				if(data) {
					
					// successful attempt to do something
					if(data.status == "1") {
						
						// new follow
						if(data.action == "1") { 
							
							var status = WR.brains.follows.createStatusObject(1,data.count);

							$.post(
								'/ajax/facebook/create_follow',
								{
									bid:bid
								},
								function(response) {},
								'json'
							);

						// unfollowed
						}else{
							var status = WR.brains.follows.createStatusObject(0,data.count);
						}

					// unsuccessful attempt
					}else{
						var status = WR.brains.follows.createStatusObject();
					}
				}
				
				if(cb) {
					cb(status);
				}
			}
			,"json"
		);
	}///--- toggleFollower
});