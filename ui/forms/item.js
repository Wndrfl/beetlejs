/**
* Parent class for all form items
* 
* @jQuery
* 	true
* 
* @provides
* 	WR.ui.forms.item
* 
* @requires
* 	WR.scaffold
* 	WR.dom
* 	WR.brains.validator
* 	WR.util
*/

WR.Class('ui.forms.item',

function(dom) {
	var dom = this.dom = dom;
	
	if(label = WR.dom.getElementsByTagName('label',dom)) { 
		this.label = label[0];
	}
	if(input = WR.dom.getElementsByTagName('input,textarea',dom)) { 
		this.input = input[0];
		this.inputLength = this.getInputLength();
		this.bindInteractions();
		this.input.setAttribute("autocomplete","off");
	}
},

{
	inputLength:0,
	interactionTimer:null,
	interactionTiming:1000,
	maxlength:0,
		
	analyzeMaxLength:function(event) {
		if(this.willBeEmpty(event)) {
			this.hideMaxLength();
		}else{
			this.showMaxLength();
			this.updateMaxLength();
		}	
	},//////------ analyzeMaxLength
		
	bindInteractions:function() {
		var item = this;
		if(custom_url = this.dom.getAttribute('data-valid-custom-url')) {
			$(this.input).keypress(function() {
				item.validCustomUrl();
			});
		}
		
		if(maxlength = this.dom.getAttribute('data-maxlength')) {
			this.maxlength = maxlength;
			$(this.input).keypress(function(e) {
				item.analyzeMaxLength(e);
			});
		}

		if(valid_email = this.dom.getAttribute('data-valid-email')) {
			$(this.input).keypress(function() {
				item.validEmail();
			});
		}
		
	},//////------ bindInteractions
		
	clearInteractionTimer:function() {
		clearTimeout(this.interactionTimer);
	},//////------ clearInteractionTimer
		
	getInputLength:function() {
		if(this.input) {
			return this.input.value.length;
		}
		return 0;
	},//////------ getInputLength
		
	hideError:function() {
		var dom = $(this.dom);
		dom.children('.inline_error').hide();
	},//////------ hideInlineError
		
	hideLoading:function() {
		var dom = $(this.dom);
		dom.children('.inline_loading').hide();
	},//////------ hideLoading
		
	hideMaxLength:function() {
		if(!this.maxlength || this.maxlength == undefined) {
			return;
		}
		var dom = $(this.dom);
		dom.children(".counter").hide();
		dom.removeClass("maxlength");

	},//////------ hideMaxLength

	hideMessage:function() {
		this.hideError();
		this.hideLoading();
		this.hideSuccess();
	},//////------ hideMessage

	hideSuccess:function() {
		var dom = $(this.dom);
		dom.children('.inline_success').hide();
	},//////------ hideInlineSuccess
		
	setInteractionTimer:function(cb) {
		this.interactionTimer = setTimeout(cb,this.interactionTiming);
	},//////------ setInteractionTimer
		
	showError:function(msg) {
		
		var dom = $(this.dom);
		
		this.hideLoading();
		this.hideSuccess();

		if(dom.children(".inline_error").length == 0) {
			dom.append("<div class='inline_error'><div class='message'></div></div>");
		}
		
		dom.children('.inline_error').children('.message').html(msg);
		dom.children('.inline_error').fadeIn("fast");	
		
	},//////------ showError
		
	showLoading:function(msg) {
		
		var dom = $(this.dom);
		
		this.hideError();
		this.hideSuccess();

		if(dom.children('.inline_loading').length == 0) {
			dom.append("<div class='inline_loading'><div class='message'></div></div>");
		}

		dom.children('.inline_loading').children('.message').html(msg);
		dom.children('.inline_loading').fadeIn('fast');
		
	},//////------ showLoading
		
	showMaxLength:function() {
		if(!this.maxlength || this.maxlength == undefined) {
			return;
		}

		if($(this.dom).children('.counter').length == 0) {
			$(this.dom).append("<div class='counter'><div class='number'></div></div>").addClass("maxlength");
		}

	},//////------ showMaxLength

	showSuccess:function(msg) {

		var dom = $(this.dom);
		
		this.hideError();
		this.hideLoading();

		if(dom.children('.inline_success').length == 0) {
			dom.append("<div class='inline_success'><div class='message'></div></div>");
		}

		dom.children('.inline_success').children('.message').html(msg);
		dom.children('.inline_success').fadeIn('fast');
		
	},//////------ showSuccess
		
	updateMaxLength:function() {
		if(!this.maxlength || this.maxlength == undefined) {
			return;
		}
		
		var dom = $(this.dom);
		
		update = dom.children('.counter');
		
		intCount = this.getInputLength();
        update.children('.number').text(parseInt(this.maxlength) - parseInt(intCount));
		if(update.is(':hidden')) { 
			update.fadeIn("fast");
		}
        if (intCount < (this.maxlength * .8)) { update.removeClass('warning').removeClass('danger'); } //Good
        if (intCount > (this.maxlength * .8)) { update.removeClass('danger').addClass('warning'); } //Warning at 80%
        if (intCount > (this.maxlength)) { update.removeClass('warning').addClass('danger'); } //Over

	},//////------ updateMaxLength
		
	validCustomUrl:function() {
		
		var item = this;
		
		this.clearInteractionTimer();
		this.showLoading("Checking url...");

		this.setInteractionTimer(function() {
			if(!WR.brains.validator.validCustomUrl(item.input.value)) {
				item.showError("Please only use letters or numbers here...");
			}else{
				WR.brains.validator.urlIsAvailable(item.input.value,function(status,msg) {
					if(!status) {	
						item.showError("Drats! This url is already in use.");
					}else{
						item.showSuccess("This url looks good!");
					}
				});
			}
		});
	},//////------ validCustomUrl
		
	validEmail:function() {
		var item = this;
		this.clearInteractionTimer();
		this.showLoading("Checking email...");
		this.setInteractionTimer(function() {
			if(item.getInputLength() === 0) {
				item.showError("Whoops! Don't forget your email...");
			}else if(!WR.brains.validator.validEmailAddress(item.input.value)) {
				item.showError("Hmm, this email doesn't look valid...");
			}else{
				WR.brains.validator.emailIsAvailable(item.input.value,function(status,msg) {
					if(!status) {	
						item.showError("Drats! This email is already in use. <a href='/signin'>You can sign in here.</a>");
					}else{
						item.showSuccess("This email looks good!");
					}
				});
			}
		});
	},//////------ validEmail
		
	willBeEmpty:function(event) {
		keyCode = WR.util.keyboard.getKeycode(event);
		if((keyCode == 8 || keyCode == 46) && this.getInputLength() == 1) {
			return true;
		}
		return false;
	}//////------ willBeEmpty
});