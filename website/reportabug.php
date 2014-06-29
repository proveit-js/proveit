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
								<h2 id="GettingStarted">Getting Started</h2>
								<p>All users are encouraged to report any bugs (or glitches) encountered while using ProveIt. Any and all help is appreciated, and will be used to further improve the ProveIt experience.</p>
								<!--br/-->
								
								<hr />
								<h2 id="Fields">Issue Tracker</h2>
								<p>We use GitHub's issue tracker to manage bug reports. To create a new bug report, go to the <a href="http://tinyurl.com/proveit-github-issue">New Issue</a> page. You'll see a number of fields:</p>
								<dl>
									<dt><i>Title</i></dt>
									<dd>A brief, one-line summary of the problem you're having.</dd>
									<dt>Description (where it says 'Leave a comment')</dt>
									<dd>A detailed description of your problem. If you use the link above, there will be questions pre-filled.  See also our <a href="#Tips">tips for writing good bug reports</a> below.</dd>
									<dt>Label(s)</dt>
									<dd>One or more short tags used to categorize the report. We use various labels help organize reports, including <em>Type</em> (e.g. Defect, Enhancement, or Task), <em>Priority</em>, and <em>OpSys</em> (operating system).  These are shown on the right</dd>
									<dt>Assignee</dt>
									<dd>The developer responsible for monitoring your report. You should post any relevant information to the issue page, rather than contacting the developer directly.</dd>
								</dl>
								
								<p>Once you've filled out the Status and Description fields, click the "Submit issue" button. You're done! Thanks in advance.</p>
								<!--br/-->
								
								<hr />
								<h2 id="Tips">Tips for Writing Bug Reports</h2>
								<p>To help the ProveIt developers fix the bug, please provide enough information for them to reproduce it. This will typically include:</p>
								<ul>
									<li>Your browser and its version.  For example, Firefox 3.6.10, Internet Explorer 8, or Chrome 7.0.517.24</li>
									<li>The article you were editing</li>
									<li>The expected result</li>
									<li>The problem you experienced</li>
								</ul>

								<h2><a href="http://tinyurl.com/proveit-github-issue">Report a Bug Now</a></h2>

							</div><!-- end #mainBody -->
						</td>
						<td id="sideTableofContents"> 
							<h2>Report a Bug </h2>
							<ul>
								<li><a href="#GettingStarted">Getting Started</a></li>
								<li><a href="#Fields">Issue Tracker</a></li>
								<li><a href="#Tips">Tips for Writing Bug Reports</a></li>
								<li><a href="http://tinyurl.com/proveit-github-issue">Report a Bug Now</a></li>
							</ul>
					  </td>
					</tr>
				</table> 


<?php include_once 'footer.php'; ?>
