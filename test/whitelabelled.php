<?php
if(isset($_GET['namespace'])) {
	header('Content-Type: application/javascript');
	$namespace = stripslashes($_GET['namespace']);
	$file = fopen('../src/beetlejuice.min.js', 'r+');
	while(!feof($file)) {
		$line = fgets($file);
		echo preg_replace('/BBB/', $namespace, $line);
	}
	fclose($file);
	exit;
}
?>