<?php
    
$page = 'Edit Summary'; // But part of tutorials section 
include_once 'header.php';

?>
    <div id="leadInPic"><img src="img/tutorials_leadIn.jpg" alt="[" /></div>
    
    <div id="mainBody"><p>By default, ProveIt adds an edit summary when you use it to modify references.  If you would prefer not to, follow these instructions:</p>
    <ol>
    <li>Login to Wikipedia.</li>
    <li>Go to your user <a href="http://en.wikipedia.org/wiki/Special:MyPage/skin.js?action=edit">script page</a>.</li>
    <li>Find the line:<br/>
    <code>importScript('User:Superm401/ProveIt.js');</code></li>
    <li>On the following line, add:<br/>
    <code>addOnloadHook(function() { proveit.shouldAddSummary = false; });</code></li>
    <li>If it doesn't take effect immediately, you may want to <a href="http://en.wikipedia.org/wiki/Wikipedia:Bypass_your_cache">bypass your cache</a>.</li>
    </ol>
</div>
    
<?php include_once 'footer.php'; ?>