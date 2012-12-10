WR.extend('effects.fade',{
	
	tweenGrains:.05,
	
	fadeIn:function(dom,time,cb) {
		time = WR.effects.translateSpeed(time);
		var currentOpacity = WR.effects.fade.getCurrentOpacity(dom);
		var speed = WR.effects.fade.tweenSpeed(0,currentOpacity,time);
		dom.timer = setTimeout(function() {
			WR.effects.fade.tween(dom,currentOpacity,100,dom.timer,speed,cb);
		},0);
	},
	
	fadeOut:function(dom,time,cb) {
		time = WR.effects.translateSpeed(time);
		var currentOpacity = WR.effects.fade.getCurrentOpacity(dom);
		var speed = WR.effects.fade.tweenSpeed(0,currentOpacity,time);
		dom.timer = setTimeout(function() {
			WR.effects.fade.tween(dom,currentOpacity,0,dom.timer,speed,cb);
		},0);
	},
	
	getCurrentOpacity:function(dom) {
		var defaultOpacity = (WR.dom.isVisible(dom)) ? 100 : 0;
		return dom.style.opacity ? parseFloat(dom.style.opacity) * 100 : defaultOpacity;
	},
	
	tween:function(dom,alpha,target,timer,speed,cb) {
		if(alpha == target){
               clearInterval(timer);
			if(cb) {
				cb();
			}
           }else{
			var flag = (alpha < target) ? 1 : -1;
               var value = Math.round(alpha + ((target - alpha) * WR.effects.fade.tweenGrains)) + (1 * flag);
               dom.style.opacity = value / 100;
               dom.style.filter = 'alpha(opacity=' + value + ')';
               alpha = value;

			if(value != target) {
				timer = setTimeout(function() {
					WR.effects.fade.tween(dom,alpha,target,timer,speed,cb);
				},speed);
			}
           }
	},
	
	tweenSpeed:function(target,alpha,time) {
		var flag = (alpha < target) ? 1 : -1;
		var distance = (target - alpha) * flag;
		var speed = time / distance;
		return speed;
	}
	
});