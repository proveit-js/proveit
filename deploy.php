#!/usr/bin/php
<?php
error_reporting(-1); // All errors

chdir(dirname (__FILE__)); // Change to directory of script (should be repo root)
define('REPO', 'https://github.com/proveit-js/proveit');
define('IMPORT_HEADER', <<<'EOH'
/*
 * Imported from Git commit %s as of %s from https://github.com/proveit-js/proveit
 * Changes should be made through that GitHub project.
 */
EOH
);
define('USER_AGENT', 'ProveIt deploy script (https://github.com/proveit-js/proveit)');
define('REV_SHORT', 'r');
define('REV_LONG', 'rev');
define('TYPE_SHORT', 't');
define('TYPE_LONG', 'type');
define('SSH_DEFAULT_PORT', 22);
$options = getopt(REV_SHORT . ':' . TYPE_SHORT . ':', array(REV_LONG . ':', TYPE_LONG . ':'));

function get_option_value($options, $short, $long, $meaning, $err_code)
{
	if(isset($options[$short])) {
		return $options[$short];
	}
	else if(isset($options[$long])) {
		return $options[$long];
	}
	else {
		fwrite(STDERR, "You must specify the $meaning.  Use -$short or --$long.\n");
		exit($err_code);
	}
}

function sftp_walk($con, $sftp, $local_dir, $remote_dir)
{
	$dir = opendir($local_dir);
	ssh2_sftp_mkdir($sftp, $remote_dir, 0755, true);
	while (($file = readdir($dir)) !== false) {
		$local_file = $local_dir . '/' . $file;
		$remote_file = $remote_dir . '/' . $file;
		if(!is_dir($local_file)) {
			echo "Transferring $local_file to $remote_file\n";
			$scp_ret = ssh2_scp_send($con, $local_file, $remote_file, 0755);
			if(!$scp_ret) {
				fwrite(STDERR, "Failed to transfer $local_file.\n");
				exit(8);
			}
		}
		else if($file != "." && $file != "..") {
			sftp_walk($con, $sftp, $local_file, $remote_file);
		}
	}
}

function sync_yui($configuration) {
	system('./yuidoc.sh', $yui_exit);
	if($yui_exit != 0) {
		fwrite(STDERR, "Failed to run yuidoc.  Please check that it and its dependencies are installed.\n");
		exit(11);
	}
	$port = isset($configuration->ssh->port) ? $configuration->ssh->port : DEFAULT_SSH_PORT;
	echo "Connecting to {$configuration->ssh->host} on port $port\n";

	$con = ssh2_connect($configuration->ssh->host, $port);
	if(!$con) {
		fwrite(STDERR, "Failed to connect to {$configuration->ssh->host}\n");
		exit(10);
	}

	if(isset($configuration->ssh->password)) {
		$auth_ret = ssh2_auth_password($con, $configuration->ssh->username, $configuration->ssh->password);
		if(!$auth_ret) {
			fwrite(STDERR, 'SSH password authentication failed.\n');
			exit(6);
		}
	}
	else {
		$passphrase = isset($configuration->ssh->passphrase) ? $configuration->ssh->passphrase : NULL;
		$auth_ret = ssh2_auth_pubkey_file($con, $configuration->ssh->username, $configuration->ssh->publicKeyFileName, $configuration->ssh->privateKeyFileName, $passphrase);
		if(!$auth_ret) {
			fwrite(STDERR, 'SSH public/private key authentication failed.\n');
			exit(15);
		}

	}

	$sftp = ssh2_sftp($con);
	if(!$sftp) {
		fwrite(STDERR, "Failed to open SFTP subsystem.\n");
		exit(7);
	}

	sftp_walk($con, $sftp, 'yui_docs/html', $configuration->ssh->path);
	chdir(dirname(__FILE__));
	echo "You have succesfully deployed the ProveIt API documentation.\n";
}

$opt_deploy_type = get_option_value($options, TYPE_SHORT, TYPE_LONG, 'deployment type (proveitgt, prod, etc.)', 12);
$configuration_filename = "./deploy_configuration.{$opt_deploy_type}.json";
if(!file_exists($configuration_filename)) {
	fwrite(STDERR, "$configuration_filename does not exist.  Ensure that '$opt_deploy_type' is the correct type and the file exists.\n");
	exit(13);
}

$configuration = json_decode(file_get_contents($configuration_filename));
# Must have at least one wiki page.
if(!isset($configuration->users[0]->username, $configuration->users[0]->password)) {
	fwrite(STDERR, <<< 'EOM'
		You must provide a JSON file, $configuration_filename, in the repository root (but not committed).
		It must have username, password, and header fields for at least one page.
		There must also be ssh configuration fields set.

EOM
	);
	exit(1);
}

// Uploading docs via SSH is optional (intended for production deployments, but not localhost ones), but if used, the required fields must be included.
if(isset($configuration->ssh)) {
	if(!isset($configuration->ssh->password) && !isset($configuration->ssh->publicKeyFileName, $configuration->ssh->privateKeyFileName)) {
		fwrite(STDERR, "In the SSH section you must set either password or both publicKeyFileName and privateKeyFileName\n");
		exit(14);
	}

	if(!isset($configuration->ssh->host) || !isset($configuration->ssh->username) || !isset($configuration->ssh->path)) {
		fwrite(STDERR, "If uploading docs via SSH, you must specify a host, username, and path as subkeys\n");
		exit(17);
	}
}

