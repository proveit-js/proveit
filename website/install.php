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
							
                                <p>ProveIt is <a href="/users/features#foss">free and open source</a>, and installing it is a piece of cake. Just follow these simple instructions:</p>
								
								<h2>English Wikipedia</h2>

								<ol>
									<li><strong><a href="http://en.wikipedia.org/w/index.php?title=Special:UserLogin&amp;returnto=User:ProveIt_GT">Log in</a> to Wikipedia.</strong> If you don't have an account, you'll have to <a href="http://en.wikipedia.org/w/index.php?title=Special:UserLogin&amp;type=signup&amp;returnto=User:ProveIt_GT">create one</a> to use ProveIt.</li>
									<li><strong>Go to your <a href="http://en.wikipedia.org/w/index.php?title=Special:MyPage/skin.js&amp;action=edit">user script page</a>.</strong> You may have to create this page if it's empty. Also, if you're using Wikipedia's new skin, the page may redirect past some warning text in pink boxes &mdash; this is normal.</li>
									<li><strong>Copy and paste these two lines of code:</strong>
									 <code>importScript('User:ProveIt GT/ProveIt.js');<br />
									 // [[User:ProveIt GT/ProveIt.js]]</code>
									  Don't add or modify any other lines unless you know what you're doing.
									 </li>
									<li><strong>Save.</strong> You may have to <a href="http://en.wikipedia.org/wiki/Wikipedia:Bypass_your_cache">bypass your cache</a> to see the changes.</li>
								</ol>
								
								<hr />
								
								<h2>Other (non-English) Wikipedia</h2>
								
								<ol>								
									<li><strong>Log in to Wikipedia.</strong> If you don't have an account, you'll have to create one to use ProveIt.</li>
									<li><strong>Go to your user script page.</strong> You may have to create this page if it's empty. Also, if you're using Wikipedia's new skin, the page may redirect past some warning text in pink boxes &mdash; this is normal.</li>
									<li><strong>Copy and paste these two lines of code:</strong>
									 <code>importScriptURI('http://en.wikipedia.org/w/index.php?title=User:ProveIt_GT/ProveIt.js&amp;action=raw&amp;ctype=text/javascript');<br />
									 // [[User:ProveIt GT/ProveIt.js]]</code>
									  Don't add or modify any other lines unless you know what you're doing.
									 </li>
									<li><strong>Save.</strong> You may have to bypass your cache to see the changes.</li>
								</ol>

								<hr />								

								<p>That's it! You can start using ProveIt immediately. You can start with <a href="http://en.wikipedia.org/w/index.php?title=Georgia_Institute_of_Technology&amp;action=edit">Georgia Institute of Technology</a> or go to any other Wikipedia article and click the Edit tab.</p>

   
							</div><!-- end #mainBody -->
						</td>
						<td id="sideTableofContents">
						
						<h2>Release Notes</h2>
						<h3>Latest Release</h3>
						<p>version 2.03, released 12/7/2010</p>
						
						<h3>New in This Release</h3>
						<ul>
							<li>ProveIt now loads minimized by default. To change this, see our <a href="/users/guide">user guide</a>.</li>
						</ul>
						
						</td>
					</tr>
				</table> 

<?php include_once 'footer.php'; ?>