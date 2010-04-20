$(function() {

	proveit.proveitonload();

	// set up tabs
	$("#tabs").tabs({
		selected: 0,
		show: function(event,ui)
		{
			switch(ui.index)
			{
				case 0: // view
					//$('tr.selected').focus();
					break;

				case 2: // add
					proveit.changeCite(document.getElementById(proveit.togglestyle ? 'citemenu' : 'citationmenu'));
					break;

				case 1: // edit
					// proveit.updateEditPopup();
					$('tr.selected').dblclick();
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
	}).click(function()
	{
		proveit.addPopupRow(document.getElementById("add-tab"));
	}).next().next().button({
		icons: {
			primary: 'ui-icon-circle-check',
			secondary: 'ui-icon-circle-arrow-e'
		}
	}).click(function()
	{
		proveit.addCitation(proveit.citationObjFromAddPopup($('#add-tab .typepane').get(0)));
		$("#tabs").tabs( { selected: '#view-tab' } );
	}).next().button({
		icons: {
			primary: 'ui-icon-circle-close'
		}
	}).click(function()
	{
		$("#tabs").tabs( { selected: '#view-tab' } );
	});

	// cancel buttons
	$("button.cancel").click(
		function() {
			$( "#tabs" ).tabs( "option", "selected", 0 );
		}
	);

	// edit panel buttons
	$("#edit-buttons button:first").button({
		icons: {
			primary: 'ui-icon-circle-plus'
		}
	}).click(function()
	{
		proveit.addPopupRow(document.getElementById("edit-tab"));
	}).next().next().button({
		icons: {
			primary: 'ui-icon-circle-check'
		}
	}).next().button({
		icons: {
			primary: 'ui-icon-circle-close'
		}
	});

	// delete field button
	$("div.input-row .remove").button({
		icons: {
			primary: 'ui-icon-close'
		},
		text: false
	});

	// ibid buttons
	$("td.ibid button").button({
		icons: {
			primary: 'ui-icon-arrowthick-1-e'
		},
		text: false
	});

	// create the minimize button
	$("h1 button").button({
		icons: {
			primary: 'ui-icon-triangle-1-s'
		},
		text: false
	});

	// set up the minimize button
	$("h1 button").toggle(
		function() {
			$("#view-tab, #add-tab, #edit-tab").hide();
			$("h1 button").button("option", "icons", { primary: 'ui-icon-triangle-1-n' } );
			//$("h1 button").refresh();
		},
		function() {
			$("#view-tab, #add-tab, #edit-tab").show();
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

	// make individual refs selectable
	$("#refs tr").click(
		function() {
			proveit.selectRow(this);
		}
	);


	$("#refs tr").eq(0).click().click(); // select first item in list

	// alternate row colors
	$("#refs tr:even").addClass('light');
	$("#refs tr:odd").addClass('dark');
});