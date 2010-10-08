<?php

$page = 'Report-a-Bug';

include_once 'header.php';

?>

			<!-- Main Content Table -->

				<div id="leadInPic"><img src="img/reportabug_leadIn.jpg" alt="doc_banner" /></div>

				<table width="960" border="0" cellspacing="0" cellpadding="0" style="background-color: #2682c7; ">
					<tr>
						<td style="width: 686px;">

							<div id="mainPic" class="reportabug">
								<h1>Search and Destroy</h1>
							</div><!-- end #mainPic -->
							<div id="mainBody"> 
								<h3>How Do I Report a Bug?</h3>
								<h4 id="GettingStarted">Getting Started</h4>
								<p>All users are encouraged to report any bugs (or glitches) encountered while using ProveIt. Any and all help is appreciated, and will be used to further improve the ProveIt experience.</p>
								<h4 id="Tips">Tips for Writing Bugs</h4>
								<p>To help the ProveIt developers fix the bug, you should provide us with the information we need to reproduce it.  This will typically include:</p>
								<ol>
									<li>Your browser and its version.  For example, Firefox 3.6.10, Internet Explorer 8, or Chrome 7.0.517.24</li>
									<li>The article you were editing</li>
									<li>The expected result</li>
									<li>The problem you experienced</li>
								</ol>
								<h4 id="Fields">Issue Tracker Fields</h4>
								<dl>
									<dt>Status</dt>
									<dd>- The status of the bug.  Your issue will initially be marked New.  If it is verified, it will be changed to Accepted.  When we have begun working, it will be changed to Started.  Finally, when work is complete, it will be marked Fixed.</dd>
									<dt>Label</dt>
									<dd>- Various labels are used to help organize issues.  These include Type (e.g. Defect, Enhancement, or Task), Priority, and OpSys (operating system).</dd>
									<dt>Owner</dt>
									<dd>- This indicates the person with responsibility for monitoring the issue.  However, you should post any relevant information to the issue page, rather than contacting them directly.</dd>
								</dl>

								<h2><a href="http://code.google.com/p/proveit-js/issues/entry">Report a Bug Now</a></h2>
								<!--table>      
									<tr>
										<td style="background-color: #2682c7; ">
											<div id="recommendationHeader"> RECOMMENDED TUTORIALS </div> 
											<div class="recommend left"> <div class="recommendText firstLine"> Getting Started with</div>
											<div class="recommendText secondLine"><a href="" class="recommendLink"> ProveIt</a></div></div> 
		
											<div class="recommend right"> <div class="recommendText firstLine"> Quick Interface </div>
											<div class="recommendText secondLine"> <a href="features.html" class="recommendLink"> WALKTHROUGH </a></div></div>
										</td>
									</tr>
								</table -->     
							</div><!-- end #mainBody -->
						</td>
						<td> 
							<h2> Contents </h2>
							<div id="sideTableofContents">
								<h3 class="first">How Do I Report a Bug?</h3>
								<ul>
									<li><a href="#GettingStarted">Getting Started</a></li>
									<li><a href="#Tips">Tips for Writing Bugs</a></li>
									<li><a href="#Fields">Issue Tracker Fields</a></li>
								</ul>
							</div>
					  </td>
					</tr>
				</table> 


<?php include_once 'footer.php'; ?>
