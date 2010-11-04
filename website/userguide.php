<?php

$page = 'User Guide';

include_once 'header.php';

?>

				<table id="mainTable">
					<tr>
						<td id="mainContent">

							<div id="mainPic" class="userguide">
								<h1>User Guide</h1>
							</div><!-- end #mainPic -->
							<div id="mainBody"> 						
								<h2>General Help</h2>
								<h3>Installing ProveIt</h3>
								<p>Please see our <a href="install.php">ProveIt install guide</a>.</p>
								
								<h3>Showing or Hiding ProveIt</h3>
								<p>Once installed, ProveIt will automatically show itself as soon as you load the Edit page for any Wikipedia article. When you leave that page, ProveIt will automatically hide itself.</p>
								
								<h3>Minimizing or Maximizing ProveIt</h3>
								<p>Occasionally, you may want to manually minimize or maximize ProveIt while on an article's Edit page. To minimize ProveIt, simply click the button in the top right corner of ProveIt. The button has a "down" arrow and is located to the right of the ProveIt logo. ProveIt will immediately go into minimized mode and allow you to focus on editing the article.</p>
								<p>To maximize ProveIt (return it to its original size), simply click the button again.</p>
								
								<h3>Edit Summary Message</h3>
								<p>When you use ProveIt to modify a Wikipedia article, ProveIt appends a short message ("edited with <a href="http://en.wikipedia.org/wiki/User:ProveIt_GT">ProveIt</a>") to the edit summary when you save the changes. This purpose of this message is twofold: (1) to help us do research on how ProveIt is being used, and (2) to raise awareness about ProveIt and attract new users. The message does <em>not</em> appear anywhere in the article itself and is only viewable from the History tab.</p>
								<p>To disable this message:</p>
								    <ol>
									    <li>Log in to Wikipedia.</li>
									    <li>Go to your <a href="http://en.wikipedia.org/wiki/Special:MyPage/skin.js?action=edit">user script page</a>.</li>
									    <li>Find the line:
										    <code>importScript('User:ProveIt_GT/ProveIt.js');</code></li>
									    <li>On the previous line, add:
										    <code>proveit = { shouldAddSummary: false };</code></li>
									    <li>If it doesn't take effect immediately, you may want to <a href="http://en.wikipedia.org/wiki/Wikipedia:Bypass_your_cache">bypass your cache</a>.</li>
								    </ol>

								<hr />
								
								<h2>Reference Help</h2>
								<h3>Selecting a Reference</h3>
								<p>ProveIt loads all parseable references in a Wikipedia article &mdash; basically, anything surrounded by &lt;ref&gt; tags. These references appear in a list on ProveIt's References tab, ordered roughly by where they are first cited in the article.</p>
								<p>To select a reference:</p>
								<ol>
									<li>Make sure you are on the References tab (click it if you aren't).</li>
									<li>Scroll through the list of references until you find the one you want.</li>
									<li>Click the reference. ProveIt will display an expanded view with more information about the reference, including the type, number of citations, author, and year, if available. At the same time, ProveIt will highlight the text of the first citation of the reference in Wikipedia's edit form.</li>
									<li>If the reference is cited multiple times in the article (see <a href="#">below</a>), you can select each citation individually. Just click the corresponding letter of each citation (e.g. A, B, C&hellip;) and ProveIt will highlight the shortened reference text in the Wikipedia edit form.</li>
								</ol>
								
								<h3>Editing a Reference</h3>
								<p>First, make sure you are on the References tab (click it if you aren't). Then, scroll through the list of references until you find the one you want to edit. From here, there are three ways to edit a reference:</p>
								<p><strong>Method 1</strong>: Double-click the reference you want to edit.</p>
								<p><strong>Method 2</strong>: Click the "edit" button (it looks like a pencil) located directly to the right of the reference's title.</p>
								<p><strong>Method 3</strong>: Select a reference using the <a href="#">instructions</a> above. Then click the "edit this reference" button located directly beneath the reference info.</p>
								<p><strong>Note</strong>: If you do not see an edit button, it means the reference is "raw" (doesn't use the Cite or Citation templates). ProveIt does not yet support editing raw references.</p>
								<p>After clicking the edit button, ProveIt will load the Edit pane and populate it with fields contained in the reference. You can change the information in any of these fields by typing in the white boxes.</p>
								<p>To add a field, click the "add field" button and provide a label (left box) and value (right box) in the white boxes that appear. To delete a field, click the "delete field" button (looks like an "&times;") directly to the right of the field. Required fields, indicated by <b>boldface</b> labels, cannot be deleted.</p>
								<p>When you are done editing the reference, click the "update edit form" button. This will cause ProveIt to update the reference text in the Wikipedia edit form. However, please note that your changes will not be saved to the article until you click the "Save page" button on Wikipedia.</p>
								<p>At any time, you can quit editing (your changes won't be saved) by clicking the "cancel" button or one of the tabs at the top of ProveIt.</p>
								
								<h3>Adding a New Reference</h3>
								<p>To add a new reference, first click in the Wikipedia edit form where you want your new reference to appear. Then, click the Add a Reference tab at the top of ProveIt. ProveIt will load the Add pane and populate it with required and optional fields. You can add information in any of these fields by typing in the white boxes.</p>
								<p>By default, the pane is set up for adding a new website-type reference. To add a different type of reference, just click the menu to the right of the "Reference type" label. Choosing a new reference type will automatically load the appropriate required and optional fields.</p> 
								<p>To add a field, click the "add field" button and provide a label (left box) and value (right box) in the white boxes that appear. To delete a field, click the "delete field" button (looks like an "&times;") directly to the right of the field. Required fields, indicated by <b>boldface</b> labels, cannot be deleted.</p>
								<p>When you are done adding information, click the "insert into edit form" button. This will cause ProveIt to insert the text for your new reference where you left your cursor in the Wikipedia edit form. However, please note that your new reference will not be saved to the article until you click the "Save page" button on Wikipedia.</p>
								<p>At any time, you can quit adding a reference by clicking the "cancel" button or the References tab at the top of ProveIt.</p>								
							
								<h3>Citing a Reference</h3>
								<p>Wikipedia allows you to cite a reference more than once (i.e. use the reference multiple times in the article), and so does ProveIt.</p>
								<p>To cite a reference more than once, the reference must have a name. If somebody hasn't already named the reference, you will have to name it. To name the reference, open it in ProveIt's Edit pane using the <a href="#">instructions</a> above and type a short, descriptive name into the white box to the right of the "&lt;ref&gt; name" label. Then click the "update edit form" button.</p>
								<p>To cite a reference:</p>
								<ol>
									<li>Select the reference in ProveIt using the <a href="#">instructions</a> above.</li>
									<li>Click in the Wikipedia edit form where you want the new citation to appear.</li>
									<li>Click the "insert this reference at cursor" button beneath the selected reference info in ProveIt. This will insert the abbreviated reference text into the Wikipedia edit form where you left your cursor. If the insert button doesn't appear, it means the reference is raw or requires a name (see above).</li>
								</ol>
							</div>

						</td>
						<td id="sideTableofContents">&nbsp;  </td>
					</tr>
				</table> 


<?php include_once 'footer.php'; ?>
