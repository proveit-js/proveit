<?php

$page = 'Demo';
include_once 'header.php';

?>
<script src="wikibits.js" type="text/javascript"></script>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js" type="text/javascript"></script>
<script src="http://proveit-js.googlecode.com/hg/ProveIt_Wikipedia.js" type="text/javascript"></script>
<script type="text/javascript">
//<![CDATA[

function loadArticle()
{
  var articleName = $('#articleName').val();
  var apiURL = 'http://en.wikipedia.org/w/api.php?action=query&prop=revisions&titles=' + encodeURIComponent(articleName) + '&rvprop=content&format=json&callback=?';
  $.getJSON(apiURL, function(response)
  {
    if(response.error)
    {
      throw response.error; 
    }
    var pages = response.query.pages;
    for(var key in pages)
    {
      break; // Get first (only) key.  This is necessary due to odd JSON structure.
    }
    var content = pages[key].revisions[0]['*'];
    $('#wpTextbox1').val(content);
    $('#proveit').remove();
    proveit.createGUI();
  });
}

$(function()
{
    loadArticle();
    $('#articleBtn').click(loadArticle);
});
//]]>
</script>
<div id="mainBody">
<label for="articleName">Article name:</label> 
<input id="articleName" size="35" value="Georgia Institute of Technology"/>
<input id="articleBtn" type="button" value="Load page"/><br/>
<span>Article content:</span><br/>
<textarea rows="25" cols="115" style="width: 100%" id="wpTextbox1"></textarea><br/>
</div>
<?php include_once 'footer.php'; ?>
