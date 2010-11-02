<?php

$page = 'Tutorials';

include_once 'header.php';

?>

			<!-- Main Content Table -->

				<table id="mainTable">
					<tr>
						<td id="mainContent">

							<div id="mainPic" class="tutorials">
								<h1>Tutorials</h1>
							</div><!-- end #mainPic -->
							<div id="mainBody"> 
								<h2>Need Help?</h2>
									<p>Having trouble locating a particular ProveIt feature? Or maybe you simply forgot how to minimize the ProveIt interface? Here are a number of quick reference tutorials to make your ProveIt experience easier.</p>
								<br/>
								
								<hr/>
								<h2> Managing ProveIt </h2>
								<h3 id="Installing">Installing ProveIt</h3>
								<ol>
									<li>Create or Log-In Wikipedia User Account</li>
									<li>Click on the "Edit" button on your Wikipedia User Account Page</li>
									<li>Copy the ProveIt User-Script text from below: 
										<code>importScript('User:ProveIt GT/ProveIt.js');<br />
										// [[User:ProveIt GT/ProveIt.js]]</code> </li>
									<li>Paste ProveIt Script link on Wikipedia User Account --> User Script page</li>
									<li>Click "Save Changes"</li>
								</ol>
									

								<h3 id="Uninstalling">Uninstalling ProveIt</h3>
								<ol>
									<li>Log-In to your Wikipedia User Account</li>
									<li>Locate User-Script Page</li>
									<li>Click Edit</li>
									<li>Delete the ProveIt User-Script text</li>
									<li>Click "Save Changes"</li>
								</ol>
								
								<h3 id="Unpdating">Updating ProveIt</h3>
								<ol>
									<li>ProveIt Updates Automatically</li>
								</ol>
								<br/>
								
								<hr/>
								<h2>ProveIt Interface</h2>
								<h3 id="Showing"> Showing ProveIt </h3>
								<h3 id="Hiding"> Hiding ProveIt </h3>
								<h3 id="Minimizing">Minimizing</h3>
								<ol>
									<li>Click the minimize button (upside-down triangle) in the top-right corner of the ProveIt Interface</li>
								</ol>
								
								<h3 id="Maximizing">Maximizing</h3>
								<ol>
									<li>Click the minimize button (triangle) in the top-right corner of the ProveIt Interface</li>
								</ol>
								<br/>
								
								<hr/>
								<h2>References</h2>
								
								<h3 id="Finding">Finding a Reference</h3>
								<p>ProveIt loads all parseable references in a Wikipedia article -- basically, anything surrounded by <ref> tags. These references appear in a list on ProveIt's References tab, ordered roughly by where they are first cited in the article.</p>
								<ol>
									<li>Click "References" Tab (if unable to see list of references)</li>
									<li>Locate reference of interest in the list of references</li>
									<li>Click the desired reference</li>
									<li>You will be automatically directed to the location of the reference</li>
								</ol>
								
								<h3 id="NumUses">Finding a Specific Citation of a Reference Using its "Number of Uses"</h3>
								<ol>
									<li>Click "References" Tab (if unable to see list of references)</li>
									<li>Locate reference of interest in the list of references</li>
									<li>Click the desired reference</li>
									<li>The reference's "number of uses" should be visible (if any)</li>
									<li>Click the desired letter (a, b, c, d, ....)</li>
									<li>You will be automatically directed to the location of the specific citation</li>
								</ol>

								<h3 id="Adding">Adding a Reference</h3>
								<ol>
									<li>Click the "Add a Reference" Tab</li>
									<li>Select Reference Type from drop-down menu</li>
									<li>Input Information ( required information will be marked <strong>bold</strong> )</li>
									<li>Click "insert into edit form"</li>
								</ol>
								
								<h3 id="Citing">Citing a Reference Using "Insert at Cursor"</h3>
								<ol>
									<li>Click the "References" Tab</li>
									<li>Locate reference of interest in the list of references</li>
									<li>Click the desired reference</li>
									<li>Locate the cursor in the Wikipedia edit form
									<li>Click to place the cursor in the desired location in the edit form (your citation will be placed here) </li>
									<li>Click "insert at cursor"</li>
								</ol>
								<br/>

							</div><!-- end #mainBody -->
						</td>
						<td id="sideTableofContents"> 
							<h2>Contents </h2>
							
							<h3> Managing ProveIt </h3>
							<ul>
								<li><a href="#Installing">Installing ProveIt</a></li>
								<li><a href="#Uninstalling">Uninstalling ProveIt</a></li>
								<li><a href="#Updating">Updating</a></li>
							</ul>
							
							<h3> ProveIt Interface </h3>
							<ul>
								<li
								<li><a href="#Minimizing">Minimizing</a></li>
								<li><a href="#Maximizing">Maximizing</a></li>
							</ul>
							
							<h3> References </h3>
							<ul>
								<li><a href="#Finding">Finding a Reference</a></li>
								<li><a href="#NumUses">...Using "Number of Uses"</a></li>
								<li><a href="#Adding">Adding a Reference</a></li>
								<li><a href="#Citing">...Using "Insert at Cursor"</a></li>
							</ul>
					  </td>
					</tr>
				</table> 

<?php include_once 'footer.php'; ?>
