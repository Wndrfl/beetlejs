<?php
header("content-type: application/x-javascript");

$js = array(
	
	// Scaffold - this must be first
	'js/core/scaffold.js',
	
	// Basic core
	'js/core/array.js',
	'js/core/communicator.js',
	'js/core/content.js',
	'js/core/dom.js',
	'js/core/events.js',
	'js/core/init.js',
	'js/core/qs.js',
	'js/core/util.js',
	
	// Brains
	'js/brains/validator.js',
	
	// UI elements
	'js/ui/elements/elements.js',
	'js/ui/elements/element.js',
	'js/ui/elements/alertButton.js'
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