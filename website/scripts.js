$(document).ready(function()
{
	$('a.primary-nav-link').mouseover(function() {
		$('ul#primary-nav ul').hide();
		$(this).next('ul').show();
	});

});