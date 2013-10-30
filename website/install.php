<?php

$page = 'Install';

include_once 'header.php';
?>
	            <script type="text/javascript" src="jquery.ba-hashchange.min.js"></script><!-- Ben Alman's hashchange plugin -->
                <script type="text/javascript">
				//<![CDATA[
					$.getJSON("http://en.wikipedia.org/w/api.php?action=query&meta=siteinfo&siprop=interwikimap&sifilteriw=local&callback=?&format=json",
					function(resp)
					{
					        $(function()
					        {
							$('#enOption').remove();
							var select = $('#language');
							var english = $('#englishInstall');
							var other = $('#nonEnglishInstall');
							var login = $('#login');
							var signup = $('#signup');
							var userScript = $('#userScript');
							var interwikis = resp.query.interwikimap;
							var wikipedias = [];
							select.change(function()
							{
								var wikipedia = wikipedias[select.get(0).selectedIndex];
								var lang = select.val();
								window.location.hash = lang;
								if(lang == 'en')
								{
									english.show();
									other.hide();
								}
								else
								{
									other.show();
									english.hide();
									login.attr('href', wikipedia.url.replace('$1', 'Special:UserLogin'));
									signup.attr('href', wikipedia.url.replace('$1', 'Special:UserLogin?type=signup'));
								}
								userScript.attr('href', wikipedia.url.replace('$1', 'Special:MyPage/common.js?action=edit'));
							});

							for(var i = 0; i < interwikis.length; i++)
							{
								var wiki = interwikis[i];
								if(wiki.url.indexOf("wikipedia") != -1)
								{
									wikipedias.push(wiki);
									select.append($('<option/>', { value: wiki.prefix, text: wiki.language }));
								}
							}
							$(window).hashchange(function()
							{
								var hashLang = window.location.hash.toString();
								/* Language (at least 2 chars + #) specified in hash, or English.
								 * We fire change, since we're modifying the value programatically. */
								select.val(hashLang.length >= 3 ? hashLang.substring(1) : "en").change();
							}).hashchange(); // Trigger manually on load
						});
					});
				//]]>
				</script>
			<!-- Main Content Table -->

				<div id="leadInPic">
					<img src="/img/install.jpg" alt="Install" height="167" width="940" />
				</div>

				<table id="mainTable">
					<tr>
						<td id="mainContent">

							<div id="mainPic" class="install">
								<h1>Install ProveIt</h1>
							</div><!-- end #mainPic -->
							<div id="mainBody">

                                <p>ProveIt is <a href="/users/features#foss">free and open source</a>, and installing it is a piece of cake. Just follow these simple instructions:</p>
                                <p>Language:
                                        <select id="language">
                                            <option id="enOption" value="en">English</option><!-- For validation and fallback -->
										</select>
                                </p>
								<div id="englishInstall">
									<h2>English Wikipedia Installation</h2>
									<p>Note: If you've already installed ProveIt the old way (editing your <a href="http://en.wikipedia.org/w/index.php?title=Special:MyPage/skin.js&action=edit">user script page</a>), delete any ProveIt-related code first.</p>
									 <ol>
										<li><a href="http://en.wikipedia.org/w/index.php?title=Special:UserLogin&returnto=User:ProveIt_GT">Log in</a> to Wikipedia. If you don't have an account, you'll have to <a href="http://en.wikipedia.org/w/index.php?title=Special:UserLogin&type=signup&returnto=User:ProveIt_GT">create one</a>.</li>
										<li>Go to your <a href="http://en.wikipedia.org/wiki/Special:Preferences">preferences page</a>.</li>
										<li>Click the Gadgets tab.</li>
										<li>Find ProveIt under the "Editing gadgets" heading and check the box beside it.</li>
										<li>Click Save at the bottom of the page.</li>
									 </ol>
									<p>That's it! You can start using ProveIt immediately. You can start with <a href="http://en.wikipedia.org/w/index.php?title=Georgia_Institute_of_Technology&action=edit">Georgia Institute of Technology</a> or go to any other Wikipedia article and click the Edit tab.</p>
								</div><!-- #end englishInstall -->
								<div id="nonEnglishInstall">
									<h2>Non-English Wikipedia Installation</h2>
							        <ol>
										<li><strong><a id="login" href="<?php echo htmlspecialchars($login); ?>">Log in</a> to Wikipedia.</strong> If you don't have an account, you'll have to <a id="signup" href="<?php echo htmlspecialchars($signup); ?>">create one</a> to use ProveIt.</li>
										<li><strong>Go to your <a id="userScript" href="http://en.wikipedia.org/w/index.php?title=Special:MyPage/skin.js&amp;action=edit">user script page</a>.</strong> You may have to create this page if it's empty. Also, if you're using Wikipedia's new skin, the page may redirect past some warning text in pink boxes &mdash; this is normal.</li>
										<li><strong>Copy and paste these two lines of code:</strong>
										 <code>
											 mw.loader.load( 'http://en.wikipedia.org/w/index.php?title=User:ProveIt_GT/ProveIt.js&action=raw&ctype=text/javascript' );<br />
											 // [[:en:User:ProveIt GT]]
										 </code>
										  Don't add or modify any other lines unless you know what you're doing.
										</li>
										<li><strong>Save.</strong> You may have to bypass your cache to see the changes.</li>
									</ol>
									<p>That's it! You can start using ProveIt immediately. You can go to any Wikipedia article and click the Edit tab.</p>
								</div><!-- end #nonEnglishInstall -->
							</div><!-- end #mainBody -->
						</td>
						<td id="sideTableofContents">

						<h2>Release Notes</h2>
						<h3>Latest Release</h3>
						<p>version 2.03, released 12/7/2010</p>

						<h3>New in This Release</h3>
						<ul>
							<li>ProveIt now loads minimized by default. To change this, see our <a href="/users/guide">user guide</a>.</li>
						</ul>

						</td>
					</tr>
				</table>

<?php include_once 'footer.php'; ?>
