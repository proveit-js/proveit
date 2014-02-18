					<table id="footer">
						<tr>
							<!-- Footer Logo -->
							<td id="footerLogo">
								<a href="/" ><img src="/img/proveit_logo_small.png" alt="ProveIt logo" height="51" width="163" /></a>
							</td>
							
							<!-- Footer Navigation -->
							<td id="footerNav"> 
								<a href="/users/features"<?php if($page == 'Features') echo ' class="selected"'; ?>>Features</a> -
								<a href="/users/screenshots"<?php if($page == 'Screenshots') echo ' class="selected"'; ?>>Screenshots</a> -
								<a href="/users/guide"<?= $page == 'User Guide' ? ' class="selected"' : '' ?>>User Guide</a> -
								<a href="/users/tutorials"<?php if($page == 'Tutorials') echo ' class="selected"'; ?>>Tutorials</a> -
								<a href="/users/bugreport"<?php if($page == 'Report-a-Bug') echo 'class="selected"'; ?>>Report a Bug</a> -
								<br />
								
								<a href="/demo"<?php if($page == 'Demo') echo ' class="selected"'; ?>>Demo</a> -
								<a href="/install"<?php if($page == 'Install') echo ' class="selected"'; ?>>Install</a> -
								<a href="/yuidocs/index.html">Documentation</a> -
								<a href="https://github.com/proveit-js/proveit"<?php if($page == 'gCode') echo ' class="selected"'; ?>>GitHub Project</a> -
								<a href="https://github.com/proveit-js/proveit/wiki"<?php if($page == 'Wiki') echo ' class="selected"'; ?>>GitHub Wiki</a>
								<br />

								<a href="/about/research"<?php if($page == 'Research') echo ' class="selected"'; ?>>Research</a> -
								<a href="/about/team"<?php if($page == 'The Team') echo ' class="selected"'; ?>>The Team</a> -
								<a href="/about/credits"<?php if($page == 'Credits') echo ' class="selected"'; ?>>Credits</a> -
								<a href="http://www.google.com/recaptcha/mailhide/d?k=018gtRX99FRA2NimJqUPHqyw==&amp;c=_Kwjk_EjaYDNriFFeDTlO0EJWETETrLl5p82YBF9xr0=">Email Us</a>
							</td>
		
							<!-- Footer Credits -->
							<td id="footerCredits"> 
								<a href="http://www.ic.gatech.edu/">Georgia Tech | Interactive Computing</a><br/> 
								<a href="http://www.cc.gatech.edu/elc/">Electronic Learning Communities Lab</a><br/>
								<a href="http://www.google.com/recaptcha/mailhide/d?k=018gtRX99FRA2NimJqUPHqyw==&amp;c=_Kwjk_EjaYDNriFFeDTlO0EJWETETrLl5p82YBF9xr0=">Email Us</a>
							</td>
						</tr>
					</table>
</div><!-- end #superContainer -->
</body>
</html>