<?php

$page = 'Install';

include_once 'header.php';

?>
			<!-- Main Content Table -->

				<div id="leadInPic">
					<img src="img/install.jpg" alt="Install" height="167" width="940" />
				</div>

				<table id="mainTable">
					<tr>
						<td id="mainContent">

							<div id="mainPic" class="install">
								<h1>Install ProveIt</h1>
							</div><!-- end #mainPic -->
							<div id="mainBody"> 
							
								<h2>How to Install ProveIt</h2>
							
                                                                <p>ProveIt is <a href="features.php#foss">free and open source</a>, and installing it's a piece of cake. Just follow these simple instructions:</p>

								<ol>								
									<li>Log in to Wikipedia. Currently, you must have a Wikipedia account to use ProveIt.</li>
									<li>Go to your <a href="http://en.wikipedia.org/w/index.php?title=Special:MyPage/skin.js&amp;action=edit">user script page</a>.</li>
									<li>Copy and paste these two lines of code:
									 <code>importScript('User:ProveIt GT/ProveIt.js');<br />
									 // [[User:ProveIt GT/ProveIt.js]]</code>
									 </li>
									<li>Save. You may have to <a href="http://en.wikipedia.org/wiki/Wikipedia:Bypass_your_cache">bypass your cache</a> to see the changes.</li>
								</ol>

								<p>That's it! You can start using ProveIt immediately. Just go to any Wikipedia article and click the Edit tab.</p>

   
							</div><!-- end #mainBody -->
						</td>
						<td id="sideTableofContents">
						
						<h2>Release Notes</h2>
						<h3>Latest Release</h3>
						<p>version 0.90, released 10/26/2010</p>
						
						<h3>New in This Release</h3>
						<ul>
							<li>Fixed compatibility issues in Chrome and IE</li>
							<li>Now using Wikipedia's jQuery library</li>
						</ul>
						
						</td>
					</tr>
				</table> 

<?php include_once 'footer.php'; ?>