/**
* Provides basic/generic content templates.
* 
* jQuery
* 	false
* 
* @provides
* 	BBB.content
* 
* @requires
* 	BBB.scaffold
*/

BBB.extend('content',{
	
	append:function(parent,content) {
		if(typeof content === "string") {
			var div = document.createElement('div');
			div.innerHTML = content;
			return parent.appendChild(div);
		}else{
			return parent.appendChild(content);
		}
	},
	
	insertIframe:function(parent,params) {
		if(!parent) {
			BBB.log('No parent was provided for the iframe.');
		}
		
		// if ie
		if(window.attachEvent) {
			var i = "<iframe src='" + params.src + "'" + 
					" id='" + params.id + "'" +
					" width='" + params.width + "'" +
					" height='" + params.height + "'" +
					(params.className ? " class='" + params.className + "'" : "") +
					" style='border:0;overflow:hidden;" + 
						(params.width ? "width:" + params.width + "px;" : "") +
						(params.height ? "height:" + params.height + "px;" : "") +
					"'" + 
					" scrolling='no'" +
					" frameborder='0'" +
					" allowtransparency='true'></iframe>";
	
			BBB.content.append(parent,i);
		
		// non ie	
		}else{
			
			i = document.createElement('iframe');
			i.id = params.id;
			if(params.className) {
				i.className = params.className;
			}
			if(params.height) {
				i.style.height = params.height+"px";
			}
			if(params.width) {
				i.style.width = params.width+"px";
			}
			
			i.scrolling = "no";
			i.frameBorder = 0;
			i.style.background = "transparent";
			i.style.border = "0";
			i.style.overflow = "hidden";

			BBB.content.append(parent,i);
			
			i.setAttribute("src",params.src);
		}
	}
});