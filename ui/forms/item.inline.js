/**
* Specialized inline form item handling
* 
* jQuery
* 	true
* 
* @provides
* 	BBB.ui.forms.item.inline
* 
* @requires
* 	BBB.scaffold
* 	BBB.ui.forms.item
* 	BBB.dom
*/

BBB.subclass('ui.forms.item','ui.forms.item.inline',null,
{
	analyzeKeyup:function() {
		if(this.getInputLength() === 0) {
			if(!this.labelIsVisible()) {
				this.showLabel();
			}
		}else{
			if(this.labelIsVisible()) {
				this.hideLabel();
			}
		}
	},//////------ analyzeKeyup
	
	analyzeKeydown:function(event) {
		if(this.willBeEmpty(event)) {
			this.showLabel();
		}else{
			this.hideLabel();
		}
	},//////------ analyzeKeydown
	
	arm:function() {
		if(this.label) {
			BBB.dom.addClass(this.label,'armed');
		}
		this.input.focus();
	},//////------ arm
	
	disarm:function() {
		if(this.label) {
			BBB.dom.removeClass(this.label,'armed');
		}
	},//////------ disarm
	
	hideLabel:function() {
		if(this.labelIsVisible()) {
			BBB.dom.hide(this.label);
		}
	},//////------ hideLabel
	
	labelIsVisible:function() {
		if(this.label && BBB.dom.isVisible(this.label)) {
			return true;
		}
		return false;
	},//////------ labelIsVisible
	
	setup:function() {
		var item = this;
		$(item.label).click(function() {
			item.arm();
		});
		if(item.getInputLength() != 0) {
			item.hideLabel();
		}
		
		$(item.input).click(function() {
			item.arm();
		}).keydown(function(event){
			item.analyzeKeydown(event);
		}).keyup(function() {
			item.analyzeKeyup();
		});
		$(item.input).blur(function() {
			item.disarm();
		});
	},
	
	showLabel:function() {
		if(!this.labelIsVisible()) {
			$(this.label).fadeIn('fast');
		}
	}//////------ showLabel
	
});