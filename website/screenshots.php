<?php

$page = 'Screenshots';

include_once 'header.php';

?>

			<!-- Main Content Table -->

				<div id="leadInPic">
					<img src="img/screenshots_leadIn.jpg" alt="Screenshots" height="167" width="940" />
				</div>

				<table id="mainTable">
					<tr>
						<td id="mainContent">	
							<div id="mainPic" class="screenshots">
								<h1>Screenshots</h1>
							</div><!-- end #mainPic -->						
							<div id="mainBody">
								<p>Click any screenshot to view it at full size.</p>
							
								<h2 id="find-ref">Find and Highlight a Reference</h2>
								<a class="screenshot" href="img/screenshots/proveit-basic.png" target="_blank">
									<img src="img/screenshots/proveit-basic.png" alt="Find and Highlight a Reference" height="467" width="661" />
								</a>						
							
								<h2 id="edit-ref">Edit a Reference</h2>
								<a class="screenshot" href="img/screenshots/proveit-edit.png" target="_blank">
									<img src="img/screenshots/proveit-edit.png" alt="Edit a Reference" height="467" width="661" />
								</a>
								
								<h2 id="add-ref">Add a New Reference</h2>
								<a class="screenshot" href="img/screenshots/proveit-add.png" target="_blank">
									<img src="img/screenshots/proveit-add.png" alt="Add a New Reference" height="467" width="661" />
								</a>							

								<h2 id="minimize-proveit">Minimize ProveIt</h2>
								<a class="screenshot" href="img/screenshots/proveit-minimized.png" target="_blank">
									<img src="img/screenshots/proveit-minimized.png" alt="Minimize ProveIt" height="467" width="661" />
								</a>
							</div>							
						</td>
						<td id="sideTableofContents"> 
							<h2> Browse Images</h2>
							<h3>Screenshots</h3>
							<ul>
								<li><a href="#find-ref">Find and Highlight a Reference</a></li>
								<li><a href="#edit-ref">Edit a Reference</a></li>
								<li><a href="#add-ref">Add a New Reference</a></li>
								<li><a href="#minimize-proveit">Minimize ProveIt</a></li>
							</ul>
					  </td>
					</tr>
				</table> 


<?php include_once 'footer.php'; ?>
