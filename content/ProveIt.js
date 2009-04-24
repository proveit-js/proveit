/*
 * Copyright 2008, 2009
 *
 * Georgia Tech Research Corporation
 *
 * Atlanta, GA 30332-0415
 *
 * ALL RIGHTS RESERVED
 */

var com;
if (!com)
	com = {};
else if (typeof com != "object")
	throw new Error("com already exists and is not an object!");
if (!com.elclab)
	com.elclab = {};
else if (typeof com.elclab != "object")
	throw new Error("com.elclab already exists and is not an object!");
if (com.elclab.proveit)
	throw new Error("com.elclab.proveit already exists");

com.elclab.proveit = {

	// Constants for a progress listener.
	NOTIFY_STATE_DOCUMENT : Components.interfaces.nsIWebProgress.NOTIFY_STATE_DOCUMENT,
	STATE_START : Components.interfaces.nsIWebProgressListener.STATE_START,
	STATE_STOP : Components.interfaces.nsIWebProgressListener.STATE_STOP,

	// Currently requires you be on one of these hard-coded domains.
	knownSites : ["wiktionary.org",	"wikipedia.org", "wikinews.org"],

	// Preferences object (nsIPrefBranch)
	prefs : null,

	LANG : "en", // currently used only for descriptions.

	logEnum :
	{
		console : 0,
		alert: 1
	},

	logType : 0, // apparently this can not be set to a previous variable.
	             // It only seemed to work before because it interpreted window.alert when I meant logEnum.alert

	// Convenience log function
	log : function(str)
	{
		if(com.elclab.proveit.logType == com.elclab.proveit.logEnum.alert)
			alert(str);
		else
		{
			var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
                                 .getService(Components.interfaces.nsIConsoleService);
  			consoleService.logStringMessage(str);
		}
	},

	// Returns true if we are on a known domain, and the action is set to edit or submit
	isMediaWikiEditPage : function ()
	{
		var isMediaWiki = null;
		var url = top.getBrowser().currentURI;
		//com.elclab.proveit.log("url: " + url.spec);

		//com.elclab.proveit.log("Entering isMediaWikiEditPage");
		var found = false;
		var i = 0;
		var host;
		try
		{
			host = url.host;
		}
		catch(NS_ERROR_FAILURE)
		{
			host = null;
			//com.elclab.proveit.log("isMediaWikiEditPage: Invalid hostname.");
			return false;
		}
		var path = url.path;

		//com.elclab.proveit("host: " + host);

		while(!found && i < com.elclab.proveit.knownSites.length)
		{
			if(host.indexOf(com.elclab.proveit.knownSites[i]) != -1)
				found = true;
			i++;
		}

		var correctAction;

		if(found)
		{
			// FIX
			// This means the page can change without the location changing (e.g. action=submit -> action=submit).

			correctAction = (path.indexOf("action=edit") != -1) || (path.indexOf("action=submit") != -1);
			if(correctAction)
				isMediaWiki = true;
		}
		else
		{
			isMediaWiki = false;
		}

		//com.elclab.proveit.log("host: " + host);
		//com.elclab.proveit.log("isMediaWiki: " + isMediaWiki);
        return isMediaWiki;
	},

	/* If we are currently on a MediaWiki page as determined by isMediaWikiEditPage()
	   open the sidebar.
	*/
	openOnlyForMediawiki : function ()
	{
		//com.elclab.proveit.log("Entering openOnlyForMediawiki");
		//com.elclab.proveit.log("windURL: " + windURL.spec);

		if(!com.elclab.proveit.isMediaWikiEditPage())
        {
        	//com.elclab.proveit.log("Not MediaWiki");
	    	com.elclab.proveit.closeSidebar();
		}
        else
        {
        	//com.elclab.proveit.log("Is MediaWiki");
        	//if(!isOpen)
        	com.elclab.proveit.openSidebar();
	    }
	},

	/*
	 * This is a global to hold the list of citations, As it needs to be seen by
	 * all methods for this page, globality is necessary.
	 */
	currentScan : [],

	/*
	 * onload and onunload event handlers tied to the sidebar. These tie the
	 * event handler into the browser and remove it when finished.
	 */

	//From http://developer.mozilla.org/en/Code_snippets/Sidebar
	setSidebarWidth : function(width)
	{
  		window.top.document.getElementById("sidebar-box").width = width;
	},

	// Default width, which should be big enough to prevent being cut off.
	DEFAULT_SIDEBAR_WIDTH : 300,

	/*
	 * Sets sidebar to hopefully sufficient default width, because resize will be disabled.
	 */
	setDefaultSidebarWidth : function()
	{
		com.elclab.proveit.setSidebarWidth(com.elclab.proveit.DEFAULT_SIDEBAR_WIDTH);
	},


	/*
	 * Removes splitter, disabling resize, to avoid awkward GUI behavior
	 */
	disableResize : function()
	{
		 com.elclab.proveit.setDefaultSidebarWidth();
		 var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
		 .getInterface(Components.interfaces.nsIWebNavigation)
 		 .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
         .rootTreeItem
         .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
         .getInterface(Components.interfaces.nsIDOMWindow);
         mainWindow.document.getElementById("sidebar-splitter").hidden = true;
	},

	/*
	 * Make splitter visible again.  Meant to be called upon unload.
	 */

	enableResize : function()
	{
		var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
		 .getInterface(Components.interfaces.nsIWebNavigation)
 		 .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
         .rootTreeItem
         .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
         .getInterface(Components.interfaces.nsIDOMWindow);
         mainWindow.document.getElementById("sidebar-splitter").hidden = false;
	},

	//isSidebarOpenBool : false, // keep track of toggling via variable rather than URL.

	// Convenience function.  Returns the sidebar's document object.
	getSidebarDoc : function()
	{
		return window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
		 .getInterface(Components.interfaces.nsIWebNavigation)
 		 .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
         .rootTreeItem
         .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
         .getInterface(Components.interfaces.nsIDOMWindow).document.getElementById("sidebar").contentWindow.document;
	},

	// Convenience function.   Returns the refbox element.
	getRefbox : function()
	{
		return com.elclab.proveit.getSidebarDoc().getElementById("refbox");
	},

	/*
	 * Returns true if and only if ProveIt sidebar is open.
	 */
	isSidebarOpen : function()
	{
		//com.elclab.proveit.log("Entering isSidebarOpen.");
		var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
			 .getInterface(Components.interfaces.nsIWebNavigation)
			 .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
			 .rootTreeItem
			 .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
			 .getInterface(Components.interfaces.nsIDOMWindow);

		//com.elclab.proveit.log("hidden: " + mainWindow.document.getElementById("sidebar-box").hidden);

		//var isOpen = (location.href == "chrome://proveit/content/ProveIt.xul");
		// Above line WILL NOT always work, because context of location.href varies.

		var loc = document.getElementById("sidebar").contentWindow.location.href;
		var isOpen = (loc == "chrome://proveit/content/ProveIt.xul");
		//com.elclab.proveit.log("location is: " + loc);

		//var isOpen = com.elclab.proveit.isSidebarOpenBool;

		//com.elclab.proveit.log("isOpen: " + isOpen);

		return isOpen;
	},

	// Ensures ProveIt sidebar is open.
	openSidebar : function()
	{
		var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
			 .getInterface(Components.interfaces.nsIWebNavigation)
			 .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
			 .rootTreeItem
			 .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
			 .getInterface(Components.interfaces.nsIDOMWindow);
		//com.elclab.proveit.log("Entering openSidebar");
		mainWindow.toggleSidebar("viewProveItSidebar", true);
		//com.elclab.proveit.isSidebarOpenBool = true;
	},

	// Ensures ProveIt sidebar is closed.

	closeSidebar : function()
	{
		//com.elclab.proveit.log("Entering closeSidebar");

		var isOpen = com.elclab.proveit.isSidebarOpen();
		if(isOpen)
		{
			//com.elclab.proveit.log("Attemping to close sidebar.");
			//toggleSidebar("viewProveItSidebar");
			//top.getBrowser().toggleSidebar();

			var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
			 .getInterface(Components.interfaces.nsIWebNavigation)
			 .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
			 .rootTreeItem
			 .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
			 .getInterface(Components.interfaces.nsIDOMWindow);

			 //mainWindow.document.getElementById("sidebar-box").hidden = true;
			 //mainWindow.document.getElementById("sidebar").hidden = true;

			 mainWindow.toggleSidebar("viewProveItSidebar");
			 //com.elclab.proveit.log("Setting isSidebar false");
			 //com.elclab.proveit.isSidebarOpenBool = false;
		}
	},

	/*
	blurSidebar : function()
	{
		var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
			 .getInterface(Components.interfaces.nsIWebNavigation)
			 .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
			 .rootTreeItem
			 .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
			 .getInterface(Components.interfaces.nsIDOMWindow);
		mainWindow.document.getElementById("sidebar").blur();
		mainWindow.document.getElementById("sidebar-box").blur();
	},
	*/

	// Hard coded constant representing the number of vertical pixels half of textarea takes place.
	HALF_EDIT_BOX_IN_PIXELS : 204,

	// Highlights a given string in the MediaWiki edit box.
	highlightTargetString : function(target)
	{
		//com.elclab.proveit.log("Entering highlightTargetString");
		var t = com.elclab.proveit.getMWEditBox();
		var origText = t.value;
		var startInd = origText.indexOf(target);
		if(startInd == -1)
		{
			//com.elclab.proveit.log("Target string not found!");
			//com.elclab.proveit.log("target: " + target);
			return false;
		}
		var endInd = startInd + target.length;
		t.value = origText.substring(0, startInd);
		t.scrollTop = 1000000; //Larger than any real textarea (hopefully)
		var curScrollTop = t.scrollTop;
		t.value += origText.substring(startInd);
		if(curScrollTop > 0)
		{
			t.scrollTop = curScrollTop + com.elclab.proveit.HALF_EDIT_BOX_IN_PIXELS;
		}
		t.focus();
		t.setSelectionRange(startInd, endInd);
		//alert(curScrollTop);
	},

	// Conveience function.  Returns MediaWiki text area.
	getMWEditBox : function()
	{
		if (top.window.content.document.getElementById('wikEdTextarea')) {
			textareaname = "wikEdTextarea";
		}
		else if (top.window.content.document.getElementById('wpTextbox1')) {
			textareaname = "wpTextbox1";
		}
		else
		{
			return null;
		}

		return top.window.content.document.getElementById(textareaname);
	},

	// Returns edit form DOM object

	getEditForm : function()
	{
		return top.window.content.document.getElementById("editform");
	},

	// Runs a given function on submission of edit form
	addOnsubmit : function(subFunc)
	{
		//com.elclab.proveit.log("Entering addOnsubmit.");
		var form = com.elclab.proveit.getEditForm();
		if(!form)
		{
			throw new Error("No edit form, possibly due to protected page.");
		}
		form.addEventListener("submit", subFunc, false);
	},

	// Returns edit summary DOM object

	getEditSummary : function()
	{
		return top.window.content.document.getElementById("wpSummary");
	},

	/* Keep track of whether we have already added an onsubmit function to include ProveIt in the summary.
	 * This guarantees the function will not be run twice.
	 */
	summaryActionAdded : false,

	/** Does the user want us to ever add summary actions?
	 */
	shouldAddSummary : null,

	/* Specifies to include ProveIt edit summary on next save.
	 * Can be disabled by modifying shouldAddSummary
	 */
	includeProveItEditSummary : function()
	{
		if(com.elclab.proveit.shouldAddSummary && !com.elclab.proveit.summaryActionAdded)
		{
			try
			{
				com.elclab.proveit.addOnsubmit(function()
				{
					var summary = com.elclab.proveit.getEditSummary(); // Surprisingly, this works.

					if(summary.value.indexOf("ProveIt") == -1)
					summary.value = summary.value + " (edited by [[User:Superm401/ProveIt|Proveit]])";
					/*
					else
					{
						com.elclab.proveit.log("ProveIt already in summary.");
					}
					 */
				});
				com.elclab.proveit.summaryActionAdded = true;
			}
			catch(e)
			{
				com.elclab.proveit.log("Failed to add onsubmit handler. e.message: " + e.message);
			}
		}
		/*
		else
		{
			com.elclab.proveit.log("Not adding to summary.");
			com.elclab.proveit.log("com.elclab.proveit.shouldAddSummary: " + com.elclab.proveit.shouldAddSummary);
			com.elclab.proveit.log("com.elclab.proveit.prefs.getBoolPref(\"shouldAddSummary\"): " + com.elclab.proveit.prefs.getBoolPref("shouldAddSummary"));
 		}
		 */
	},

	// This function sets things up so ProveIt will automatically load on a MediaWiki site.
	proveitpreload : function()
	{
		//com.elclab.proveit.log("Entering proveitpreload.")
		top.getBrowser().addProgressListener(com.elclab.proveit.sendalert,
				com.elclab.proveit.NOTIFY_STATE_DOCUMENT);
		return true; // Is this necessary to ensure Firefox doesn't gray out buttons?
	},

	// Runs when we actually want to load the sidebar
	proveitonload : function() {
		//com.elclab.proveit.isSidebarOpenBool = true;
		//com.elclab.proveit.log("Loading ProveIt.");
		com.elclab.proveit.disableResize();
		com.elclab.proveit.getSidebarDoc().getElementById("edit").openPopup(
				com.elclab.proveit.getRefbox(), "end_before", 0, 0, false,
				false);
		com.elclab.proveit.getSidebarDoc().getElementById('edit').hidePopup();
		com.elclab.proveit.prefs = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
			.getBranch("com.elclab.proveit.");
		com.elclab.proveit.prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);
		//com.elclab.proveit.log("About to add observer.  What's this then?: " + this);
		com.elclab.proveit.prefs.addObserver("", com.elclab.proveit, false);
		com.elclab.proveit.shouldAddSummary = com.elclab.proveit.prefs.getBoolPref("shouldAddSummary");
		//com.elclab.proveit.log("com.elclab.proveit.shouldAddSummary: " + com.elclab.proveit.shouldAddSummary);

		com.elclab.proveit.summaryActionAdded = false;

		// We use click because of event bubbling.
		// If we use select here, we can't process insert image click before processing select.
		/*
		com.elclab.proveit.getRefbox().addEventListener("click", function() {
			com.elclab.proveit.doSelect();
		}, false);
		*/

		if(com.elclab.proveit.isMediaWikiEditPage())
		{
			//com.elclab.proveit.log("Calling scanRef from proveitonload.");
			com.elclab.proveit.scanRef();
		}

		// Load initial box for add new cite.
		com.elclab.proveit.changeCite(com.elclab.proveit.getSidebarDoc().getElementById("citemenu"));

		return true;
	},

	// Runs when the sidebar is being unloaded.
	proveitonunload : function() {
		com.elclab.proveit.enableResize();
		//top.getBrowser().removeProgressListener(com.elclab.proveit.sendalert);
		//com.elclab.proveit.isSidebarOpenBool = false;
	},

	// Toggles the sidebar closed then open to avoid inconsistent state.
	respawn : function()
	{
		//com.elclab.proveit.log("Entering respawn.")
		window.setTimeout(function()
		{
			var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
			 .getInterface(Components.interfaces.nsIWebNavigation)
			 .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
			 .rootTreeItem
			 .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
			 .getInterface(Components.interfaces.nsIDOMWindow);
			mainWindow.toggleSidebar("viewProveItSidebar");
			mainWindow.toggleSidebar("viewProveItSidebar");
			/*Before, this had no mainWindow, which meant it never executed
			(if it tried to, it wouldn't have worked).*/
		}, 0);
	},

	observe : function(subject, topic, data)
	{
		if (topic == "nsPref:changed" && data == "shouldAddSummary")
     		{
     		        com.elclab.proveit.log("Preference change detected.");
     			com.elclab.proveit.shouldAddSummary = com.elclab.proveit.prefs.getBoolPref("shouldAddSummary");
     			com.elclab.proveit.log("com.elclab.proveit.shouldAddSummary: " + com.elclab.proveit.shouldAddSummary + "\n"
     				 + "com.elclab.proveit.prefs.getBoolPref(\"shouldAddSummary\"): "
     				 + com.elclab.proveit.prefs.getBoolPref("shouldAddSummary"));
     		}
	},


	/**
	 * A progress listener that catches events to drive the reloading of the
	 * citation list.
	 *
	 * @type {}
	 */
	sendalert : {
		onLocationChange : function(aProgress, aRequest, aURI) {
			//com.elclab.proveit.log("sendalert.onLocationChange");
			//if (!aProgress.isLoadingDocument) {
				// this checks to see if the tab is changed, the isloading check
				// is
				// to keep us from double firing in the event the page is still
				// loading, we will then use the state_stop in statechange.

				/*
				 	var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                   .getInterface(Components.interfaces.nsIWebNavigation)
                   .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
                   .rootTreeItem
                   .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                   .getInterface(Components.interfaces.nsIDOMWindow);
                */
				//var windURL = top.getBrowser().currentURI; //get curURL
				//com.elclab.proveit.log("Test");

				com.elclab.proveit.openOnlyForMediawiki();
				if(com.elclab.proveit.isSidebarOpen())
				{
					//com.elclab.proveit.log("Reloading sidebar from onLocationChange.")
					com.elclab.proveit.respawn();
				}
				//com.elclab.proveit.proveitonload();

				if(com.elclab.proveit.isMediaWikiEditPage())
					com.elclab.proveit.scanRef();

				/*
				com.elclab.proveit.log("Calling highlightTargetString");
				com.elclab.proveit.highlightTargetString("<ref");
				*/


			/*}
			else
			{
				com.elclab.proveit.log("onLocationChange: Still loading.")
			}*/
		},
		onStateChange : function(aProgress, aRequest, aFlag, aStatus) {
			//com.elclab.proveit.log("sendalert.onStateChange");
		        try
			{
				if ((aFlag & com.elclab.proveit.STATE_STOP) && aRequest && aRequest != null && (aRequest.URI)
					&& (aRequest.URI.host == top.getBrowser().currentURI.host)
					&& (aRequest.URI.path == top.getBrowser().currentURI.path)) {
					// LoadWikiPage(aRequest.URI.spec,
					// aProgress.DOMWindow.top._content.document.title,
					// aProgress.DOMWindow.top._content.document.referrer);
					// ^for figuring out what the inputs are
					// this is called when a page finishes loading, call the
					// scan/add
					// function from here

					com.elclab.proveit.openOnlyForMediawiki();
					if(com.elclab.proveit.isMediaWikiEditPage())
					{
						//com.elclab.proveit.log("Calling scanRef from onStateChange.");
						com.elclab.proveit.scanRef();
					}
					/*
					 com.elclab.proveit.log("Calling highlightTargetString");
					 com.elclab.proveit.highlightTargetString("<ref");
					 */
				}
				if (aFlag & com.elclab.proveit.STATE_START) {
					// do nothing here, this is just deprecated or possibly a call
					// to
					// wipe the current list.
				}
			}
			catch(e if e.name == "NS_ERROR_FAILURE")
			{
				com.elclab.proveit.log("Was unable to determine hostname or path of either path or request. e.message: " + e.message + ". Returning from onStateChange now.");
				return false;
			}
			catch(e)
			{
				com.elclab.proveit.log("Unknown exception.  e.name: " + e.name + ". e.message: " + e.message + ". Returning from onStateChange now.");
				return false;
			}
		},
		onSecurityChange : function(aWebProgress, aRequest, aState) {
			//com.elclab.proveit.log("sendalert.onSecurityChange");
		},
		onStatusChange : function(aWebProgress, aRequest, aStatus, aMessage) {
			//com.elclab.proveit.log("sendalert.onStatusChange");
		},
		onProgressChange : function(aWebProgress, aRequest, aCurSelfProgress,
				aMaxSelfProgress, aCurTotalProgress, aMaxTotalProgress) {
				//com.elclab.proveit.log("sendalert.onProgressChange");
		},
		onLinkIconAvailable : function(a, b) {
			//com.elclab.proveit.log("sendalert.onLinkIconAvailable");
		}
	},

	/*
	 * This function is designed to clear the richlistbox in preparation for
	 * loading a new page. It is simply a recursive call to remove all children
	 * from any nodes inside the richlist box, Garbage collection should then
	 * easily wipe them. Then we clear the scanref list to get rid of the
	 * meta-data as well.
	 */

	clearlist : function() {
		//com.elclab.proveit.log("Entering clearList.");
		// var deletion = function(box) {
		// for (var i = 0; i < box.childNodes.length; i++) {
		// // deletion(box.childNodes[i]);
		// box.removeChild(box.childNodes[i]);
		// }
		// }
		var box = com.elclab.proveit.getRefbox();
		if(box == null)
		{
			//com.elclab.proveit.log("Ref box is not loaded yet.");
			return false;
		}
		var size = box.childNodes.length;
		// com.elclab.proveit.log(size);
		for (var i = 0; i < size; i++) {
			var item = box.removeItemAt(box.getIndexOfItem(box.childNodes[0]));
			// com.elclab.proveit.log("Deleting #" + i + ": " + item.id);
			// com.elclab.proveit.log(size);
		}
		//com.elclab.proveit.log("Clearing currentScan and currentrefs");

		com.elclab.proveit.currentScan = [];
		com.elclab.proveit.currentrefs = [];
	},

	/**
	 * Gets insertion text from reference object.
	 * @param {Reference to insert} ref
	 * @param {If full is true, insert full text, otherwise ref name only} full
	 */
	getInsertionText : function(ref, full)
	{
		//com.elclab.proveit.log("Entering getInsertionText.")
		// Adapted from dispSelect
		var textToInsert = "";
		if (ref) {
			//var name = com.elclab.proveit.getRefbox().selectedItem.id;
			if (full) {
				// com.elclab.proveit.log(name);
				/*textToInsert = com.elclab.proveit.currentrefs[name]
						.toString();*/
				textToInsert = ref.toString();
			} else {
				//if (com.elclab.proveit.currentrefs[name].name) {
				if (ref.name) {
					textToInsert = "<ref name=\""
							+ ref.name + "\" />";
				} else {
					//com.elclab.proveit.log("Ref lacks name.  Returning empty insertion text");
					textToInsert = "";
				}
			}

		}
		else
		{
			//com.elclab.proveit.log("Invalid item.  Returning empty insertion text");
			textToInsert = "";
		}

		return textToInsert;
	},

	/** Does insertion into edit box.
	 * @param ref Reference to insert
	 * @param full Whether to insert the full text.
	 */
	insertRef : function(ref, full)
	{
		//com.elclab.proveit.log("Entering insertRef.");
		var txtarea = com.elclab.proveit.getMWEditBox();
		if(!txtarea)
		{
			return false;
		}
		var sel = com.elclab.proveit.getInsertionText(ref, full);

		// var start = top.window.content.document
		// .getElementById(textareaname).selectionStart;
		// var end =
		// top.window.content.document.getElementById(textareaname).selectionEnd;
		// top.window.content.document.getElementById(textareaname).value =
		// base
		// .substring(0, start)
		// + sel + base.substring(end, base.length);
		// top.window.content.document.getElementById(textareaname).focus();
		// var num = start + sel.length;
		// top.window.content.document.getElementById(textareaname)
		// .setSelectionRange(start, num);
		// save textarea scroll position
		var textScroll = txtarea.scrollTop;
		// get current selection
		txtarea.focus();
		var startPos = txtarea.selectionStart;
		var endPos = txtarea.selectionEnd;
		var selText = txtarea.value.substring(startPos, endPos);
		// insert tags
		txtarea.value = txtarea.value.substring(0, startPos) + sel
				+ txtarea.value.substring(endPos, txtarea.value.length);
		// set new selection

		txtarea.selectionStart = startPos;
		txtarea.selectionEnd = txtarea.selectionStart + sel.length;

		// restore textarea scroll position
		txtarea.scrollTop = textScroll;

		com.elclab.proveit.includeProveItEditSummary();
	},

	/*
	 * this function inserts the currently selected reference at the
	 * location of the cursor in the document.
	 */
	insertSelectedRef : function() {
		//com.elclab.proveit.log("Entering insertSelectedRef.");
		if (com.elclab.proveit.getRefbox().selectedItem) {
			if(com.elclab.proveit.currentrefs == [])
			{
				com.elclab.proveit.log("currentrefs is undefined.");
			}
			//var sel = com.elclab.proveit.getSidebarDoc().getElementById('display').value;
			/*else
				com.elclab.proveit.log("currentrefs: " + com.elclab.proveit.currentrefs);*/
			//com.elclab.proveit.log("selectedItem.parentNode.localName: " + com.elclab.proveit.getRefbox().selectedItem.parentNode.localName)
			//com.elclab.proveit.log("selectedItem.parentNode.id: " + com.elclab.proveit.getRefbox().selectedItem.parentNode.id);

			var ref = com.elclab.proveit.currentrefs[com.elclab.proveit.getRefbox().selectedItem.parentNode.id];

			//com.elclab.proveit.log("ref: " + ref)
			com.elclab.proveit.insertRef(ref, com.elclab.proveit.toggleinsert);
		}
		else
		{
			//com.elclab.proveit.log("No item selected.");
		}
	},

	/*
	 * This function takes the currently selected or edited reference and
	 * updates it in the edit box.
	 */
	updateInText : function() {
		com.elclab.proveit.curRefItem = com.elclab.proveit.getRefbox().selectedItem;
		//com.elclab.proveit.log("Entering updateInText");
		var item = com.elclab.proveit.getRefbox().selectedItem.id;

		var txtarea = com.elclab.proveit.getMWEditBox();

		if (!txtarea || txtarea == null)
			return;

		var sel = com.elclab.proveit.getSidebarDoc().getElementById(item).toString();
		var textScroll = txtarea.scrollTop;
		// get current selection
		txtarea.focus();
		var startPos = txtarea.selectionStart;
		var endPos = txtarea.selectionEnd;
		var text = txtarea.value;
		var textScroll = txtarea.scrollTop;
		//com.elclab.proveit.log("Replacing: \n\t" + com.elclab.proveit.currentrefs[item]["orig"] + "\nWith:\n\t" + com.elclab.proveit.currentrefs[item].toString());

		// This code (the original) had the minor drawback of not working when references contained links.
		//var regexpstring = com.elclab.proveit.currentrefs[item]["orig"].replace(/\|/g, "\\|");

		/*
		This is correct, if you insist on only using replace with regex.
		var regexpstring = com.elclab.proveit.currentrefs[item]["orig"].replace(/([\[\\\^\$\.\|\?\*\+\(\)\]\{\}])/g, "\\$1");
		//com.elclab.proveit.log(regexpstring);
		//var regex = new RegExp(regexpstring);
		if(text.search(regex) == -1)
		{
			com.elclab.proveit.log("Existing ref not found!");
		}
		text = text.replace(regex, com.elclab.proveit.currentrefs[item].toString());
		*/

		// This is most reasonable, given that replace works just fine without regex. :)
		text = text.replace(com.elclab.proveit.currentrefs[item]["orig"], com.elclab.proveit.currentrefs[item].toString());

		// Do replacement in textarea.
		txtarea.value = text;

		// Baseline for future modifications

		com.elclab.proveit.currentrefs[item]["orig"] = com.elclab.proveit.currentrefs[item].toString();
		com.elclab.proveit.currentrefs[item]["save"] = true;

		/*
		// restore textarea scroll position
		txtarea.scrollTop = textScroll;
		*/
		//com.elclab.proveit.log("Highlighting changes.");

		com.elclab.proveit.highlightTargetString(com.elclab.proveit.currentrefs[item].toString());
		com.elclab.proveit.getRefbox().selectItem(com.elclab.proveit.curRefItem);

	},

	/*
	 * this is the cancel button code for the edit panel. It just closes the
	 * window and resets the values.
	 */
	cancelEdit : function() {
		com.elclab.proveit.getSidebarDoc().getElementById('edit').hidePopup();
		//com.elclab.proveit.getSidebarDoc().getElementById('editextra').value = "";
		com.elclab.proveit.doSelect();
	},

	/**
	 * @deprecated
	 * Processes a list of comma separated values, such as foo=bar,goo=gai
	 */
	processCommaSeparated : function(ref, text)
	{
		//com.elclab.proveit.log("Entering processCommaSeparated");
		if(!(ref && ref != null))
		{
			//com.elclab.proveit.log("ref is not valid.");
			return false;
		}
		if(!(text && text != null))
		{
			//com.elclab.proveit.log("text is not valid.");
			return false;
		}
		// FIX: Commas can be part of fields.
		textSplit = text.split(/\,/gi);
		/*
		if (textSplit == -1 && text != "") {
			var split = textSplit[i].split(/\=/i);
			var paramName = split[0].trim();
			var paramVal = split[1].trim();
			if (paramName == "name") {
				// com.elclab.proveit.log("Setting name(single): " + split[1].trim());
				com.elclab.proveit.getSidebarDoc().getElementById(name + "label").value = paramVal;
				com.elclab.proveit.currentrefs[name][paramName] = paramVal;
			}
			else
			{
				com.elclab.proveit.currentrefs[name].params[paramName] = paramVal;
			}
		} // Can if above ever be executed?  textSplit should not be -1...
		else
		*/
		if (text != "") {
			for (var i = 0; i < textSplit.length; i++) {
				// FIX: Equal signs can be part of fields.  This can probably be fixed just
				// by taking the first equal once comma split is worked out.
				var split = textSplit[i].split(/\=/i);
				if(split[0] == null || split[1] == null)
				    return false;

				var paramName = split[0].trim();
				var paramVal = split[1].trim();
				/*if (paramName == "name") {
					// com.elclab.proveit.log("Setting name(multi): " + split[1].trim());
					com.elclab.proveit.getSidebarDoc().getElementById(name + "label").value = paramVal;
					ref[paramName] = paramVal;
				}
				else
				{*/
				if(paramName != "" && paramVal != "")
				{
				    ref.params[paramName] = paramVal;
				}
				//}
			}
		}
	},

	// Adds a new blank row to the edit popup.
	editAddField : function()
	{
		//com.elclab.proveit.log("Entering editAddField");
		var name = com.elclab.proveit.curRefItem.id;
		var current = com.elclab.proveit.currentrefs[name];
		com.elclab.proveit.addEditPopupRow(current.params, null, "", false, false);
	},

	// Remove field from the edit popup.
	editRemoveField : function()
	{
		var wrap = com.elclab.proveit.getSidebarDoc().getElementById("editlist");
		wrap.removeChild(wrap.childNodes[wrap.childNodes.length - 1]);
	},

	// Saves the changes the user made in the edit popup.
	editSave : function() {
		//com.elclab.proveit.log("Entering editSave");

		com.elclab.proveit.getSidebarDoc().getElementById("edit").hidePopup();

		var name = com.elclab.proveit.getRefbox().selectedItem.id;
		var list = com.elclab.proveit.getSidebarDoc().getElementById("editlist").getElementsByTagName("hbox");

		//com.elclab.proveit.log("list.length: " + list.length);

		var refNameValue = com.elclab.proveit.getSidebarDoc().getElementById("edit_refname_value");
		if(refNameValue.value != "")
		{
			var newName = refNameValue.value;
			com.elclab.proveit.currentrefs[name]["name"] = newName;
			/*
			com.elclab.proveit.getSidebarDoc().getElementById(name + "label").value = newName;
			com.elclab.proveit.log("com.elclab.proveit.currentrefs[name][\"name\"]: " + com.elclab.proveit.currentrefs[name]["name"]);
			*/
		}
		else
		{
		        com.elclab.proveit.currentrefs[name]["name"] = null; // Save blank names as null
		}

		/*
		com.elclab.proveit.log("Setting title = test2");
		com.elclab.proveit.currentrefs[name].params["title"] = "title2";
		*/
		for (var i = 0; i < list.length; i++) {
			if (list[i]) {
				// com.elclab.proveit.log(item + ":" + list[item].id);
				//var node = list[i].id;
				//com.elclab.proveit.log("item: " + i);
				var paramName = list[i].childNodes[0].value;
				//com.elclab.proveit.log("node: " + node);

				//delete(com.elclab.proveit.currentrefs[name].params[node]);
				delete(com.elclab.proveit.currentrefs[name].params[paramName]);

				//var paramName = com.elclab.proveit.getSidebarDoc().getElementById(node + "namec").value;
				//com.elclab.proveit.log("paramName: " + paramName);
				//var paramVal = com.elclab.proveit.getSidebarDoc().getElementById(node + "value").value;
				var paramVal = list[i].childNodes[2].value;
				/*
				 com.elclab.proveit.log("paramVal: " + paramVal);
				 com.elclab.proveit.log("Setting title = test2");
				 com.elclab.proveit.currentrefs[name].params["title"] = "title2";
				*/
				if (paramName != "" && paramVal != "")
				{
					//com.elclab.proveit.log("Setting " + paramName + "= " + paramVal);
					com.elclab.proveit.currentrefs[name].params[paramName] = paramVal;
				}
				/*
				else if (node == "name"
						&& paramVal != "") {
					com.elclab.proveit.getSidebarDoc().getElementById(name + "label").value = paramVal;
					com.elclab.proveit.currentrefs[name][node] = paramVal;
				}
				*/

			}
		}
		/*
		var extra = com.elclab.proveit.getSidebarDoc().getElementById("editextra").value;
		com.elclab.proveit.processCommaSeparated(com.elclab.proveit.currentrefs[name], extra);
		com.elclab.proveit.getSidebarDoc().getElementById("editextra").value = "";
		*/
		if (com.elclab.proveit.currentrefs[name].toString() != com.elclab.proveit.currentrefs[name]["orig"]) {
			com.elclab.proveit.currentrefs[name]["save"] = false;
		}
		//com.elclab.proveit.doSelect();

		if(com.elclab.proveit.currentrefs[name]["save"] == false)
		{
		    var ref = com.elclab.proveit.currentrefs[name];
		    var newGenName = com.elclab.proveit.getGeneratedName(ref);

		    if(ref.baseGenName != newGenName) // is the current gen name same as old, disregarding final possible (1), (2), etc.
		    {
				ref.baseGenName = newGenName;
				newGenName = com.elclab.proveit.genNameWithoutDuplicates(newGenName); // Ensure new name is not already used.
		    }
		    else
		    {
				newGenName = name;
		    }
		    com.elclab.proveit.currentrefs[name] = null;
		    com.elclab.proveit.currentrefs[newGenName] = ref;

		    var newRichItem = com.elclab.proveit.getRefboxElement(ref, newGenName);
		    var oldRichItem = com.elclab.proveit.getRefbox().selectedItem;
		    oldRichItem.parentNode.replaceChild(newRichItem, oldRichItem);
		    com.elclab.proveit.getRefbox().selectItem(newRichItem);

		    com.elclab.proveit.updateInText();
		    com.elclab.proveit.includeProveItEditSummary();
		}

		//com.elclab.proveit.updateEditPopup();

		//com.elclab.proveit.log("Leaving editSave.");
	},

	/** @deprecated
	 * Whether to ignore the next select event.
	 * @type Boolean
	 */
	ignoreSelection : false,

	/**
	 * Whether the next select event should cause a reference to be highlighted in the MW box.
	 * @type Boolean
	 */
	highlightOnSelect : true,

	restoreSelection : function()
	{
		//com.elclab.proveit.log("Entering restoreSelection.")
		// Restores selection after edit box is left and sidebar returned to..
		if(com.elclab.proveit.curRefItem != null)
		{
			//com.elclab.proveit.ignoreSelection = true;
			com.elclab.proveit.getRefbox().selectItem(com.elclab.proveit.curRefItem);
		}
	},

	/**
	 * The item currently selected in the refbox.
	 * @type Node
	 */
	curRefItem : null,

	// Selects reference in main article
	doSelect : function()
	{
		//com.elclab.proveit.log("Entering doSelect");

		//com.elclab.proveit.log("Selected item: " + com.elclab.proveit.getRefbox().selectedItem);

		//if(this.ignoreSelection || this.curRefItem == document.getElementById("refbox").selectedItem)
		if(com.elclab.proveit.ignoreSelection)
		{
			com.elclab.proveit.ignoreSelection = false;
			return; //ignore event thrown by scripted select or clearSelection.
		}
		//com.elclab.proveit.doSelect();

		//if(com.elclab.proveit.getRefbox().selectedItem != null)
		//{
			com.elclab.proveit.curRefItem = com.elclab.proveit.getRefbox().selectedItem; // don't allow overwriting with null selection.
			/*com.elclab.proveit.log("selectedItem.localName: " + com.elclab.proveit.getRefbox().selectedItem.localName)
			com.elclab.proveit.log("selectedItem.id: " + com.elclab.proveit.getRefbox().selectedItem.id);

			com.elclab.proveit.log("selectedItem.parentNode.localName: " + com.elclab.proveit.getRefbox().selectedItem.parentNode.localName)
			com.elclab.proveit.log("selectedItem.parentNode.id: " + com.elclab.proveit.getRefbox().selectedItem.parentNode.id);*/

		//}
		//com.elclab.proveit.log("curRefItem: " + com.elclab.proveit.curRefItem + "; curRefItem.id: " + com.elclab.proveit.curRefItem.id)
		//com.elclab.proveit.log("doSelect currentrefs: " + com.elclab.proveit.currentrefs);
		var curRef = com.elclab.proveit.currentrefs[com.elclab.proveit.curRefItem.id];
		if(!curRef || curRef == null)
		{
			//com.elclab.proveit.log("doSelect: curRef is not defined.");
			com.elclab.proveit.respawn();
			return false;
		}
		if(curRef.inMWEditBox)
		{
			//com.elclab.proveit.log("Current ref is in edit box.  Highlighting ref.")
			var curRefText = curRef["orig"];
			//com.elclab.proveit.log("curRefText: " + curRefText);
			/*
			if(isStringHighlighted(curRefText))
			{
				return;
			}
			*/
			if(com.elclab.proveit.highlightOnSelect)
			{
				//com.elclab.proveit.log("doSelect calling highlightTargetString");
				com.elclab.proveit.highlightTargetString(curRefText);
			}
			else
			{
				//com.elclab.proveit.log("doSelect not calling highlightTargetString");
				com.elclab.proveit.highlightOnSelect = true;
			}
			/*var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
			 .getInterface(Components.interfaces.nsIWebNavigation)
	 		 .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
	         .rootTreeItem
	         .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
	         .getInterface(Components.interfaces.nsIDOMWindow);
	        */
	        //mainWindow.focus();
	        //mainWindow.document.focus();
			//com.elclab.proveit.log("About to clear refbox selection.")

			//com.elclab.proveit.ignoreSelection = true;
	        com.elclab.proveit.getRefbox().clearSelection(); //Clearing selection throws onSelect!

	        //com.elclab.proveit.ignoreSelection = true; // Focus event may also have effect on selection.
	        com.elclab.proveit.getMWEditBox().focus();
			//com.elclab.proveit.log("Scrolled and highlighted, and attempted to focus.");
		}
		else
		{
			//com.elclab.proveit.log("Current reference is not yet saved to textbox.")
		}

		//com.elclab.proveit.log("Calling updateEditPopup.");
		com.elclab.proveit.updateEditPopup();

		//com.elclab.proveit.log("Leaving doSelect");
	},

	/*
	 * Updates the edit window (popup that appears when you click pencil icon).
	 * Moved from doSelect/dispSelect
	 */
	updateEditPopup : function()
	{
		//com.elclab.proveit.log("Entering updateEditPopup.")
		var box = com.elclab.proveit.getSidebarDoc().getElementById("editlist");
		var size = box.childNodes.length;
		//com.elclab.proveit.log("Before size: " + size);
		//for (var i = 0; i < size; i++) {
		while(box.childNodes.length > 0) // Above apparently can get into race condition.
		{
			var item = box.removeChild(box.childNodes[0]);
			//com.elclab.proveit.log("Deleting #" + i + ": " + item.id);
			size = box.childNodes.length;
			//com.elclab.proveit.log("Size: " + size);
		}

		size = box.childNodes.length;
		//com.elclab.proveit.log("After size: " + size);


		//var name = com.elclab.proveit.getRef().selectedItem.id;
		var name = com.elclab.proveit.curRefItem.id;
		//com.elclab.proveit.log("name: " + name);

		var current = com.elclab.proveit.currentrefs[name];

		if (current["template"] == "cite") {
			com.elclab.proveit.getSidebarDoc().getElementById("editlabel").value = current["type"];
		} else {
			com.elclab.proveit.getSidebarDoc().getElementById("editlabel").value = "Citation";
		}

		/*
		// Closer to minimizing hacks for name
		if(current["name"] && current["name"] != null)
			com.elclab.proveit.addEditPopupRow(current, "name");
		*/

		var refNameValue = com.elclab.proveit.getSidebarDoc().getElementById("edit_refname_value");
		if(current["name"])
		{
			refNameValue.value = current["name"];
		}
		else
		{
			refNameValue.value = "";
		}

		// Don't contaminate actual object with junk params.
		var tempParams = {};
		for(e in current.params)
		{
			tempParams[e] = current.params[e];
		}

		// Add default params with blank values.
		var defaults = current.getDefaultParams();
		for(var i = 0; i < defaults.length; i++)
		{
			if(!tempParams[defaults[i]])
			{
				//com.elclab.proveit.log("Setting default blank parameter: defaults[i] = " + defaults[i]);
				tempParams[defaults[i]] = "";
			}
		}

		var required = current.getRequiredParams();

		var paramNames = new Array();
		//First run through just to get names.
		//com.elclab.proveit.log("Adding params to array.");
		for(item in tempParams)
		{
			//com.elclab.proveit.log(item);
			paramNames.push(item);
		}

		//com.elclab.proveit.log("Done adding params to array.");

		var sorter = current.getSorter();
		if(sorter)
		{
			paramNames.sort(sorter);
		}
		else
		{
			paramNames.sort();
		}
		/* Sort them to provide consistent interface.  Uses custom sort order (which is easily tweaked)
		   where possible.

		   Javascript does destructive sorting, which in this case, is convenient...
		*/

		size = box.childNodes.length;
		//com.elclab.proveit.log("Before size: " + size);

		for(var i = 0; i < paramNames.length; i++) {
			//com.elclab.proveit.log("Calling addEditPopupRow on tempParams." + item);
			//com.elclab.proveit.log("i: " + i + ", paramNames[i]: " + paramNames[i]);
			com.elclab.proveit.addEditPopupRow(tempParams, current.getDescriptions(), paramNames[i], required[paramNames[i]], true);
		}

		//size = box.childNodes.length;
		//com.elclab.proveit.log("After size: " + size);

		//com.elclab.proveit.log("Leaving updateEditPopup");
	},

	/**
	 * Adds a single row of edit popup
	 * @param list the param list from the reference
	 * @param descs description array to use, or null for no description
	 * @param item the current param name
	 * @param req true if current param name is required, otherwise not required.
	 * @param fieldType true for label, false for textbox.
	 */
	addEditPopupRow : function(list, descs, item, req, fieldType)
	{
		/*
		com.elclab.proveit.log("Entering addEditPopupRow.");
		com.elclab.proveit.log("item: " + item);
		com.elclab.proveit.log("req: " + req);
		com.elclab.proveit.log("fieldType: " + fieldType);
		*/

		/*
		if (item != "type" && item != "toString" && item != "orig"
				&& item != "save") {
		*/
			var id = fieldType ? "editprimelabel" : "editprimetext";
			var newline = com.elclab.proveit.getSidebarDoc().getElementById(id)
					.cloneNode(true);
			var left = newline.childNodes[0];
			var right = newline.childNodes[2];
			//newline.id = "" + item;
			/*
			com.elclab.proveit.log("About to set id of hbox to: " + item);
			com.elclab.proveit.log("Checking for already existing item.  Should be null: "
			+ com.elclab.proveit.getSidebarDoc().getElementById(item));
			newline.id = item;
			*/
			newline.hidden = false;
			com.elclab.proveit.getSidebarDoc().getElementById("editlist").appendChild(newline);

			var label = com.elclab.proveit.getSidebarDoc().getElementById("star").cloneNode(true);
			label.id = "";
			label.style.display = "-moz-box"; // back to default display prop.
			label.style.visibility = (req ? "visible" : "hidden"); // Star will appear if field is required.
			newline.insertBefore(label, newline.firstChild);

			if(fieldType)
			{
				left.id = "" + item + "namec";
				right.id = "" + item + "value";
				var desc = descs[item];
				if(!desc)
				{
					com.elclab.proveit.log("Undefined description for param: " + item + ".  Using directly as descripition.");
					desc = item;
				}
				com.elclab.proveit.getSidebarDoc().getElementById(item + "namec").value = desc;

				//com.elclab.proveit.log("list[item]: " + list[item]);
				com.elclab.proveit.getSidebarDoc().getElementById(item + "value").value = list[item];
			}
			else
			{
				//com.elclab.proveit.getSidebarDoc().getElementById(item + "value").value = "";
			}
	    //}
	},

	/*
	 * Puts the text in the small display window.
	 */
	/*
	dispSelect : function() {
		//com.elclab.proveit.log("Entering dispSelect");

		if (com.elclab.proveit.getRefbox().selectedItem) {

			var name = com.elclab.proveit.getRefbox().selectedItem.id;
			if (com.elclab.proveit.toggleinsert) {
				// com.elclab.proveit.log(name);
				document.getElementById('display').value = com.elclab.proveit.currentrefs[name]
						.toString();
			} else {
				if (com.elclab.proveit.currentrefs[name].name) {
					document.getElementById('display').value = "<ref name=\""
							+ com.elclab.proveit.currentrefs[name].name + "\" />";
				} else {
					document.getElementById('display').value = "There is no name for this reference.";
				}
			}

		} else {
			return;
		}

		// either enable or disable the save changes text

	},
	*/

	/*
	 * these are the current style and insert values to denote which one is
	 * currently active
	 */

	// togglestyle true signifies cite-style references, citation-style otherwise.  Used when creating a reference.
	togglestyle : true,

	/* toggleinsert true signifies full references, name-only otherwise.  Used when inserting.
	 * Note that new references are always inserted in full.
	 */
	toggleinsert : true,

	/* This whole function is something of a hack.  Basically, it detects the current state of the "physical" toggle,
	 * and updates variables accordingly.
	 */
	flipToggle : function(toggle) {
		var label = com.elclab.proveit.getSidebarDoc().getElementById(toggle + "toggle");
		label.setAttribute("style", "font-weight: bold");
		if (toggle == "full") {
			com.elclab.proveit.getSidebarDoc().getElementById('nametoggle').setAttribute("style",
					"font-weight: normal");
			com.elclab.proveit.toggleinsert = true;
			com.elclab.proveit.doSelect();
		} else if (toggle == "name") {
			com.elclab.proveit.getSidebarDoc().getElementById('fulltoggle').setAttribute("style",
					"font-weight: normal");
			com.elclab.proveit.toggleinsert = false;
			com.elclab.proveit.doSelect();
		} else if (toggle == "cite") {
			com.elclab.proveit.getSidebarDoc().getElementById('citationtoggle').setAttribute("style",
					"font-weight: normal");
			com.elclab.proveit.togglestyle = true;
			com.elclab.proveit.getSidebarDoc().getElementById('citation').hidden = true;
			com.elclab.proveit.getSidebarDoc().getElementById('cite').hidden = false;
			com.elclab.proveit.clearCitePanes(com.elclab.proveit.getSidebarDoc().getElementById("citationpanes"));
			com.elclab.proveit.changeCite(com.elclab.proveit.getSidebarDoc().getElementById("citemenu"));
		} else if (toggle == "citation") {
			com.elclab.proveit.getSidebarDoc().getElementById('citetoggle').setAttribute("style",
					"font-weight: normal");
			com.elclab.proveit.togglestyle = false;
			com.elclab.proveit.getSidebarDoc().getElementById('cite').hidden = true;
			com.elclab.proveit.getSidebarDoc().getElementById('citation').hidden = false;
			com.elclab.proveit.clearCitePanes(com.elclab.proveit.getSidebarDoc().getElementById("citepanes"));
			com.elclab.proveit.changeCite(com.elclab.proveit.getSidebarDoc().getElementById("citationmenu"));

		}
	},

	/**
	 * "Associative array" of all references, indexed by generated name (see getGeneratedName).
	 * @type Object
	 */
	currentrefs : [],

	/**
	 * Overly clever regex to parse template string (e.g. |last=Smith|first=John|title=My Life Story) into name and value pairs.
	 * @param workingstring template string to parse.
	 * @return Object with two properties, nameSplit and valSplit.
	 * nameSplit is an array of all names, and valSplit is an array of all values.
	 * While the length of nameSplit is equal to the number of name/value pairs (as expected),
	 * the length of valSplit is one greater due to a blank element at the beginning.
	 * Thus nameSplit[i] corresponds to valSplit[i+1].
	 * Calling code must take this into account.
	 */
	splitNameVals : function (workingstring)
	{
		var split = {};
		split.nameSplit = workingstring.substring(workingstring.indexOf("|") + 1).split(/=(?:[^\[\|]*?(?:\[\[[^\|\]]*(?:\|(?:[^\|\]]*))?\]\])?)+(?:\||\}\})/);
		split.valSplit = workingstring.substring(workingstring.indexOf("|"), workingstring.indexOf("}}")).split(/\|[^\|=]*=/);
		return split;
	},

	/**
	 * Generates name from reference using title, author, etc.
	 * @param citation Citation to generate name for.
	 */
	getGeneratedName : function(citation)
	{
		var name = "";

		//com.elclab.proveit.log("citation: " + citation);
		if (citation.params["author"]) {
			name = citation.params["author"] + "; ";
		} else if (citation.params["last"]) {
			name = citation.params["last"];
			if (citation.params["first"]) {
				name += ", " + citation.params["first"];
			}
			name += "; ";
		}

		if (citation.params["title"]) {
			name += citation.params["title"];
		}

		if(name == "")
			name = citation.toString(); //backup

		return name;
	},

	/**
	 * This Function accesses the wiki edit box and scans the contained text for
	 * citation tags. It then puts them into the global currentScan and setsup
	 * the display chooser.
	 */
	scanRef : function() {
		//com.elclab.proveit.log("Entering scanRef.");
		// textValue is the text from the edit box

		// zero out the old scan, just in case
		//com.elclab.proveit.currentScan = [];
		this.currentScan = [];
		// these are strings used to allow the correct parsing of the tag
		var workingstring;
		var cutupstring;
		// we use different textarea id's if people are using wikiEd, this
		// should fix that.
		var text = com.elclab.proveit.getMWEditBox();
		// check to see if the edit box exists, basically a boilerplate for
		// using it
		// on the wrong page. We also check to see which textarea is being used,
		// wikiEd's or the normal one.
		com.elclab.proveit.clearlist();

		//com.elclab.proveit.log("scanRef currentrefs: " + com.elclab.proveit.currentrefs);

		var textValue;
		if (text) {
			//com.elclab.proveit.log("Edit box object is valid.");
			textValue = text.value;
			// since we should pick the name out before we get to the citation
			// tag type, here's a variable to hold it
			var name, orig;
			// grab the text from the box, wpTextbox1 is the standard boxx name.
			// scan it for citation tags...
			com.elclab.proveit.currentScan = textValue
					.match(/<[\s]*ref[^>]*>[\s]*{{+[\s]*(cite|Citation)[^}]*}}+[\s]*<[\s]*\/[\s]*ref[\s]*>/gi);
			// if there are results,
			if (com.elclab.proveit.currentScan) {
				//com.elclab.proveit.log("currentScan is valid.");
				// just for me and testing, make them easier to read by
				// replacing
				// all | with newlines and a tab
				//com.elclab.proveit.log("com.elclab.proveit.currentScan.length: " + com.elclab.proveit.currentScan.length);
				for (var i = 0; i < com.elclab.proveit.currentScan.length; i++) {
					//com.elclab.proveit.log("com.elclab.proveit.currentScan[" + i + "]: " + com.elclab.proveit.currentScan[i]);
					workingstring = com.elclab.proveit.currentScan[i]
							.match(/{{[\s]*(cite|Citation)[^}]*}}/i)[0];
					//var name = com.elclab.proveit.currentScan[i].match(/<[\s]*ref[^>]*/i);
					//name = name[0].split(/\"/gi)[1]; // This only works when double quotes are used, which are not required.
					var match = com.elclab.proveit.currentScan[i].match(/<[\s]*ref[\s]*name[\s]*=[\s]*(?:(?:\"(.*?)\")|(?:\'(.*?)\')|(?:(.*?)))[\s]*\/?[\s]*>/);

					if(match && match != null)
						name = match[1] || match[2] || match[3];
					else
						name = null;
					// com.elclab.proveit.log(name);
					if (!name || name == -1) {
						delete(name);
					}
					orig = com.elclab.proveit.currentScan[i];
					//com.elclab.proveit.log("name: " + name);
					// com.elclab.proveit.log(workingstring);
					// com.elclab.proveit.log(com.elclab.proveit.currentScan[i]);
					// /\|/ is not adequate, because of embedded piped links.  However:
					// /\|(?=(?:(?:[^\[\|\]]+)|(?:\[\[[^\|\]]+(?:\|(?:[^\|\]]*))?\]\]))+(?:\||\}\}))/
					// would have worked...
					cutupstring = workingstring.split(/\|/g);
					//com.elclab.proveit.log("currentrefs[" + name + "]" + com.elclab.proveit.currentrefs[name]);
					if (!com.elclab.proveit.currentrefs[name]) {
						if (workingstring.match(/{{[\s]*cite/i) != null) {
							// create a new cite object
							var citation = new com.elclab.proveit.Cite();
							citation["orig"] = orig;
							citation["save"] = true;
							citation.inMWEditBox = true;
							if (name) {
								citation["name"] = name;
							}

							// find the start location on the type
							var typestart = cutupstring[0].toLowerCase()
									.indexOf('e');
							// grab the type, this should only return the type
							// with
							// possible whitespace around it
							var type = cutupstring[0].substring(typestart + 1);
							// trim the type
							type = type.trim();
							citation.setType(type);
							// the rest of the cutup are the attributes, cycle
							// through them and parse them

							var split = com.elclab.proveit.splitNameVals(workingstring);
							var nameSplit = split.nameSplit;
							var valSplit = split.valSplit;

							for (var j = 0; j < nameSplit.length - 1; j++) {
								/* Drop blank space, and |'s without params, which are never correct for
								   citation templates.*/
								var paramName = nameSplit[j].trim().replace(/(?:\s*\|)*(.*)/, "$1");
								var paramVal = valSplit[j + 1].trim();
								// add it to the object
								if (paramVal != "") {
										citation.params[paramName] = paramVal;
								}
								/*
								// if it is the last one, take off the }} from
								// the
								// end
								if ((cutupstring.length - 1) == j) {
									cutupstring[j] = cutupstring[j].substring(
											0, cutupstring[j].length - 2);
								}
								// split the attribute on the = and trim the
								// sides
								var parts = cutupstring[j].split("=");
								if (parts[1]) {
									var paramName = parts[0].trim();
									var paramVal = parts[1].trim();
									// add it to the object
									if (paramVal != "") {
										citation.params[paramName] = paramVal;
									}
								}
								*/
							}
						} else if (workingstring.match(/{{[\s]*Citation/i) != null) {
							var citation = new com.elclab.proveit.Citation();
							if (name) {
								citation["name"] = name;
							}
							citation["orig"] = orig;
							citation["save"] = true;
							citation.inMWEditBox = true;
							/*
							var citstart = workingstring.indexOf(workingstring.match(/Citation/i));
							workingstring = workingstring.substring(citstart
									+ 8);
							cutupstring = workingstring.split(/\|/g);
							*/

							var split = com.elclab.proveit.splitNameVals(workingstring);
							var nameSplit = split.nameSplit;
							var valSplit = split.valSplit;

							for (var j = 0; j < nameSplit.length - 1; j++) {
								/* Drop blank space, and |'s without params, which are never correct for
								   citation templates.*/
								var paramName = nameSplit[j].trim().replace(/(?:\s*\|)*(.*)/, "$1");
								var paramVal = valSplit[j + 1].trim();
								// add it to the object
								if (paramVal != "") {
										citation.params[paramName] = paramVal;
								}

								/*
								// if it is the last one, take off the }} from
								// the
								// end
								if ((cutupstring.length - 1) == j) {
									cutupstring[j] = cutupstring[j].substring(
											0, cutupstring[j].length - 2);
								}
								// split the attribute on the = and trim the
								// sides
								var parts = cutupstring[j].split("=");
								if (parts[1]) {
									var paramName = parts[0].trim();
									var paramVal = parts[1].trim();
									// add it to the object
									if (paramVal != "") {
										citation.params[paramName] = paramVal;
									}
								}
								*/
							}
						} else {
							//com.elclab.proveit.log("Can't Parse: " + com.elclab.proveit.currentScan[i]);
							//com.elclab.proveit.log("Continue-ing loop");
							var citation = workingstring;
							continue;
						}
						//com.elclab.proveit.log("Adding: " + name);
						if (name) {
							//com.elclab.proveit.log("Name is defined: " + name)
							text = com.elclab.proveit.addNewElement(citation);
							if(text == null)
							{
								//com.elclab.proveit.log("scanRef: addNewElement returned null");
								com.elclab.proveit.respawn();
								return false;
							}
							//com.elclab.proveit.log("text: " + text);
							//com.elclab.proveit.log("citation: " + citation);
							com.elclab.proveit.currentrefs[text] = citation;
							//com.elclab.proveit.log("com.elclab.proveit.currentrefs[text]: " + com.elclab.proveit.currentrefs[text]);
							//com.elclab.proveit.log("currentrefs.length: " + com.elclab.proveit.currentrefs.length);

							//com.elclab.proveit.log("currentrefs: " + com.elclab.proveit.currentrefs);

						} else {
							//com.elclab.proveit.log("Name is not defined.")
							//name = com.elclab.proveit.getGeneratedName(citation);

							//com.elclab.proveit.log("Generated name: " + name)
							text = com.elclab.proveit.addNewElement(citation);
							if(text == null)
							{
								//com.elclab.proveit.log("scanRef: addNewElement returned null");
								com.elclab.proveit.respawn();
								return false;
							}
							//com.elclab.proveit.log("text: " + text);
							com.elclab.proveit.currentrefs[text] = citation;
							//com.elclab.proveit.log("com.elclab.proveit.currentrefs[text]: " + com.elclab.proveit.currentrefs[text]);
							//com.elclab.proveit.log("currentrefs.length: " + com.elclab.proveit.currentrefs.length);

							//com.elclab.proveit.log("currentrefs: " + com.elclab.proveit.currentrefs);

						}
					} else {
					}
				}
			} else {
			}
		}
		else
		{
			//com.elclab.proveit.log("scanRef: MW edit box is not defined.");
			return false;
		}
		//document.getElementById('display').value = "";
		//com.elclab.proveit.log("com.elclab.proveit.currentScan: " + com.elclab.proveit.currentScan)
		//com.elclab.proveit.log("scanRef currentrefs: " + com.elclab.proveit.currentrefs);
		//com.elclab.proveit.log("scanRefs currentrefs.length: " + com.elclab.proveit.currentrefs.length);
		//com.elclab.proveit.log("scanRef returned successfully.");
	},

	/* Used to map between parameter name and human-readable.  It can be
	 * internationalized easily.  Add descriptions.xx , where xx is
	 * the ISO 639-1 code for a language, then set com.elclab.proveit.LANG to "xx"
	 * to use the new descriptions.
	 */

	descriptions :
	{
		en :
			{
				name: "Name",
				author: "Author (l,f)",
				last: "Last name",
				first: "First name",
				authorlink: "Author article name",
				title: "Title",
				publisher: "Publisher",
				year: "Year",
				location: "Location",
				place: "Locale of work",
				isbn: "ISBN",
				id: "ID",
				pages: "Pages",
				quote: "Quote",
				month: "Month",
				journal: "Journal",
				edition: "Edition",
				volume: "Volume",
				issue: "Issue",
				url: "URL",
				date: "Date (YYYY-MM-DD)",
				accessdate: "Access Date (YYYY-MM-DD)",
				coauthors: "Co-Authors",
				booktitle: "Title of Proceedings",
				contribution: "Contribution/Chapter",
				encyclopedia: "Encyclopedia",
				newsgroup: "Newsgroup",
				version: "Version",
				site: "Site",
				newspaper: "Newspaper",
				"publication-place": "Publication Place",
				editor: "Editor(l,f)",
				article: "Article",
				pubplace: "Publisher Place",
				pubyear: "Publication Year",
				inventor: "Inventor(l,f)",
				"issue-date": "Issue Date(YYYY-MM-DD)",
				"patent-number": "Patent Number",
				"country-code": "Country(US)",
				work: "Work",
				format: "File format"
			}
	},

	// A function representing a Cite style template.
	Cite : function() {
		// Ref name.
		this.name;
		// Generated name, without possible (1), (2), etc.  Shows as label in refbox.
		this.baseGenName;
		// Signifies template type is cite web, news, etc, as opposed to Citation.
		this.template = "cite";
		// Signifies template type is cite web, news, etc.
		this.type;
		// false indicates "dirty" citation that has yet to be updated in text and metadata.
		this.save;
		// true if and only if the ref is in the MW edit box with the same value as this object's orig.
		this.inMWEditBox;
		// associative array holding all name/value pairs.
		this.params = new Object();

		/* Mostly an identity mapping, except for redirects.  I think
		 * having the self-mappings is better than some kind of special case array.
		 */
		var typeNameMappings =
		{
			web:"web",
			book:"book",
			journal:"journal",
			conference:"conference",
			encyclopedia:"encyclopedia",
			news:"news",
			newsgroup:"newsgroup",
			paper:"paper",
			"press release":"press release",
			"pressrelease":"press release"
		};

		this.setType = function(rawType)
		{
			var mappedType = typeNameMappings[rawType];
			if(mappedType != null)
				this.type = mappedType;
			else
				this.type = rawType; // Use naive type as fallback.
		};

		// This is the order fields will be displayed or outputted.
		var paramSortKey =
		[
			"url",
			"title",
			"accessdate",
			"author",
			"last",
			"first",
			"authorlink",
			"coauthors",
			"date",
			"year",
			"month",
			"format",
			"work",
			"publisher",
			"location",
			"pages",
			"language",
			"isbn",
			"doi",
			"archiveurl",
			"archivedate",
			"quote"
		];

		// Sorter uses paramSortKey first, then falls back on alphabetical order.
		var sorter = function(paramA, paramB)
		{
			var aInd = paramSortKey.indexOf(paramA);
			var bInd = paramSortKey.indexOf(paramB);
			if(aInd != -1 && bInd != -1)
				return aInd - bInd;
			else
			{
				if(paramA < paramB)
					return -1
				else if(paramA == paramB)
					return 0;
				else
					return 1;
			}
		};

		// Returns this object as a string.
		this.toString = function() {
			if (this.name) {
				var returnstring = "<ref name=\"";
				returnstring += this.name;
				returnstring += "\">{{cite ";
			} else {
				var returnstring = "<ref>{{cite "
			}
			returnstring += this.type;
			returnstring += " ";
			for (var name in this.params) {
				/*if (!((name == "type") ||
						(name == "toString") || (name == "orig") || (name == "save") || (name == "inMWEditBox"))
						&& (this.params[name] && this.params[name] != "")) {*/
					returnstring += " | ";
					returnstring += name;
					returnstring += "=";
					returnstring += this.params[name];
					returnstring += " ";
				//}
			}
			returnstring += "}}</ref>";
			return returnstring;
		};

		// Convenience method.  Returns sorter.
		this.getSorter = function()
		{
			return sorter;
		};

		// Returns descriptions for the current language.
		this.getDescriptions = function()
		{
			//this could be made Cite-specific if needed.
			return com.elclab.proveit.descriptions[com.elclab.proveit.LANG];
		};

		// References without these parameters will be flagged in red.
		// True indicates required (null, or undefined, means not required)
		var requiredParams =
		{
			web : { "url": true, "title": true},
			book : { "title": true },
			journal : { "title": true },
			conference : { "title": true, "booktitle": true },
			encyclopedia: { "title": true, "encyclopedia": true },
			news: { "title": true },
			newsgroup : { "title": true },
			paper : { "title": true },
			"press release"	: { "title": true }
		};

		/* Get required parameters for this citation type.
		   NOTE: This will be null if this.type is unknown.
		*/
		this.getRequiredParams = function()
		{
			var curReq = requiredParams[this.type];
			if(curReq)
				return curReq;
			else
				return {}; // Return empty object rather than null to avoid dereferencing null.
		};

		// These paramaters will be auto-suggested when editing.
		var defaultParams =
		{
			web : [ "url", "title", "accessdate", "work", "publisher", "date"],
			book : [ "title", "author", "authorlink", "year", "isbn" ],
			journal : [ "title", "author", "journal", "volume", "year", "month", "pages" ],
			conference : [ "title", "booktitle", "author", "year", "month", "url", "id", "accessdate" ],
			encyclopedia: [ "title", "encyclopedia", "author", "editor", "accessdate", "edition", "year",
			"publisher", "volume", "location", "pages" ],
			news: [ "title", "author", "url", "publisher", "date", "accessdate" ],
			newsgroup : [ "title", "author", "date", "newsgroup", "id", "url", "accessdate" ],
			paper : [ "title", "author", "title", "date", "url", "accessdate" ],
			"press release"	: [ "title", "url", "publisher", "date", "accessdate" ]
		};

		/* Default parameters, to be suggested when editing.
		 * NOTE: This will be null if this.type is unknown.
		*/
		this.getDefaultParams = function()
		{
			var curDefault = defaultParams[this.type];
			if(curDefault)
				return curDefault;
			else
				return []; // Return empty array rather than null to avoid dereferencing null.
		}

		// Returns true if this object is valid, false otherwise.
		this.isValid = function()
		{
			var req = this.getRequiredParams();
			var i = 0;
			var allFound = true;
			for(reqParam in req)
			{
				/* Ignore parameters in req object that are null, undefined, or false.
				   They are not required. */
				if(!req[reqParam])
					continue;
				allFound &= (reqParam in this.params);
				if(!allFound)
					break;
			}
			return allFound;
		};
	},

	/**
	 * A function for citation style tags.
	 */

	Citation : function() {
		// Ref name.
		this.name;
		// Generated name, without possible (1), (2), etc.  Shows as label in refbox.
		this.baseGenName;
		// Signifies template type is Citation.
		this.template = "Citation";
		// web, news, book, etc.  For Citation, used only for default param generation.
		this.type;
		// false indicates "dirty" citation that has yet to be updated in text and metadata.
		this.save;
		// true if and only if the ref is in the MW edit box with the same value as this object's orig.
		this.inMWEditBox;
		// associative array holding all name/value pairs.
		this.params = new Object();

		// None currently required;
		var requiredParams = {};

		// These paramaters will be auto-suggested when editing.
		var defaultParams =
		{
			web : [ "url", "author", "title", "date", "accessdate"],
			news : [ "author", "title", "newspaper", "url", "publication-place", "volume", "issue", "date", "pages"],
			encyclopedia : ["author", "editor", "contribution", "title", "publisher", "place", "year", "volume", "pages"],
			book : ["author", "title", "publisher", "place", "year"],
			journal : ["author", "title", "journal", "volume", "issue", "year", "pages"],
			patent : ["inventor", "title", "issue-date", "patent-number", "country-code"]
		}

		// This is the order fields will be displayed or outputted.
		var paramSortKey =
		[
			"last",
			"first",
			"url",
			"author",
			"editor",
			"contribution",
			"author-link",
			"last2",
			"first2",
			"author2-link",
			"publication-date",
			"inventor",
			"title",
			"issue-date",
			"patent-number",
			"country-code",
			"journal",
			"volume",
			"newspaper",
			"issue",
			"date",
			"publisher",
			"place",
			"year",
			"edition",
			"publication-place",
			"series",
			"pages",
			"page",
			"id",
			"isbn",
			"doi",
			"oclc",
			"accessdate"
		];

		// Sorter uses paramSortKey first, then falls back on alphabetical order.
		var sorter = function(paramA, paramB)
		{
			var aInd = paramSortKey.indexOf(paramA);
			var bInd = paramSortKey.indexOf(paramB);
			if(aInd != -1 && bInd != -1)
				return aInd - bInd;
			else
			{
				if(paramA < paramB)
					return -1
				else if(paramA == paramB)
					return 0;
				else
					return 1;
			}
		};

		// Returns this object as a string.
		this.toString = function() {
			if (this.name) {
				var returnstring = "<ref name=\"";
				returnstring += this.name;
				returnstring += "\">{{Citation ";
			} else {
				var returnstring = "<ref>{{Citation "
			}
			for (var name in this.params) {
				/*if (!( (name == "toString")
						|| (name == "add") || (name == "orig") || (name == "save") || (name == "inMWEditBox"))
						&& (this.params[name] && this.params[name] != "")) {*/
					returnstring += " | ";
					returnstring += name;
					returnstring += "=";
					returnstring += this.params[name];
					returnstring += " ";
				//}
			}
			returnstring += "}}</ref>";
			return returnstring;
		};

		// Convenience method.  Returns sorter.
		this.getSorter = function()
		{
			return sorter;
		}

		// Returns descriptions for the current language.
		this.getDescriptions = function()
		{
			//this could be made Citation-specific if needed.
			return com.elclab.proveit.descriptions[com.elclab.proveit.LANG];
		};

		//this could be made Citation-specific if needed.
		this.getRequiredParams = function()
		{
			return requiredParams;
		};

		// Default parameters, to be suggested when editing.
		this.getDefaultParams = function()
		{
			return defaultParams[this.type];
		};

		// Returns true if this object is valid, false otherwise.
		// Currently assume all citation objects are valid.
		this.isValid = function(){return true};
	},

	/**
	 * Called from the add citation panel, this is the function used to
	 * add the actual citation.
	 *
	 * @param type the type of citation being added, the particular button
	 *            used will hand this to the function.
	 */
	addCitation : function(type) {
		//com.elclab.proveit.log("Entering addCitation.");
		//com.elclab.proveit.log("type: " + type);
		// get this working, lots of typing here.
		var box = com.elclab.proveit.getSidebarDoc().getElementById(type);
		var tag;
		if (com.elclab.proveit.togglestyle) {
			tag = new com.elclab.proveit.Cite();
			tag["type"] = type;
		} else {
			tag = new com.elclab.proveit.Citation();
		}
		var paramName, paramVal;

		//tag["save"] = true;
		//tag.inMWEditBox = false;
		// What is this + j?  Also, what is with true as loop guard?  How can it be right?
		/*
		if (com.elclab.proveit.currentrefs[com.elclab.proveit.getSidebarDoc().getElementById(type + "name").value]) {
			for (var j = 2; true; j++) {
				if (!com.elclab.proveit.currentrefs[com.elclab.proveit.getSidebarDoc().getElementById(type + "name").value
						+ j]) {
					paramName = box.childNodes[i].childNodes[1].id
							.substring(type.length);
					paramVal = box.childNodes[i].childNodes[1].value
							+ j;
					//if(paramName != "name")
						tag.params[paramName] = paramVal;
					/*else
						tag[paramName] = paramVal;*//*
				}
			}
		}*/

		var extraTextbox= com.elclab.proveit.getSidebarDoc().getElementById(type + "extra");
		if (extraTextbox != null && extraTextbox.value != null && extraTextbox.value != "") {
				//com.elclab.proveit.log("Calling processCommaSeparated");
				com.elclab.proveit.processCommaSeparated(tag, extraTextbox.value);

		}

		var refNameValue = com.elclab.proveit.getSidebarDoc().getElementById(type + "name");
		if(refNameValue == null)
		{
			com.elclab.proveit.log("addCitation: Error: refNameValue null for type: " + type);
			return false;
		}
		if(refNameValue.value != "")
		{
			var newName = refNameValue.value;
			tag["name"] = newName;
			//com.elclab.proveit.log("com.elclab.proveit.currentrefs[name][\"name\"]: " + com.elclab.proveit.currentrefs[name]["name"]);
		}

		for (var i = 1; i < box.childNodes.length - 2; i++) {
			//com.elclab.proveit.log("box.childNodes[i].childNodes[1].id: " + box.childNodes[i].childNodes[1].id)
			if (box.childNodes[i].childNodes[1]
					&& box.childNodes[i].childNodes[1].id == (type + "name")) {
				if (com.elclab.proveit.currentrefs[com.elclab.proveit.getSidebarDoc().getElementById(type + "name").value]) {
					for (var j = 2; true; j++) {
						if (!com.elclab.proveit.currentrefs[com.elclab.proveit.getSidebarDoc().getElementById(type
								+ "name").value
								+ j]) {
							paramName = box.childNodes[i].childNodes[1].id
									.substring(type.length);
							paramVal = box.childNodes[i].childNodes[1].value
									+ j;
						}
					}
				} else {
					paramName = box.childNodes[i].childNodes[1].id
							.substring(type.length);
					paramVal = box.childNodes[i].childNodes[1].value;
					//if(paramName != "name")
					//tag.params[paramName] = paramVal;
					/*else
						tag[paramName] = paramVal;*/
				}
				//com.elclab.proveit.addNewElement(box.childNodes[i].childNodes[1].value);
			}
			else if (box.childNodes[i].childNodes[1]
					&& box.childNodes[i].childNodes[1].value == "=") // hack
			{
				com.elclab.proveit.log("Equal sign hack");
				paramName = box.childNodes[i].childNodes[0].value;
				paramVal = box.childNodes[i].childNodes[2].value;

			}
			else if (box.childNodes[i].childNodes[1]
					&& box.childNodes[i].childNodes[1].value != "") {
				paramName = box.childNodes[i].childNodes[1].id.substring(type.length);
				paramVal = box.childNodes[i].childNodes[1].value;
				//if(paramName != "name")
				//tag.params[paramName] = paramVal;
				/*else
					tag[paramName] = paramVal;*/
			}
			//if(paramName != "name")
			//com.elclab.proveit.log("paramName: " + paramName);
			//com.elclab.proveit.log("paramVal: " + paramVal);
			if(paramName != null && paramName != "")
			{
				tag.params[paramName] = paramVal;
			/*else
			tag[paramName] = paramVal;*/
			}
		}

		var id;
		/*if(tag["name"] != null)
		{*/
			id = com.elclab.proveit.addNewElement(tag);
		/*}
		else
		{
			id = com.elclab.proveit.addNewElement(com.elclab.proveit.getGeneratedName(tag));
		}*/

		//com.elclab.proveit.currentrefs[com.elclab.proveit.getSidebarDoc().getElementById(type + 'name').value] = tag;
		com.elclab.proveit.currentrefs[id] = tag;

		com.elclab.proveit.getSidebarDoc().getElementById('createnew').hidePopup();
		tag["orig"] = tag.toString();
		/*
		 * Cycle through the boxes and grab the id's versus the values, watch
		 * for the final box and make sure to grab the type as well
		 */

		com.elclab.proveit.curRefItem = com.elclab.proveit.getRefbox().selectedItem;
		com.elclab.proveit.insertRef(tag, true); // true means insert full text here, regardless of global toggle.
		tag["save"] = true;
		tag.inMWEditBox = true;
		com.elclab.proveit.includeProveItEditSummary();
		com.elclab.proveit.getRefbox().scrollToIndex(com.elclab.proveit.getRefbox().itemCount - 1);
		com.elclab.proveit.clearAddCitation(box);
		com.elclab.proveit.getRefbox().selectedIndex = com.elclab.proveit.getRefbox().itemCount - 1;
		//com.elclab.proveit.log("Exiting addCitation.");
	},

	// Clears the add citation box.
	clearAddCitation : function(box)
	{
		//com.elclab.proveit.log("Entering clearAddCitation.")
		if(box == null)
		{
			com.elclab.proveit.log("clearAddCitation is null.  Returning false.");
			return false;
		}
		for(var i = box.childNodes.length - 3; i >= 1; i--)
		{
			if(box.childNodes[i].id == "dummyCreateRow")
				box.removeChild(box.childNodes[i]);
		}

		var fields = box.getElementsByTagName("textbox");
		for(var i = 0; i < fields.length; i++)
		{
			fields[i].value = "";
		}
	},

	/**
	 * Add new row to add new citation box.
	 *
	 * @param {}
	 *            type the type/name of the extra field to open.
	 */
	openExtra : function(type) {
		/*var showable = com.elclab.proveit.getSidebarDoc().getElementById(type + "extra");
		var current = showable.hidden;
		showable.hidden = !current;
		*/
		//com.elclab.proveit.log("Entering openExtra");
		var newline = com.elclab.proveit.getSidebarDoc().getElementById("dummyCreateRow").cloneNode(true);
		newline.hidden = false;

		var wrapper = com.elclab.proveit.getSidebarDoc().getElementById(type);
		wrapper.insertBefore(newline, wrapper.childNodes[wrapper.childNodes.length - 2]);

	},

	// Removes the last field in the add new citation box.
	newRemoveField : function(type){
		var wrapper = com.elclab.proveit.getSidebarDoc().getElementById(type);
		wrapper.removeChild(wrapper.childNodes[wrapper.childNodes.length - 3]);
	},

	// Clear all rows of passed in add citation panes.
	clearCitePanes : function(citePanes)
	{
		//com.elclab.proveit.log("Entering clear cite panes");
		//com.elclab.proveit.log("citePanes.childNodes.length: " + citePanes.childNodes.length);

		for(var i = 0; i < citePanes.childNodes.length; i++)
		{
			// id and hidden temp only for debugging.
			/*
			var id = citePanes.childNodes[i].id
			var hidden = citePanes.childNodes[i].hidden;
			*/
			if(citePanes.childNodes[i].hidden == false)
			{
				citePanes.removeChild(citePanes.childNodes[i]);
				//com.elclab.proveit.log("clearCitePanes: Removing child at index " + i + ", id: " + id);
			}
			/*
			else
			{
				com.elclab.proveit.log("clearCitePanes: Not removing child at index " + i + ", id: " + id + ", hidden = " + hidden);
			}
			*/
		}
	},

	/**
	 * Changes the panel for the cite entry panel to the correct type of entry
	 */
	changeCite : function(menu) {
		//com.elclab.proveit.log("Entering changeCite");
		//com.elclab.proveit.log("menu.id: " + menu.id);
		var citePanes = menu.parentNode.nextSibling;
		com.elclab.proveit.clearCitePanes(citePanes);
		/*
		var that = com.elclab.proveit.getSidebarDoc().getElementById("citemenu").value;
		that = com.elclab.proveit.getSidebarDoc().getElementById(that);
		var childlist = com.elclab.proveit.getSidebarDoc().getElementById("citepanes").childNodes;
		for (var i = 0; i < childlist.length; i++) {
			childlist[i].hidden = true;
		}
		com.elclab.proveit.clearAddCitation(that);
		that.hidden = false;
		*/
		var citeType = menu.value;
		//com.elclab.proveit.log("citeType: " + citeType);
		var genPane = com.elclab.proveit.getSidebarDoc().getElementById("dummyCitePane").cloneNode(true);
		genPane.id = citeType;
		var nameHbox = genPane.firstChild;
		nameHbox.childNodes[0].setAttribute("control", citeType + "name");
		nameHbox.childNodes[1].id = citeType + "name";
		// The extraHbox will probably get eliminated altogether later.
		var extraHbox = genPane.childNodes[genPane.childNodes.length - 2];
		extraHbox.firstChild.id = citeType + "extra";
		var endHbox = genPane.childNodes[genPane.childNodes.length - 1];
		var addButton = endHbox.childNodes[0];
		addButton.id = citeType + "expand";
		//com.elclab.proveit.log("Modifying onclick handlers.");
		addButton.onclick = null; // regular set attribute onclick caused inconsistent state.  Try this.
		addButton.onclick = function()
		{
			com.elclab.proveit.openExtra(citeType);
		};
		endHbox.childNodes[1].setAttribute("onclick", "com.elclab.proveit.newRemoveField('" + citeType + "');");
		var submitButton = endHbox.childNodes[2];
		submitButton.id = citeType + "submit";
		submitButton.setAttribute("onclick", "com.elclab.proveit.addCitation('" + citeType + "');");

		// Somewhat hackish.  What's a better way?
		var citeObj;
		if(menu.id == "citemenu")
		{
			citeObj = new com.elclab.proveit.Cite();
		}
		else
		{
			citeObj = new com.elclab.proveit.Citation();
		}
		citeObj.type = citeType;
		var descs = citeObj.getDescriptions();
		var defaultParams = citeObj.getDefaultParams().slice(0); // copy
		defaultParams.sort(citeObj.getSorter());
		var required = citeObj.getRequiredParams();
		for(var i = 0; i < defaultParams.length; i++)
		{
			var param = defaultParams[i];
			var paramBox = com.elclab.proveit.getSidebarDoc().getElementById("dummyCiteParam").cloneNode(true);
			var label = com.elclab.proveit.getSidebarDoc().createElement("label");
			label.setAttribute("value", "<ref> name");
			label.setAttribute("flex", "1");
			label.setAttribute("minwidth", "145");
			paramBox.insertBefore(label, paramBox.firstChild); //bug

			var star = com.elclab.proveit.getSidebarDoc().getElementById("star").cloneNode(true);
			star.id = "";
			star.style.display = "-moz-box";
			star.style.visibility = (required[param] ? "visible" : "hidden"); // CurStar will appear if field is required."
			paramBox.insertBefore(star, label);


			paramBox.id = "";
			// Basically the same code as nameHbox above
			var paramLabel = paramBox.childNodes[1];
			paramLabel.setAttribute("control", citeType + param);
			if(!descs[param])
			{
				throw new Error("Undefined description for param: " + param);
			}
			paramLabel.setAttribute("value", descs[param]);

			paramBox.childNodes[2].id = citeType + param;
			paramBox.hidden = false;
			genPane.insertBefore(paramBox, extraHbox);
		}
		genPane.hidden = false;
		citePanes.insertBefore(genPane, citePanes.firstChild);
	},

	/**
	 * changes the panel for the citation entry panel to the correct type of
	 * entry
	 */
	/*
	changeCitation : function() {
		var that = com.elclab.proveit.getSidebarDoc().getElementById("citationmenu").value;
		that = com.elclab.proveit.getSidebarDoc().getElementById(that);
		var childlist = com.elclab.proveit.getSidebarDoc().getElementById("citationpanes").childNodes;
		for (var i = 0; i < childlist.length; i++) {
			childlist[i].hidden = true;
		}
		that.hidden = false;
	},
	*/

	/**
	 * Generates rich list item and all children, to be used by addNewElement, and when updating
	 *
	 * @param ref reference to generate from
	 * @param generatedName name to use.
	 * @return
	 */
	getRefboxElement : function(ref, generatedName)
	{
		//com.elclab.proveit.log("Entering getRefboxElement.")
		//com.elclab.proveit.log("ref: " + ref + "; generatedName: " + generatedName);
		var refName = ref["name"]; //may be null or blank

		var refbox = com.elclab.proveit.getRefbox();

		/*
		if(refName == "Prime")
		{
			com.elclab.proveit.log("Prime detected.");
			refName = "";
		}*/

		// grab the list
		// refbox.rows = 5;
		// get the number of rows, used to give id's to the new item
		// grab some input from the textbox
		// create a new richlistitem from the dummy prototype.
		var dummy = com.elclab.proveit.getSidebarDoc().getElementById("prime");
		if(dummy == null)
		{
			//com.elclab.proveit.log("Prime dummy item is not loaded yet.");
			return false;
		}
		var newchild = dummy.cloneNode(true);
		if(!ref.isValid())
		{
			// Flag as invalid.
			newchild.className = newchild.className + " badReference";
		}
		// grab the nodes that need changed out of it
		var newlabel = newchild.firstChild.childNodes[0];
		var infoholder = newchild.firstChild.childNodes[1];
		var neweditimage = newchild.firstChild.childNodes[3];
		var newinsertimage = newchild.firstChild.childNodes[5];
		// change the necessary information in those nodes, as well as
		// change the dummy node to not hidden. note the use of num in id's

		newchild.id = generatedName;
		newchild.hidden = false;

		var newTooltip = com.elclab.proveit.getSidebarDoc().getElementById("dummy_tooltip").cloneNode(true);
		newTooltip.id = generatedName + "_tooltip";
		newTooltip.setAttribute("orient", "vertical");

		var genNameLabel = newTooltip.childNodes[1];
		genNameLabel.id = generatedName + "_genName_label";
		genNameLabel.setAttribute("value", generatedName);

		if(refName && refName != "")
		{
			var refNameHBox = newTooltip.childNodes[0];
			refNameHBox.id = generatedName + "_refName_hbox";
			refNameLabel = refNameHBox.childNodes[2];
			refNameLabel.setAttribute("value", refName);
		}
		else
		{
			newTooltip.removeChild(newTooltip.childNodes[0]);
		}

		newTooltip.setAttribute("hidden", "false");
		newchild.firstChild.appendChild(newTooltip);
		newchild.firstChild.childNodes[0].setAttribute("tooltip", newTooltip.id);

		var doEdit = function() {
			com.elclab.proveit.getRefbox().selectItem(newchild);
			//com.elclab.proveit.log("Item edit clicked");
			com.elclab.proveit.getSidebarDoc().getElementById("edit").openPopup(neweditimage, "end_before", 0, 0,
					false, false);
		};

		newchild.addEventListener("dblclick", doEdit, false);

		neweditimage.id = generatedName + "image";
		neweditimage.addEventListener("click", doEdit, false);

		newinsertimage.id = generatedName + "insertimage"; // probably isn't necessary
		newinsertimage.addEventListener("click", function() {
			com.elclab.proveit.getRefbox().selectItem(this.parentNode);
			com.elclab.proveit.insertSelectedRef();
		}, false); // True may ensure row is selected prior to attempting to insert.

		/*
		newinsertimage.parentNode.parentNode.addEventListener("select", function() {
			com.elclab.proveit.log("Entering newinsertimage select handler and setting highlightOnSelect false");
			com.elclab.proveit.highlightOnSelect = false;
		}, false);
		*/

		newinsertimage.addEventListener("click", function() {
			//com.elclab.proveit.log("Entering newinsertimage click handler and setting highlightOnSelect false");
			com.elclab.proveit.highlightOnSelect = false;
		}, false);

		newlabel.id = generatedName + "label";
		//com.elclab.proveit.log("newlabel.id: " + newlabel.id);
		// not sure why this is necessary, but it's the only way to get it to
		// work in ff3
		// you have to add the item to the page before you can change the value
		// and control.id
		/*com.elclab.proveit.getSidebarDoc().getElementById(generatedName + "label").value = generatedName;
		com.elclab.proveit.getSidebarDoc().getElementById(generatedName + "label").control = "refbox";
		*/
		newlabel.setAttribute("value", generatedName);
		newlabel.setAttribute("control", "refbox");
		// add an event listener to the edit image
		// this will only matter on the ff2 compliant version
		// return the id so the caller functions can set up the citation text
		// deprecated
		return newchild;
	},

	// Ensures the generated name is not already used by adding numeric suffix.
	genNameWithoutDuplicates : function(generatedName)
	{
	    var refbox = com.elclab.proveit.getRefbox();
	    if(refbox == null)
	    {
	    	//com.elclab.proveit.log("genNameWithoutDuplicates: refbox is null");
	    	return null;
	    }
	    var bad = false;
	    for (var i = 0; i < refbox.childNodes.length; i++) {
		if (refbox.childNodes[i].id == generatedName) {
		    bad = true;
		    //com.elclab.proveit.log("genNameWithoutDuplicates: name: " + generatedName);
		    break;
		}
	    }
	    // if there is, add a number surrounded by parens to the name at the end
	    if (com.elclab.proveit.getSidebarDoc().getElementById(generatedName) && bad) {
		var num = 1;
		while (true) {
		    if (!com.elclab.proveit.getSidebarDoc().getElementById(generatedName + "(" + num + ")")) {
			generatedName = generatedName + "(" + num + ")";
			break;
		    }
		    num++;
		}
	    }

	    return generatedName;
	},

	/**
	 * Only to be used internally to add the citations to the list
	 *
	 * @param ref the reference to add
	 * @return the id of the child so that we can add info to it, will be
	 *         used to tie the meta-data to the list.
	 */
	addNewElement : function(ref) {

		var generatedName = com.elclab.proveit.getGeneratedName(ref);
		ref.baseGenName = generatedName;

		// first check to see if there is a node with this name already
		var refbox = com.elclab.proveit.getRefbox();

		generatedName = com.elclab.proveit.genNameWithoutDuplicates(generatedName);
		if(generatedName == null)
		{
			//com.elclab.proveit.log("addNewElement: genNameWithoutDuplicates returned null.");
			return null;
		}

		refbox.appendChild(com.elclab.proveit.getRefboxElement(ref, generatedName));

		return generatedName;
	},

	// Closes add new citation pane without adding anything.

	cancelAdd : function()
	{
		var box = com.elclab.proveit.getSidebarDoc().getElementById(com.elclab.proveit.getSidebarDoc().getElementById("citemenu").value);
		com.elclab.proveit.clearAddCitation(box);
		com.elclab.proveit.getSidebarDoc().getElementById('createnew').hidePopup();
	}
}

/**
 * Generic trim function, trims all leading and trailing whitespace.
 *
 * @return the trimmed string
 */
String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g, "");
}

