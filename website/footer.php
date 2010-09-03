				<div class="borderLine footer"></div> 
		
				<div id="footerContainer"> 
					<table width="960" border="0" cellspacing="0" cellpadding="0" style="color: #fff; ">
						<tr>
							<!-- Footer Logo -->
							<td style="width: 150px;"> <a href="index.php" > <img src="img/proveit_logo_small.png" alt="ProveIt logo" /> </a>
							</td>
							
							<!-- Footer Navigation -->
							<td> 
								<div id="footerNav">
									<span style="color:#FFF; padding-right:10px;"> USERS</span>
									<a href="features.php" class="footerNavLink<?= $page == 'Features' ? ' selected' : '' ?>">Features</a> -
									<a href="" class="footerNavLink">Screenshots</a> -
									<a href="tutorials.php" class="footerNavLink<?php if($page == 'Tutorials') echo ' selected'; ?>">Tutorials</a> -
									<a href="" class="footerNavLink">Report a Bug</a>
									
									<br/><span style="color:#FFF; padding-right:10px;">DEVELOPERS </span>
									<a href="" class="footerNavLink">Google Code Home </a> -
									<a href="" class="footerNavLink">Documentation</a> -
									<a href="" class="footerNavLink"> Wiki </a> 
									   
									<br/><span style="color:#FFF; padding-right:10px;">ABOUT US </span>
									<a href="" class="footerNavLink">Research </a> -
									<a href="" class="footerNavLink">The ProveIt Team</a>
								</div>
							</td>
		
							<!-- Footer Credits -->
							<td style="width: 274px;"> 
								<div id="footerCredits"> <a href="" class="footerLink"> Georgia Tech | Interactive Computing</a><br/> 
								<a href="" class="footerLink"><span style="color:#fddb00"> Electronic Learning Communities Lab </span></a></div> 
							</td>
						</tr>
					</table>
				</div>
</div><!-- end #superContainer -->
</body>
</html>