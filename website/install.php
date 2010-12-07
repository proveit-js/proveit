<?php

$page = 'Install';

include_once 'header.php';

?>
			<!-- Main Content Table -->

				<div id="leadInPic">
					<img src="/img/install.jpg" alt="Install" height="167" width="940" />
				</div>

				<table id="mainTable">
					<tr>
						<td id="mainContent">

							<div id="mainPic" class="install">
								<h1>Install ProveIt</h1>
							</div><!-- end #mainPic -->
							<div id="mainBody"> 
							
								<h2>How to Install ProveIt</h2>
							
                                <p>ProveIt is <a href="/users/features#foss">free and open source</a>, and installing it is a piece of cake. Just follow these simple instructions:</p>

								<ol>								
									<li><a href="http://en.wikipedia.org/w/index.php?title=Special:UserLogin&returnto=User:ProveIt_GT">Log in</a> to Wikipedia. If you don't have an account, you'll have to <a href="http://en.wikipedia.org/w/index.php?title=Special:UserLogin&type=signup&returnto=User:ProveIt_GT">create one</a>. Currently, you must have a Wikipedia account to use ProveIt.</li>
									<li>Go to your <a href="http://en.wikipedia.org/w/index.php?title=Special:MyPage/skin.js&amp;action=edit">user script page</a>. You may have to create this page if it's empty. Also, if you're using Wikipedia's new skin, the page may redirect past some warning text in pink boxes &mdash; this is normal.</li>
									<li>Copy and paste these two lines of code into that page. Don't add or modify any other lines unless you know what you're doing.
									 <code>importScript('User:ProveIt GT/ProveIt.js');<br />
									 // [[User:ProveIt GT/ProveIt.js]]</code>
									 </li>
									<li>Save. You may have to <a href="http://en.wikipedia.org/wiki/Wikipedia:Bypass_your_cache">bypass your cache</a> to see the changes.</li>
								</ol>

								<p>That's it! You can start using ProveIt immediately. You can start with <a href="http://en.wikipedia.org/w/index.php?title=Georgia_Institute_of_Technology&action=edit">Georgia Institute of Technology</a> or go to any other Wikipedia article and click the Edit tab.</p>

   
							</div><!-- end #mainBody -->
						</td>
						<td id="sideTableofContents">
						
						<h2>Release Notes</h2>
						<h3>Latest Release</h3>
						<p>version 2.02, released 11/30/2010</p>
						
						<h3>New in This Release</h3>
						<ul>
							<li>Fixed scroll-to-reference when selecting or inserting a reference or citation.</li>
						</ul>
						
						</td>
					</tr>
				</table> 

<?php include_once 'footer.php'; ?>