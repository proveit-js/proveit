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
# Must have SSH configuration and at least one page.
if(!isset($configuration->pages[0]->username, $configuration->pages[0]->password, $configuration->pages[0]->title, $configuration->pages[0]->header, $configuration->ssh->host, $configuration->ssh->username, $configuration->ssh->password, $configuration->ssh->path))
{
    fwrite(STDERR, 'You must provide a JSON file, deploy_configuaration.json, in the repository root (but not committed).  It must have username, password, title, and header fields for at least one page.  There must also be ssh configuration fields set.');
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
$date_line = exec("hg log --template '{date}' -r $revid");
$date_stamp = substr($date_line, 0, strpos($date_line, '.'));
$datetime = new DateTime(NULL, new DateTimeZone('UTC'));
$datetime->setTimestamp($date_stamp);
$date = $datetime->format('Y-m-d');

$temp_dir = tempnam("/tmp", "proveit_deploy_r{$revid}_");
if(!$temp_dir)
{
    fwrite(STDERR, "Failed to create temporary file.\n");
    exit(9);
}
unlink($temp_dir); // We need a directory, rather than file.
shell_exec("hg archive -r $revid $temp_dir");
chdir($temp_dir);

$orig_code = file_get_contents(PROVEIT_FILE);
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
$pages = $configuration->pages;
foreach($pages as $page)
{
    $title = $page->title;
    $header = implode("\n", $page->header); // Having header be an array makes the JSON file more readable
    $subbed_header = sprintf($header, $revid, $date); // It's okay if not all parameters are used by %s placeholders in $header.
    $full_code = $subbed_header . $minified;
    $deploy_cookies = tempnam("/tmp", "deploy_cookie");
    $login_ch = curl_init(MW_API);
    $login_data = array(
    'action' => 'login',
    'lgname' => $page->username,
    'lgpassword' => $page->password,
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
    'titles' => $title,
    'format' => 'json'
    ));
    curl_setopt($edit_token_ch, CURLOPT_POSTFIELDS, $edit_token_params);
    curl_setopt($edit_token_ch, CURLOPT_USERAGENT, USER_AGENT);
    curl_setopt($edit_token_ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($edit_token_ch, CURLOPT_COOKIEFILE, $deploy_cookies);
    curl_setopt($edit_token_ch, CURLOPT_COOKIEJAR, $deploy_cookies);
    $edit_token_resp = json_decode(curl_exec($edit_token_ch), TRUE);
    curl_close($edit_token_ch);

    $resp_page = array_pop($edit_token_resp['query']['pages']);
    $edit_token = $resp_page['edittoken'];
    
    $edit_ch = curl_init(MW_API);
    $edit_params = array(
     'action' => 'edit',
     'title' => $title,
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
    $success_msg = "You have successfully deployed commit $revid of ProveIt to " . $title . "\n";
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
    unlink($deploy_cookies);
    if(!$success)
    {
	fwrite(STDERR, "Failed to deploy.  Final response:\n");
	fwrite(STDERR, $edit_resp_str);
	exit(3);
    }
}
system('./yuidoc.sh');
echo "Connecting to {$configuration->ssh->host}\n";
$con = ssh2_connect($configuration->ssh->host);
if(!$con)
{
    fwrite(STDERR, "Failed to connect to {$configuration->ssh->host}\n");
    exit(10);
}

$auth_ret = ssh2_auth_password($con, $configuration->ssh->username, $configuration->ssh->password);
if(!$auth_ret)
{
    fwrite(STDERR, 'SSH password authentication failed.\n');
    exit(6);
}

$sftp = ssh2_sftp($con);
if(!$sftp)
{
    fwrite(STDERR, "Failed to open SFTP subsystem.\n");
    exit(7);
}

function sftp_walk($con, $sftp, $local_dir, $remote_dir)
{
    $dir = opendir($local_dir);
    ssh2_sftp_mkdir($sftp, $remote_dir, 0755, true);
    while (($file = readdir($dir)) !== false)
    {
	$local_file = $local_dir . '/' . $file;
	$remote_file = $remote_dir . '/' . $file;
	if(!is_dir($local_file))
	{
	    echo "Transferring $local_file to $remote_file\n";
       	    $scp_ret = ssh2_scp_send($con, $local_file, $remote_file, 0755);
	    if(!$scp_ret)
	    {
		fwrite(STDERR, "Failed to transfer file.\n");
		exit(8);
	    }
	}
	else if($file != "." && $file != "..")
	{
	    sftp_walk($con, $sftp, $local_file, $remote_file);
	}
    }
}

sftp_walk($con, $sftp, 'yui_docs/html', $configuration->ssh->path);
chdir(dirname(__FILE__));
system("rm -r $temp_dir");
echo "You have succesfully deployed the ProveIt API documentation.\n";