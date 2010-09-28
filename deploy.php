#!/usr/bin/php
<?php
$ch = curl_init('http://closure-compiler.appspot.com/compile');
$params = http_build_query(array(
    'code_url'=>'http://proveit-js.googlecode.com/hg/ProveIt_Wikipedia.js',
    'compilation_level'=>'SIMPLE_OPTIMIZATIONS',
    'output_info'=>'compiled_code'
));
curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
$minified = curl_exec($ch);
$header = <<< EOF
// ProveIt Copyright 2010 Georgia Tech
// Available under the GNU Free Documentation License, Creative Commons Attribution/Share-Alike License 3.0, and the GNU General Public License 2
// This is a minified version.  Changes can be made through our Google Code Project (http://code.google.com/p/proveit-js/)

EOF;
echo "$header$minified";
?>