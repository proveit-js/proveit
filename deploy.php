#!/usr/bin/php
<?php
$error = fopen('php://stderr', 'wb');
$configuration = json_decode(file_get_contents('./deploy_configuration.json'));
if(!(isset($configuration->username) && isset($configuration->password) && isset($configuration->page)))
{
    fwrite($error, 'You must provide a JSON file deploy_configuaration.json in the current working directory with username, password, and page fields set.');
    exit(1);
}
define('USER_AGENT', 'ProveIt deploy script (http://code.google.com/p/proveit-js/)');
$closure_ch = curl_init('http://closure-compiler.appspot.com/compile');
$params = http_build_query(array(
    'code_url' => 'http://proveit-js.googlecode.com/hg/ProveIt_Wikipedia.js',
    'compilation_level' => 'SIMPLE_OPTIMIZATIONS',
    'output_info' => 'compiled_code'
));
curl_setopt($closure_ch, CURLOPT_POSTFIELDS, $params);
curl_setopt($closure_ch, CURLOPT_RETURNTRANSFER, TRUE);
curl_setopt($closure_ch, CURLOPT_USERAGENT, USER_AGENT);
$minified = curl_exec($closure_ch);
$header = <<< EOF
/* ProveIt Copyright 2010, Georgia Tech
   Available under the GNU Free Documentation License, Creative Commons Attribution/Share-Alike License 3.0, and the GNU General Public License 2
   This is a minified version.  Changes can be made through our Google Code Project (http://code.google.com/p/proveit-js/) */

EOF;
$full_code = $header .$minified;
$deploy_cookies = tempnam("/tmp", "deploy_cookie");

$login_ch = curl_init('http://en.wikipedia.org/w/api.php');
$login_data = array(
    'action' => 'login',
    'lgname' => $configuration->username,
    'lgpassword' => $configuration->password,
    'format' => 'json'
);
curl_setopt($login_ch, CURLOPT_POSTFIELDS, http_build_query($login_data));
curl_setopt($login_ch, CURLOPT_USERAGENT, USER_AGENT);
curl_setopt($login_ch, CURLOPT_RETURNTRANSFER, TRUE);
curl_setopt($login_ch, CURLOPT_COOKIEJAR, $deploy_cookies);
$login_resp = json_decode(curl_exec($login_ch));
curl_close($login_ch);

$token_ch = curl_init('http://en.wikipedia.org/w/api.php');
$login_data['lgtoken'] = $login_resp->login->token;
curl_setopt($token_ch, CURLOPT_POSTFIELDS, http_build_query($login_data));
curl_setopt($token_ch, CURLOPT_USERAGENT, USER_AGENT);
curl_setopt($token_ch, CURLOPT_RETURNTRANSFER, TRUE);
curl_setopt($token_ch, CURLOPT_COOKIEFILE, $deploy_cookies);
curl_setopt($token_ch, CURLOPT_COOKIEJAR, $deploy_cookies);
$token_resp = json_decode(curl_exec($token_ch));
curl_close($token_ch);

$edit_token_ch = curl_init('http://en.wikipedia.org/w/api.php');
$edit_token_params = http_build_query(array(
    'action' => 'query',
    'prop' => 'info|revisions',
    'intoken' => 'edit',
    'titles' => $configuration->page,
    'format' => 'json'
));
curl_setopt($edit_token_ch, CURLOPT_POSTFIELDS, $edit_token_params);
curl_setopt($edit_token_ch, CURLOPT_USERAGENT, USER_AGENT);
curl_setopt($edit_token_ch, CURLOPT_RETURNTRANSFER, TRUE);
curl_setopt($edit_token_ch, CURLOPT_COOKIEFILE, $deploy_cookies);
curl_setopt($edit_token_ch, CURLOPT_COOKIEJAR, $deploy_cookies);
$edit_token_resp = json_decode(curl_exec($edit_token_ch), TRUE);
curl_close($edit_token_ch);

$page = array_pop($edit_token_resp['query']['pages']);
$edit_token = $page['edittoken'];

$edit_ch = curl_init('http://en.wikipedia.org/w/api.php');
$edit_params = http_build_query(array(
     'action' => 'edit',
     'title' => $configuration->page,
     'section' => 0,
     'text' => $full_code,
     'summary' => 'Deploy latest version of ProveIt.',
     'notminor' => 1,
     'token' => $edit_token,
     'format' => 'json'
));
curl_setopt($edit_ch, CURLOPT_POST, 1);
curl_setopt($edit_ch, CURLOPT_POSTFIELDS, $edit_params);
curl_setopt($edit_ch, CURLOPT_HTTPHEADER, array('Expect:'));
curl_setopt($edit_ch, CURLOPT_USERAGENT, USER_AGENT);
curl_setopt($edit_ch, CURLOPT_RETURNTRANSFER, TRUE);
curl_setopt($edit_ch, CURLOPT_COOKIEFILE, $deploy_cookies);
$edit_resp = json_decode(curl_exec($edit_ch));
if($edit_resp->edit->result == 'Success')
{
    echo "You have successfully deployed the latest version to " . $configuration->page;
}
else
{
    fwrite($error, "Failed to deploy.  Final response:");
    fwrite($error, var_export($edit_resp, TRUE));
}
curl_close($edit_ch);
?>
