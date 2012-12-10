WR.extend('effects',{
	speeds:{
		fast:700,
		slow:1000
	},
	
	translateSpeed:function(speed) {
		if(typeof speed == 'string') {
		
			for(var key in WR.effects.speeds) {
				if(key == speed) {
					return WR.effects.speeds[key];
				}
			}
			
			return false;
			
		}else{
			return speed;
		}
	}
});