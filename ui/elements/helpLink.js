/**
* Help bubble
* 
* jQuery
* 	true
* 
* @provides
* 	WR.ui.helpBar
* 
* @requires
* 	WR.scaffold
* 	WR.ui.element
*/

WR.subclass('ui.element','ui.helpLink',null,
{
	_attr:{
		articleId:0,
		articleText:null
	},
	
	_requestPending:false,
	
	_tooltip:null,
	
	setupAndValidate:function() {
		if(dom = this.dom) {
			
			var helpLink = this;
			
			var attr = {
				articleId:this.getAttribute('data-help-article')
			}
			
			if(typeof attr.articleId == 'undefined') {
				return false;
			}
			
			this._attr = attr;
			
			this.dom.onclick = function(event) {
				event.preventDefault();
				if(helpLink._tooltip == null) {
					helpLink.showTooltip();
				}else{
					helpLink.hideTooltip();
				}
			}
			
			return true;
		}
		return false;
	},
	
	hideTooltip:function() {
		if(this._tooltip !== null) {
			$(this._tooltip).remove();
			this._tooltip = null;
		}
	},
	
	loadTooltip:function() {
		
		if(this._attr.articleText == null) {
			var helpLink = this;
			
			this._requestPending = true;
			
			$.post('/ajax/help/article',
			{
				article:helpLink._attr.articleId
			},
			function(response) {
				if(!response || response == null) {
					helpLink.setTooltipText('Sorry, we can\'t find this help article. Our nerds will be punished.');
				}
				
				var html = '';
				
				if(response && typeof response.title != 'undefined') {
					html += '<div class="help_link_tooltip_title">'+response.title+'</div>';
				}
				if(response && typeof response.body != 'undefined') {
					html += '<div class="help_link_tooltip_body">'+response.body+'</div>';
				}
				
				helpLink._requestPending = false;
				
				helpLink.setTooltipText(html);
				
				return html;
			},
			'json');
		}else{
			this.setTooltipText();	
		}
	},
	
	setTooltipText:function(text) {
		var tooltipText = (text) ? text : this._attr.articleText;
		this._attr.articleText = tooltipText;
		
		if(this._tooltip == null) {
			this.showTooltip();
		}else{
			this._tooltip.innerHTML = tooltipText;
		}
	},
	
	showTooltip:function() {
		if(this._requestPending == true) {
			return;
		}
		
		if(this._tooltip == null) {
			var link = $(this.dom);
			var tooltipId = "help_link_tooltip_"+this._attr.articleId;
		
			var tooltip = document.createElement('div');
			tooltip.id = tooltipId;
			tooltip.className = 'help_link_tooltip';
		
			link.append(tooltip);
		
			this._tooltip = tooltip;
		}
		
		this.loadTooltip();
	}	
});