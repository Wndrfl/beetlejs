BBB.extend('effects',{
	speeds:{
		fast:700,
		slow:1000
	},
	
	translateSpeed:function(speed) {
		if(typeof speed == 'string') {
		
			for(var key in BBB.effects.speeds) {
				if(key == speed) {
					return BBB.effects.speeds[key];
				}
			}
			
			return false;
			
		}else{
			return speed;
		}
	}
});