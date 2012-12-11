<?php
header("content-type: application/x-javascript");

$js = array(
	
	// Scaffold
	'js/core/scaffold.js',
	'js/core/init.js',
	
	// Basic core
	'js/core/communicator.js',
	'js/core/content.js',
	'js/core/events.js',
	'js/core/qs.js',
	'js/core/util.js',
	'js/core/xd.js',
	
	// Brains
	'js/brains/validator.js',
	
	// UI core
	'js/ui/dialog.js',
	'js/ui/dialog.templates.js',
	'js/ui/forms/forms.js',
	'js/ui/forms/item.js',
	'js/ui/forms/item.inline.js',
	'js/ui/loadingMask.js',
	'js/ui/mask.js',
	
	// UI elements
	'js/ui/elements/elements.js',
	'js/ui/elements/element.js',
	
	// Common
	'js/common/array.js',
	'js/common/dom.js'
);
	
// all together now
ob_start();
if(is_array($js)) {
	foreach ($js as $file) {
		include $file;
	}
}else{
	include $js;
}

$scripts = @ob_get_contents();
@ob_end_clean();

// hit play
$scripts .= 'BBB.init();';

// spit it out
echo $scripts;