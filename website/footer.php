					<table id="footer">
						<tr>
							<!-- Footer Logo -->
							<td id="footerLogo">
								<a href="index.php" ><img src="img/proveit_logo_small.png" alt="ProveIt logo" height="" width="" /></a>
							</td>
							
							<!-- Footer Navigation -->
							<td id="footerNav"> 
								<a href="features.php"<?php if($page == 'Features') echo ' class="selected"'; ?>>Features</a> -
								<a href="screenshots.php"<?php if($page == 'Screenshots') echo ' class="selected"'; ?>>Screenshots</a> -
								<a href="userguide.php"<?= $page == 'User Guide' ? ' class="selected"' : '' ?>>User Guide</a> -
								<a href="tutorials.php"<?php if($page == 'Tutorials') echo ' class="selected"'; ?>>Tutorials</a> -
								<a href="reportabug.php"<?php if($page == 'Report-a-Bug') echo 'class="selected"'; ?>>Report a Bug</a> -
								<br />
								
								<a href="demo.php"<?php if($page == 'Demo') echo ' class="selected"'; ?>>Demo</a> -
								<a href="yuidocs/index.html">Documentation</a> -			
								<a href="http://code.google.com/p/proveit-js/"<?php if($page == 'gCode') echo ' class="selected"'; ?>>Google Code Project</a> -
								<a href="http://code.google.com/p/proveit-js/w/list"<?php if($page == 'Wiki') echo ' class="selected"'; ?>>Wiki</a>
								<br />

								<a href="research.php"<?php if($page == 'Research') echo ' class="selected"'; ?>>Research</a> -
								<a href="theteam.php"<?php if($page == 'The Team') echo ' class="selected"'; ?>>The Team</a>
							</td>
		
							<!-- Footer Credits -->
							<td id="footerCredits"> 
								<a href="http://www.ic.gatech.edu/">Georgia Tech | Interactive Computing</a><br/> 
								<a href="http://www.cc.gatech.edu/elc/">Electronic Learning Communities Lab</a>
							</td>
						</tr>
					</table>
</div><!-- end #superContainer -->
</body>
</html>