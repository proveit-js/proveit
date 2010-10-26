<?php

$page = 'Report-a-Bug';

include_once 'header.php';

?>

			<!-- Main Content Table -->

				<table id="mainTable">
					<tr>
						<td id="mainContent">

							<div id="mainPic" class="reportabug">
								<h1>Report a Bug</h1>
							</div><!-- end #mainPic -->
							<div id="mainBody"> 
								<h2>How Do I Report a Bug?</h2>
								
								<h3 id="GettingStarted">Getting Started</h3>
								<p>All users are encouraged to report any bugs (or glitches) encountered while using ProveIt. Any and all help is appreciated, and will be used to further improve the ProveIt experience.</p>
								
								<h3 id="Fields">Issue Tracker</h3>
								<p>We use Google Code's issue tracker to manage bug reports. To create a new bug report, go to the <a href="http://code.google.com/p/proveit-js/issues/entry?template=Defect%20report%20from%20user">New Issue</a> page. You'll see a number of fields:</p>
								<dl>
									<dt>Summary</dt>
									<dd>A brief, one-line summary of the problem you're having.</dd>
									<dt>Description</dt>
									<dd>A detailed description of your problem. See our <a href="#Tips">tips for writing good bug reports</a> below.</dd>
									<dt>Status</dt>
									<dd>The status of the bug. Your report will initially be marked <em>New</em>.  If it is verified, it will be changed to <em>Accepted</em>.  When we have begun working, it will be changed to <em>Started</em>.  Finally, when work is complete, it will be marked <em>Fixed</em>.</dd>
									<dt>Label(s)</dt>
									<dd>One or more short tags used to categorize the report. We use various labels help organize reports, including <em>Type</em> (e.g. Defect, Enhancement, or Task), <em>Priority</em>, and <em>OpSys</em> (operating system).</dd>
									<dt>Owner</dt>
									<dd>The developer responsible for monitoring your report. You should post any relevant information to the issue page, rather than contacting the developer directly.</dd>
								</dl>
								
								<p>Once you've filled out the Status and Description fields, click the "Submit issue" button. You're done! Thanks in advance.</p>

								<h3 id="Tips">Tips for Writing Bug Reports</h3>
								<p>To help the ProveIt developers fix the bug, please provide enough information for them to reproduce it. This will typically include:</p>
								<ul>
									<li>Your browser and its version.  For example, Firefox 3.6.10, Internet Explorer 8, or Chrome 7.0.517.24</li>
									<li>The article you were editing</li>
									<li>The expected result</li>
									<li>The problem you experienced</li>
								</ul>								
								
								<h2><a href="http://code.google.com/p/proveit-js/issues/entry?template=Defect%20report%20from%20user">Report a Bug Now</a></h2>

							</div><!-- end #mainBody -->
						</td>
						<td id="sideTableofContents"> 
							<h2>Report a Bug </h2>
							<ul>
								<li><a href="#GettingStarted">Getting Started</a></li>
								<li><a href="#Fields">Issue Tracker</a></li>
								<li><a href="#Tips">Tips for Writing Bug Reports</a></li>
								<li><a href="http://code.google.com/p/proveit-js/issues/entry?template=Defect%20report%20from%20user">Report a Bug Now</a></li>
							</ul>
					  </td>
					</tr>
				</table> 


<?php include_once 'footer.php'; ?>
