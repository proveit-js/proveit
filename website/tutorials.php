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
									<p>Having trouble with a ProveIt feature? Or maybe you forgot something? Here are a number of quick reference tutorials for making your ProveIt experience easier. If you need additional help, please visit our <a href="userguide.php">User Guide</a> page for more in-depth explanations.</p>
								
								<hr/>
								<h2> Managing ProveIt </h2>
								<h3 id="InstallUninstall">Install/Uninstalling ProveIt</h3>
								<p>Please see our <a href="install.php">ProveIt install guide</a>.</p> 
								
								<h3 id="Updating">Updating ProveIt</h3>
								<p>ProveIt updates automatically, so you don't have to worry about it.</p>
								
								<hr/>
								<h2>ProveIt Interface</h2>
								<h3 id="ShowHide"> Show/Hiding ProveIt </h3>
								<ol>
									<li>Once installed, ProveIt will automatically show itself as soon as you load the "Edit" page for any Wikipedia article</li>
									<li>To hide ProveIt, simply leave the "Edit" page</li>
								</ol>
							
								<h3 id="MaxMin">Max/Minimizing</h3>
								<ol>
									<li>Click the maximize/minimize button (triangle) in the top-right corner of the ProveIt Interface</li>
								</ol>
								
								<hr/>
								<h2>Locating References</h2>
								<p>We will use the book <i>The Catcher in the Rye</i> by J.D. Salinger as an example for the following tutorials.</p>
								<h3 id="Finding">Finding a Reference</h3>
								<ol>
									<li>Click the "References" tab (if you do not see a list of references in ProveIt)</li>
									<li>Find "The Catcher in the Rye" in the list of references and click it</li>
									<li>You will be automatically directed to the location of the reference</li>
								</ol>
								
								<h3 id="SpecfCite">Finding a Specific Citation of a Reference</h3>
								<ol>
									<li>Click the "References" tab (if you do not see a list of references in ProveIt)</li>
									<li>Find "The Catcher in the Rye" in the list of references and click it</li>
									<li>If <i>The Catcher in the Rye</i> has been cited more than once, look for "This reference is cited in the article # times"</li>
									<li>Each letter in this list represents one citation of <i>The Catcher in the Rye</i> in the Wikipedia article</li>
									<li>Click the desired letter</li>
									<li>You will be automatically directed to the location of the specific citation</li>
								</ol>

								<hr/>
								<h2>Adding References</h2>
								
								<h3 id="Adding">Adding a New Reference</h3>
								<p> Say you only have the following information for the book <i>The Catcher in the Rye</i> by J.D. Salinger:</p>
								<code>Salinger, J.D. The Catcher in the Rye. New York: Bantam, 1964.</code>
								<p> Since the only information required for a book reference is its Title, so you have more than enough information to create a competent reference using ProveIt.</p>
								<ol>
									<li>Click the "Add a Reference" tab</li>
									<li>Select "Book" from the "Reference Type" drop-down menu</li>
									<li>Type <i>J.D. Salinger</i> into the "Author" field</li>
									<li>Type <i>The Catcher in the Rye</i> in the "Title" field</li>
									<li>Type <i>1969</i> in the "Year" field</li>
									<li>Type <i>Bantam</i> in the "Publisher" field</li>
									<li>Type <i>New York</i> in the "Location" field</li>
									<li>Make sure that the cursor in the Wikipedia edit box is in the location where you want to make the first citation of <i>The Catcher in the Rye</i>
									<li>Click <strong>insert into edit form</strong> to add your new reference</li>
								</ol>
								
								<h3 id="Citing">Creating a New Citation of an Existing Reference</h3>
								<ol>
									<li>Click the "References" tab (if you do not see a list of references in ProveIt)</li>
									<li>Find "The Catcher in the Rye" in the list of references and click it</li>
									<li>Make sure that the cursor in the Wikipedia edit box is in the location where you want to make a new citation of <i>The Catcher in the Rye</i>
									<li>Click <strong>insert this reference at cursor</strong> to create a new citation of <i>The Catcher in the Rye</i></li>						
								</ol>
								
								<h3 id="NoCite">No "Insert This Reference At Cursor" Button?</h3>
								<p>If you do not see an <strong>insert this reference at cursor</strong> button, this means that the reference does not have a "&lt;ref&gt; name". A "&lt;ref&gt; name" is an abbreviated name, or shorthand, for a reference.</p>
								<p>Say the <i>Catcher in the Rye</i> reference does not have the <strong>insert this reference at cursor</strong> button. We will have to create a "&lt;ref&gt; name" for this reference.</p>
								
								<ol>
									<li>Find "The Catcher in the Rye" in the list of references and click it</li>
									<li>Click the <strong>edit this reference </strong> button</li>
									<li>Type <i>CITR</i> in the "&lt;ref&gt; name" field</li>
									<li>Click <strong> update edit form</strong> to save your changes</li>
								</ol>
								
							<hr/>
							<h2 >Editing References</h2>
								
							<h3 id="Editing"> Editing an Existing Reference </h3>
								<ol>
									<li>Click the "References" Tab (if you do not see a list of references in ProveIt)</li>
									<li>Find "The Catcher in the Rye" in the list of references and click it</li>
									<li>Click the <strong>edit this reference </strong> button</li>
									<li>You should see a blue background and various fields filled in with referencing information about <i> The Catcher in the Rye</i></li>
									<li>Type your changes in the corresponding fields (Title, Author, Publisher, etc...)</li>
									<li>Click <strong> update edit form</strong> to save your changes</li>
								</ol>		
								
							</div><!-- end #mainBody -->
						</td>
						<td id="sideTableofContents"> 
							<h2>Contents </h2>
							
							<h3> Managing ProveIt </h3>
							<ul>
								<li><a href="#InstallUninstall">Install/Uninstalling ProveIt</a></li>
								<li><a href="#Updating">Updating</a></li>
							</ul>
							
							<h3> ProveIt Interface </h3>
							<ul>
								<li
								<li><a href="#ShowHide">Show/Hide ProveIt</a></li>
								<li><a href="#MaxMin">Maximizing/Minimizing ProveIt</a></li>
							</ul>
							
							<h3> Finding References</h3>
							<ul>
								<li><a href="#Finding">Finding a Reference</a></li>
								<li><a href="#SpecfCite">Finding a Specific Citation</a></li>
							</ul>
							
							<h3> Adding References </h3>
							<ul>
								<li><a href="#Adding">Adding a Reference</a></li>
								<li><a href="#Citing">Create a Citation</a></li>
								<li><a href="#NoCite">No "insert this reference at cursor"?</a></li>
							</ul>
							
							<h3> Editing References </h3>
							<ul>
								<li><a href="#Editing">Editing a Reference</a></li>
							</ul>
					  </td>
					</tr>
				</table> 

<?php include_once 'footer.php'; ?>
