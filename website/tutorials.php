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
								<h3> Follow Along, Step-by-Step</h3>	
									<p>The following tutorials will use the <a href="http://en.wikipedia.org/w/index.php?title=Georgia_Institute_of_Technology&action=edit&oldid=397007847">Georgia Institute of Technology</a> Wikipedia article as a basis. We recommend that you open <a href="http://en.wikipedia.org/w/index.php?title=Georgia_Institute_of_Technology&action=edit&oldid=397007847">the article</a> in another tab, to follow along with the tutorials below. Though the tutorials will use particular references, all actions are not reference specific (some articles, however, may not have all of the necessary information to use certain features). Simply reproduce these actions for any reference of your choosing, on any Wikipedia article of your choosing.</p>
								
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
								<h3 id="Finding">Finding a Reference</h3>
								<ol>
									<li>Click the "References" tab (if you do not see the list of references in ProveIt)</li>
									<li>Click <i>A Walk Through Tech's History</i>, reference #8, in the list of references</li>
									<li>You will be automatically directed to the location of this reference</li>
								</ol>
								
								<h3 id="SpecfCite">Finding a Specific Citation of a Reference</h3>
								<ol>
									<li>Click the "References" tab (if you do not see the list of references in ProveIt)</li>
									<li>Click <i>A Walk Through Tech's History</i>, reference #8, in the list of references</li>
									<li>You can see that <i>A Walk Through Tech's History</i> has been cited "5 times" -- A, B, C, D, and E</li>
									<li>Click any letter. You will be automatically directed to the location of the specific citation.</li>								
								</ol>

								<hr/>
								<h2>Adding References</h2>
								
								<h3 id="Adding">Adding a New Reference</h3>
								<p> Let's add a new reference to the <a href "http://en.wikipedia.org/w/index.php?title=Georgia_Institute_of_Technology&action=edit&oldid=397007847">Georgia Institute of Technology</a> Wikipedia article from the book <i>The Catcher in the Rye</i> using the following information:</p>
								<code>Salinger, J.D. The Catcher in the Rye. New York: Bantam, 1964.</code>
								<ol>
									<li>Locate the sentence beginning with "The educational institution was founded in 1885 as the Georgia School of Technology..." inside of the Wikipedia edit box</li>
									<li>Click after the word "1885" to place the cursor after "1885"</li>
									<li>Click the "Add a Reference Tab"</li>
									<li>Select "Book" from the <b>Reference Type</b> drop-down menu</li>
									<li>Type "J.D. Salinger" into the <b>Author</b> field</li>
									<li>Type "The Catcher in the Rye" in the <b>Title</b> field</li>
									<li>Type "1964" in the <b>Year</b> field</li>
									<li>Type "Bantam" in the <b>Publisher</b> field</li>
									<li>Type "New York" in the <b>Location</b> field</li>
									<li>Click <strong>insert into edit form</strong> to add the new reference</li>
								</ol>
								
								<h3 id="Citing">Creating a New Citation of an Existing Reference</h3>
								<ol>
									<li>Click the "References" tab (if you do not see the list of references in ProveIt)</li>
									<li>Click <i>A Walk Through Tech's History</i>, reference #8, in the list of references</li>
									<li>Locate the sentence beginning with "The educational institution was founded in 1885 as the Georgia School of Technology..." inside of the Wikipedia edit box</li>
									<li>Click after the word "1885" to place the cursor after "1885"</li>
									<li>Click the <strong>insert this reference at cursor</strong> button to create a new citation of <i>A Walk Through Tech's History</i></li>						
								</ol>
								
								<h3 id="NoCite">No "Insert This Reference At Cursor" Button?</h3>
								<p>If you do not see an <strong>insert this reference at cursor</strong> button, this means that the reference does not have a <b>&lt;ref&gt; name</b>. A <b>&lt;ref&gt; name</b> is an abbreviated name, or shorthand, for a reference.</p>
								<p>Let's start from the reference we created in the <strong>Adding a New Reference</strong> tutorial. Our <i>Catcher in the Rye</i> reference does not have the <strong>insert this reference at cursor</strong> button. We will have to create a <b>&lt;ref&gt; name</b> for this reference.</p>
								
								<ol>
									<li>Find <i>The Catcher in the Rye</i> in the list of references and click it</li>
									<li>Click the <strong>edit this reference </strong> button</li>
									<li>Type "CITR" in the <b>&lt;ref&gt; name</b> field</li>
									<li>Click <strong> update edit form</strong> to save your changes</li>
									<li>Now, When you click on <i>The Catcher in the Rye</i> in the list of references, you should see the <strong> insert the reference at cursor" </strong> button.
								</ol>
								
							<hr/>
							<h2 >Editing References</h2>
								
							<h3 id="Editing"> Editing an Existing Reference </h3>
								<ol>
									<li>Click the "References" Tab (if you do not see a list of references in ProveIt)</li>
									<li>Click <i>Surrender Marker, Fort Hood, Change of Command Marker</i>, reference #9, in the list of references</li>
									<li>Click the <strong>edit this reference </strong> button</li>
									<li>You should see a blue background and various fields filled in with referencing information about <i>Surrender Marker, Fort Hood, Change of Command Marker</i></li>
									<li>Let's change the author from "Lenz" to "Johnathan Doeberman"</li>
									<li>Type <i>Johnathan Doeberman</i> into the "Author" field</li>
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
