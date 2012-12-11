<?php
header("content-type: application/x-javascript");

$js = array(
	
	// Scaffold
	'core/scaffold.js',
	'core/init.js',
	
	// Basic core
	'core/communicator.js',
	'core/content.js',
	'core/events.js',
	'core/qs.js',
	'core/util.js',
	'core/xd.js',
	
	// Brains
	'brains/validator.js',
	
	// UI core
	'ui/dialog.js',
	'ui/dialog.templates.js',
	'ui/forms/forms.js',
	'ui/forms/item.js',
	'ui/forms/item.inline.js',
	'ui/loadingMask.js',
	'ui/mask.js',
	
	// UI elements
	'ui/elements/elements.js',
	'ui/elements/element.js',
	
	// Common
	'common/array.js',
	'common/dom.js'
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