$_ = NULL; // unused, needed because only variables can be passed by reference.
exec('git fetch origin');
$compare_origin_local_out = array();

// TODO: This only checks the master branch.  Keep it?
exec('git log --oneline origin/master..master', $compare_origin_local_out);
if(count($compare_origin_local_out) > 0) {
	fwrite(STDERR, "Your changes must be merged to the main repository, " . REPO . ", before running $argv[0].\n");
	exit(2);
}

$opt_revid = get_option_value($options, REV_SHORT, REV_LONG, 'revision to deploy', 4);

$revid = exec('git rev-parse ' . $opt_revid, $_, $id_ret);
if($id_ret != 0) {
	fwrite(STDERR, "Invalid revision id: " . $opt_revid . "\n");
	exit(5);
}

// Commiter date
$date = exec("git log -1 --pretty=%cd --date=short $revid");

$temp_dir = tempnam("/tmp", "proveit_deploy_r{$revid}_");
if(!$temp_dir) {
	fwrite(STDERR, "Failed to create temporary file.\n");
	exit(9);
}
unlink($temp_dir); // We need a directory, rather than file.
mkdir($temp_dir);
exec("git archive --format=tar $revid | tar -x -C $temp_dir", $_, $archive_ret);
if($archive_ret != 0) {
	fwrite(STDERR, "Failed to export from git to temporary directory.\n");
	exit(16);
}
chdir($temp_dir);

$users = $configuration->users;

if(!isset($configuration->apiUrl)) {
	fwrite(STDERR, "You must specify the URL of the MediaWiki API via the 'apiUrl' configuration key.\n");
	exit(18);
}

$mwApiUrl = $configuration->apiUrl;
$viaApi = "via $mwApiUrl";

foreach($users as $user) {
	if(isset($user->header)) {
		$header = implode("\n", $user->header) . "\n"; // Having header be an array makes the JSON file more readable
	}
	else {
		$header = '';
	}
	$subbed_import_header = sprintf(IMPORT_HEADER, $revid, $date);
	$deploy_cookies = tempnam("/tmp", "deploy_cookie");
	$login_ch = curl_init($mwApiUrl);
	$login_data = array(
		'action' => 'login',
		'lgname' => $user->username,
		'lgpassword' => $user->password,
		'format' => 'json'
	);
	curl_setopt($login_ch, CURLOPT_POSTFIELDS, http_build_query($login_data));
	curl_setopt($login_ch, CURLOPT_USERAGENT, USER_AGENT);
	curl_setopt($login_ch, CURLOPT_RETURNTRANSFER, TRUE);
	curl_setopt($login_ch, CURLOPT_COOKIEJAR, $deploy_cookies);
	$login_resp = json_decode(curl_exec($login_ch));
	curl_close($login_ch);

	$token_ch = curl_init($mwApiUrl);
	$login_data['lgtoken'] = $login_resp->login->token;
	curl_setopt($token_ch, CURLOPT_POSTFIELDS, http_build_query($login_data));
	curl_setopt($token_ch, CURLOPT_USERAGENT, USER_AGENT);
	curl_setopt($token_ch, CURLOPT_RETURNTRANSFER, TRUE);
	curl_setopt($token_ch, CURLOPT_COOKIEFILE, $deploy_cookies);
	curl_setopt($token_ch, CURLOPT_COOKIEJAR, $deploy_cookies);
	$token_resp = json_decode(curl_exec($token_ch));
	curl_close($token_ch);

	foreach($user->files as $filename => $title) {
		if(!isset($edit_token)) {
			$edit_token_ch = curl_init($mwApiUrl);
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
		}

		echo "Attempting to deploy ProveIt file $filename to $title $viaApi\n";
		if(!file_exists($filename)) {
			echo realpath(dirname('.'));
			fwrite(STDERR, "Code file " . realpath($filename) . " does not exist.\n");
			exit(12);
		}
		$code = file_get_contents($filename);
		$full_code = $header . $subbed_import_header . "\n" . $code;

		$edit_ch = curl_init($mwApiUrl);
		$edit_params = array(
			'action' => 'edit',
			'title' => $title,
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
		$success_msg = "You have successfully deployed commit $revid of ProveIt file $filename to $title $viaApi\n";
		$success = $edit_resp->edit->result == 'Success';

		if($success) {
			echo $success_msg;
		}
		else if(isset($edit_resp->edit->captcha)) {
			fwrite(STDERR, "Solve CAPTCHA at " . "http://en.wikipedia.org" . $edit_resp->edit->captcha->url . ", then enter it and press return:\n");
			$answer = trim(fgets(STDIN));
			$edit_params['captchaid'] = $edit_resp->edit->captcha->id;
			$edit_params['captchaword'] = $answer;
			curl_setopt($edit_ch, CURLOPT_POSTFIELDS, http_build_query($edit_params));
			$edit_resp = json_decode(curl_exec($edit_ch));
			$success = $edit_resp->edit->result == 'Success';
			if($success) {
				echo "CAPTCHA successful. $success_msg";
			}
			else {
				fwrite(STDERR, "CAPTCHA retry failed.");
			}
		}
		curl_close($edit_ch);
		if(!$success) {
			fwrite(STDERR, "Failed to deploy $filename to $title. Exiting. Final response was:\n");
			fwrite(STDERR, $edit_resp_str);
			exit(3);
		}
	}

	unset($edit_token);
	unlink($deploy_cookies);
}

if(isset($configuration->ssh)) {
	sync_yui($configuration);
}

system("rm -r $temp_dir");
