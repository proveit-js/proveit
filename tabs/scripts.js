$(function() {
	
	proveit.proveitonload();

	// set up tabs
	$("#tabs").tabs({
		selected: 0,
		select: function(event,ui)
		{
			switch(ui.index)
			{
				case 1: // view
					//$('tr.selected').focus();
					break;
				
				case 2: // add
					break;
				
				case 3: // edit
					// proveit.updateEditPopup();
					break;
				
				default:
					// nothing
			}
		}
	});

	// add panel buttons
	$("#add-buttons button:first").button({
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
	
	// cancel buttons
	$("button.cancel").click(
		function() {
			$("#tabs").tabs( { selected: 0 } );
		}
	);	
	
	// edit panel buttons
	$("#edit-buttons button:first").button({
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
	
	// edit buttons
	$("td.edit button").button({
		icons: {
			primary: 'ui-icon-pencil'
		},
		text: false
	});
	
	// make edit buttons work
	$("button", "td.edit").each(
		function(index) {
			$(this).click (
				function () {
					$("#tabs").tabs( { selected: 2 } );
				}
			);
		}
	);
	
	// ibid buttons
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

	$("#refs tr").click(
		function() {
			proveit.selectRow(this);
		}
	);
	

	
	$("#refs tr").eq(0).click(); // select first item in list

	// alternate row colors
	$("#refs tr:even").addClass('light');
	$("#refs tr:odd").addClass('dark');
});