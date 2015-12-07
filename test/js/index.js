require('./../../src');

var app = window.app = new ___();

app.entity('button',{
	el:null,

	initialize: function(el) {
		var self = this;
		el.onclick = function() {
			self.doAlert();
		}
	},

	doAlert:function() {
		alert('ALERT!');
	}
});