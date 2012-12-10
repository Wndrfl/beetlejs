/**
* Parent class for all form dropdowns
* 
* @jQuery
* 	true
* 
* @provides
* 	BBB.ui.forms.dropdown
* 
* @requires
* 	BBB.scaffold
* 	BBB.dom
*/

BBB.Class('ui.forms.dropdown',

function(dom) {
	var dom = this.dom = dom;
	
	if(displayBox = BBB.dom.getElementsByClassName('displayBox',null,this.dom)) { 
		this.displayBox = displayBox[0];
	}
	if(dropdown = BBB.dom.getElementsByClassName('dropdown',null,this.dom)) { 
		this.dropdown = dropdown[0];
		$(this.dropdown).hide();
	}
	if(valueHolder = BBB.dom.getElementsByClassName('valueHolder',null,this.dom)) { 
		this.valueHolder = valueHolder[0];
	}
},

{
	setup:function() {
		var self = this;
		if(dom = this.dom) {
			$(this.dom).click(function(e) {
				e.preventDefault();
				if(self.isOpen()) {
					self.closeDropdown();
				}else{
					self.openDropdown();
				}
			});
		
			$(this.dropdown).find('li').each(function(i,v) {
				$(v).click(function(e) {
					e.preventDefault();
					self.changeValue($(this).text(),$(this).attr('data-value'));
				});
			});
		}
	},
	
	changeValue:function(label,value) {
		$(this.displayBox).text(label);
		$(this.valueHolder).val(value);
	},
	
	closeDropdown:function() {
		$(this.dom).removeClass('active');
		$(this.dropdown).hide();
	},
	
	isOpen:function() {
		return ($(this.dom).hasClass('active')) ? true : false;
	},
	
	openDropdown:function() {
		var self = this;
		BBB.ui.forms.closeDropdowns(function() {
			$(self.dom).addClass('active');
			$(self.dropdown).show();
		});
	}
});