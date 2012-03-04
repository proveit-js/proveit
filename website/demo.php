<?php

$page = 'Demo';
include_once 'header.php';

?>
<link type="text/css" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.17/themes/base/jquery-ui.css" rel="Stylesheet" />
<script src="wikibits.js" type="text/javascript"></script>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript"></script>
<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.17/jquery-ui.min.js" type="text/javascript"></script>
<script type="text/javascript">
// wg's deliberately global
wgServer="http://en.wikipedia.org",
wgScriptPath="/w",
wgCanonicalNamespace="",
wgCanonicalSpecialPageName=false,
wgNamespaceNumber=0,
wgAction="edit";
</script>
<script src="http://en.wikipedia.org/w/resources-1.19/resources/jquery/jquery.textSelection.js" type="text/javascript"></script>
<script src="http://proveit-js.googlecode.com/hg/ProveIt_Wikipedia.js" type="text/javascript"></script>
<script type="text/javascript">
//<![CDATA[
proveit.loadMaximized = true;
function loadArticle(articleName)
{
  if(articleName == null)
    articleName = $('#articleName').val();
  else
    $('#articleName').val(articleName);
  
  $('#articleLink').text(articleName).attr('href', wgServer + '/wiki/' + encodeURIComponent(articleName));

  $('#articleName').attr('readonly','readonly');
  $('#articleBtn').attr('disabled','disabled');
  
  var apiURL = 'http://en.wikipedia.org/w/api.php?action=query&prop=revisions&titles=' + encodeURIComponent(articleName) + '&rvprop=content&format=json&callback=?';
  $.getJSON(apiURL, function(response)
  {
    if(response.error)
    {
      throw response.error; 
    }
	else
	{
      $('#articleName').removeAttr('readonly');
      $('#articleBtn').removeAttr('disabled');	  
	}
    var pages = response.query.pages;
    for(var key in pages)
    {
      break; // Get first (only) key.  This is necessary due to odd JSON structure.
    }
    var page = pages[key];
    var content = page.revisions[0]['*'];
    // wg's global 
    wgTitle = page.title;
    wgPageName = page.title.replace(" ", "_");
    $('#wpTextbox1').val(content);
    $('#proveit').remove();
    proveit.createGUI();
  });
  return false;
}

$(function()
{
    jQuery.getScript(proveit.JQUERYUI_SCRIPT_URL, loadArticle);
    $('#demoForm').submit(function(evt){
	            loadArticle();
		    evt.preventDefault();
		});
});
//]]>
</script>
				<table id="mainTable">
					<tr>
						<td id="mainContent">
							<div id="mainBody">
								<h2>Demo</h2> 

								<p>See that cool-looking gadget in the bottom right corner of this window? <strong>That's ProveIt</strong>, and you can test drive it right here with any Wikipedia article. We've preloaded the article on Georgia Tech by default, but if you want to try a different one, just type the article name into the box below and click "Load article."</p>
								<form id="demoForm" action="">
									<fieldset>
										<label for="articleName">Wikipedia article name:</label>
										<input id="articleName" size="35" style="width: 300px;" value="Georgia Institute of Technology"/>
										<input id="articleBtn" type="submit" value="Load article"/>
										<p style="margin: 10px 0 20px 0;">More suggestions: <a href="#" onclick="loadArticle('Tech Tower')">Tech Tower</a> - <a href="#" onclick="loadArticle('ANAK Society')">ANAK Society</a> - <a href="#" onclick="loadArticle('Ramblin\' Wreck')">Ramblin' Wreck</a></p>

										<label for="wpTextbox1"><a id="articleLink"></a> article from Wikipedia:</label>
										<textarea rows="25" cols="115" style="width: 100%" id="wpTextbox1"></textarea>
									</fieldset>
								</form>
								<p>Wikipedia article used and made available under the <a href="http://creativecommons.org/licenses/by-sa/3.0/">Creative Commons Attribution/Share-Alike License 3.0 (Unported)</a>.</p>
							</div>
						</td>
					</tr>
				</table>
<?php include_once 'footer.php'; ?>
