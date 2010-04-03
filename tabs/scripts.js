$(function() {
	// set up tabs
	$("#tabs").tabs({
		selected: 0
	});

	// add buttons
	$("div#add-buttons button:first").button({
		icons: {
			primary: 'ui-icon-circle-plus'
		}
	}).next().button({
		icons: {
			primary: 'ui-icon-circle-check',
			secondary: 'ui-icon-circle-arrow-e'
		}		
	}).next().button({
		icons: {
			primary: 'ui-icon-circle-close'
		}
	});
	
	// edit buttons
	$("div#edit-buttons button:first").button({
		icons: {
			primary: 'ui-icon-circle-plus'
		}
	}).next().button({
		icons: {
			primary: 'ui-icon-circle-check'
		}		
	}).next().button({
		icons: {
			primary: 'ui-icon-circle-close'
		}
	});	
	
	// delete field button
	$("div.input-row button").button({
		icons: {
			primary: 'ui-icon-close'
		},
		text: false
	});	
	
	// view buttons
	$("td.edit button").button({
		icons: {
			primary: 'ui-icon-pencil'
		},
		text: false
	});
	
	$("td.ibid button").button({
		icons: {
			primary: 'ui-icon-arrowthick-1-e'
		},
		text: false
	});
	
	// minimize
	$("h1 button").button({
		icons: {
			primary: 'ui-icon-triangle-1-s'
		},
		text: false
	});
	
	$("h1 button").toggle(
		function() {
			$("#tabs-1, #tabs-2, #tabs-3").hide();
			$("h1 button").button("option", "icons", { primary: 'ui-icon-triangle-1-n' } );
			//$("h1 button").refresh();
		},
		function() {
			$("#tabs-1, #tabs-2, #tabs-3").show();
			$("h1 button").button("option", "icons", { primary: 'ui-icon-triangle-1-s' } );
			//$("h1 button").refresh();
		}
	);
	
	// show pointers
	// $("td.number button").button({
		// icons: {
			// primary: 'ui-icon-squaresmall-plus'
		// },
		// text: false
	// });
	
	proveit.proveitonload();

});