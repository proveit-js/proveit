$(function() {
	// set up accordion
	$("#accordion").accordion({
		fillSpace: true,
		active: 1 // view references
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
			primary: 'ui-icon-close',
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
			primary: 'ui-icon-arrowthick-1-e',
		},
		text: false
	});

});