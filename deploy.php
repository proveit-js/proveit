#!/usr/bin/php
<?php
chdir(dirname (__FILE__)); // Change to directory of script (should be repo root)
define('REPO', 'https://proveit-js.googlecode.com/hg/');
define('PROVEIT_FILE', 'ProveIt_Wikipedia.js');
define('USER_AGENT', 'ProveIt deploy script (http://code.google.com/p/proveit-js/)');
define('MW_API', 'http://en.wikipedia.org/w/api.php');
define('REV_SHORT', 'r');
define('REV_LONG', 'rev');

$options = getopt(REV_SHORT . ':', array(REV_LONG . ':'));
$configuration = json_decode(file_get_contents('./deploy_configuration.json'));
if(!(isset($configuration->username) && isset($configuration->password) && isset($configuration->page)))
{
    fwrite(STDERR, 'You must provide a JSON file, deploy_configuaration.json, in the repository root (but not committed) with username, password, and page fields set.');
    exit(1);
}

$_ = NULL; // unused, needed because only variables can be passed by reference.
exec('hg outgoing ' . REPO, $_, $out_ret);
if($out_ret === 0) // 0 unpushed changes, 1 otherwise
{
    fwrite(STDERR, "Push your changes to the main repository, " . REPO . ", before running $argv[0].\n");
    exit(2);
}
if(isset($options[REV_SHORT]))
{
    $opt_revid = $options[REV_SHORT];
}
else if(isset($options[REV_LONG]))
{
    $opt_revid = $options[REV_LONG];
}
else
{
    fwrite(STDERR, "You must specify the revision to deploy.\n");
    exit(4);
}

$revid = exec('hg identify -i -r ' . $opt_revid, $_, $id_ret);
if($id_ret != 0)
{
    fwrite(STDERR, "Invalid revision id: " . $opt_revid . "\n");
    exit(5);
}

$orig_code = shell_exec('hg cat -r ' . $revid . ' ' . PROVEIT_FILE);
$closure_ch = curl_init('http://closure-compiler.appspot.com/compile');
$params = http_build_query(array(
    'js_code' => $orig_code,
    'compilation_level' => 'SIMPLE_OPTIMIZATIONS',
    'output_info' => 'compiled_code'
));
curl_setopt($closure_ch, CURLOPT_POSTFIELDS, $params);
curl_setopt($closure_ch, CURLOPT_RETURNTRANSFER, TRUE);
curl_setopt($closure_ch, CURLOPT_USERAGENT, USER_AGENT);

$minified = curl_exec($closure_ch);
curl_close($closure_ch);
$header = <<< EOF
/* ProveIt, commit $revid, Copyright 2010, Georgia Tech
   Available under the GNU Free Documentation License, Creative Commons Attribution/Share-Alike License 3.0, and the GNU General Public License 2
   This is a minified version.  Changes can be made through our Google Code Project (http://code.google.com/p/proveit-js/) */

EOF;
$full_code = $header . $minified;
$deploy_cookies = tempnam("/tmp", "deploy_cookie");

$login_ch = curl_init(MW_API);
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

$token_ch = curl_init(MW_API);
$login_data['lgtoken'] = $login_resp->login->token;
curl_setopt($token_ch, CURLOPT_POSTFIELDS, http_build_query($login_data));
curl_setopt($token_ch, CURLOPT_USERAGENT, USER_AGENT);
curl_setopt($token_ch, CURLOPT_RETURNTRANSFER, TRUE);
curl_setopt($token_ch, CURLOPT_COOKIEFILE, $deploy_cookies);
curl_setopt($token_ch, CURLOPT_COOKIEJAR, $deploy_cookies);
$token_resp = json_decode(curl_exec($token_ch));
curl_close($token_ch);

$edit_token_ch = curl_init(MW_API);
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

$edit_ch = curl_init(MW_API);
$edit_params = array(
     'action' => 'edit',
     'title' => $configuration->page,
     'section' => 0,
     'text' => $full_code,
     'summary' => "Deploy commit $revid of ProveIt.",
     'notminor' => 1,
     'token' => $edit_token,
     'format' => 'json'
);
curl_setopt($edit_ch, CURLOPT_POSTFIELDS, http_build_query($edit_params));
curl_setopt($edit_ch, CURLOPT_HTTPHEADER, array('Expect:'));
curl_setopt($edit_ch, CURLOPT_USERAGENT, USER_AGENT);
curl_setopt($edit_ch, CURLOPT_RETURNTRANSFER, TRUE);
curl_setopt($edit_ch, CURLOPT_COOKIEFILE, $deploy_cookies);
$edit_resp_str = curl_exec($edit_ch);
$edit_resp = json_decode($edit_resp_str);
$success_msg = "You have successfully deployed commit $revid of ProveIt to " . $configuration->page . "\n";
$success = $edit_resp->edit->result == 'Success';
if($success)
{
    echo $success_msg;
}
else if(isset($edit_resp->edit->captcha))
{
    fwrite(STDERR, "Solve CAPTCHA at " . "http://en.wikipedia.org" . $edit_resp->edit->captcha->url . ", then enter it and press return:\n");
    $answer = trim(fgets(STDIN));
    $edit_params['captchaid'] = $edit_resp->edit->captcha->id;
    $edit_params['captchaword'] = $answer;
    curl_setopt($edit_ch, CURLOPT_POSTFIELDS, http_build_query($edit_params));
    $edit_resp = json_decode(curl_exec($edit_ch));
    $success = $edit_resp->edit->result == 'Success';
    if($success)
    {
	echo "CAPTCHA successful. $success_msg"; 
    }
    else
    {
	fwrite(STDERR, "CAPTCHA retry failed.");
    }
}
curl_close($edit_ch);
if(!$success)
{
    fwrite(STDERR, "Failed to deploy.  Final response:\n");
    fwrite(STDERR, $edit_resp_str);
    exit(3);
}
?>
