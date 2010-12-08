<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd"> 
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en"> 
<head>
	<title>ProveIt - Wikipedia References Made Easy - <?php echo $page; ?></title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="content-language" content="en" /> 
    <meta name="description" content="ProveIt is a free, open-source referencing tool that makes it that makes it really easy to find, edit, add, and cite references in Wikipedia articles." /> 
    <meta name="author" content="ELC Lab at Georgia Tech" /> 	
	<link href="/proveit_styles.css" rel="stylesheet" type="text/css" />
	<link rel="shortcut icon" href="/img/favicon.ico" type="image/x-icon" />	
	<script type="text/javascript" src="http://www.google.com/jsapi"></script> 
	<script type="text/javascript"> 
		google.load("jquery", "1");
		google.setOnLoadCallback(function(){});
	</script> 
	<script src="/scripts.js" type="text/javascript"></script>
	<script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-19852049-1']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

	</script>	
</head>
<body>

<!-- Navigation Table -->
<div style="background-color: #000;">
				<table id="headerTable">
					<tr>
						<td style="width: 250px; ">
							<div id="logoContainer">
								<a href="/"><img src="/img/proveit_logo.png" alt="ProveIt logo" /></a>
							</div>
						</td>
						<td>

<?php

// use the page name to figure out which primary-nav category we're in

$primary = '';

switch($page)
{
	case 'Features':
	case 'Screenshots':
	case 'User Guide':
	case 'Tutorials':
	case 'Report-a-Bug':
	case 'Users':
		$primary = 'Users';
		break;
		
	case 'Developers':
		$primary = 'Developers';
		break;
	
	case 'Demo':
		$primary = 'Demo';
		break;
	
	case 'Research':
	case 'The Team':
	case 'About':
	case 'Credits':
		$primary = 'About';
		break;
}

?>					
						<ul id="primary-nav">				
							<li>
								<a href="/users" class="primary-nav-link<?= $primary == 'Users' ? ' selected' : '' ?>">Users</a>
								<ul<?= $primary == 'Users' ? ' style="display: block;"' : '' ?>>
									<li><a href="/users/features"<?= $page == 'Features' ? ' class="selected"' : '' ?>>Features</a></li>
									<li><a href="/users/screenshots"<?= $page == 'Screenshots' ? ' class="selected"' : '' ?>>Screenshots</a></li>
									<li><a href="/users/guide"<?= $page == 'User Guide' ? ' class="selected"' : '' ?>>User Guide</a></li>
									<li><a href="/users/tutorials"<?= $page == 'Tutorials' ? ' class="selected"' : '' ?>>Tutorials</a></li>
									<li><a href="/users/bugreport"<?= $page == 'Report-a-Bug' ? ' class="selected"' : '' ?>>Report a Bug</a></li>
								</ul>
							</li>
							<li>
								<a href="/developers" class="primary-nav-link<?= $primary == 'Developers' ? ' selected' : '' ?>">Developers</a>
								<ul<?= $primary == 'Developers' ? ' style="display: block;"' : '' ?>>
									<li><a href="/yuidocs/index.html">Documentation</a></li>
									<li><a href="http://code.google.com/p/proveit-js/">Google Code Project</a></li>
									<li><a href="http://code.google.com/p/proveit-js/w/list">Wiki</a></li>
								</ul>
							</li>
							<li>
								<a href="/demo" class="primary-nav-link<?= $primary == 'Demo' ? ' selected' : '' ?>">Demo</a>
							</li>
							<li>
								<a href="/about" class="primary-nav-link<?= $primary == 'About' ? ' selected' : '' ?>">About</a>
								<ul class="about"<?= $primary == 'About' ? ' style="display: block;"' : '' ?>>
									<li><a href="/about/research"<?= $page == 'Research' ? ' class="selected"' : '' ?>>Research</a></li>
									<li><a href="/about/team"<?= $page == 'The Team' ? ' class="selected"' : '' ?>>The Team</a></li>
									<li><a href="/about/credits"<?= $page == 'Credits' ? ' class="selected"' : '' ?>>Credits</a></li>
								</ul>
							</li>
						</ul><!-- end #primary-nav -->
							
						</td>
						<td style="width: 250px; ">
							<div id="getProveIt"><a href="/install"></a></div>
						 </td>
					</tr>
				</table>
			<!-- End of Navigation Table -->
</div>
<div id="superContainer">	