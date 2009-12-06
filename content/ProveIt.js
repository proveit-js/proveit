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
	KNOWN_HOSTS : ["de.wikipedia.org", "en.wikipedia.org", "secure.wikimedia.org"],

	KNOWN_ACTIONS : ["edit", "submit"],

	KNOWN_NAMESPACES : [""],

	LANG : "en", // currently used only for descriptions.

	//Text before param name (e.g. url, title, etc.) in creation box, to avoid collisions with unrelated ids.
	NEW_PARAM_PREFIX : "newparam",

	//Text before param name (e.g. url, title, etc.) in edit box, to avoid collisions with unrelated ids.
	EDIT_PARAM_PREFIX : "editparam",

	// Preferences object (nsIPrefBranch)
	prefs : null,

	consoleService : Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService),

	// Convenience log function
	log : function(str)
	{
		this.consoleService.logStringMessage("[ProveIt] " + str);
	},

	// Returns true if we are on a known domain, and the action is set to edit or submit
	isSupportedEditPage : function()
	{
		this.log("Entering isSupportedEditPage");
		try
		{
			var url = top.getBrowser().currentURI;
			var path = url.path;
			return this.KNOWN_HOSTS.indexOf(url.host) != -1 && // Known host
				this.KNOWN_ACTIONS.indexOf(window.content.wrappedJSObject.wgAction) != -1 && // Known action
				this.KNOWN_NAMESPACES.indexOf(window.content.wrappedJSObject.wgCanonicalNamespace) != -1; // Known namespace
		}
		catch(e if e.name == "NS_ERROR_FAILURE")
		{
			this.log("isSupportedEditPage: NS_ERROR_FAILURE: " + e);
			this.log("isSupportedEditPage: Returning false.");
			return false;
		}
	},

	/* If we are currently on an appropriate MediaWiki page as determined by isSupportedEditPage()
	   open the sidebar.
	*/
	openIfSupportedEditPage : function ()
	{
		this.log("Entering openIfSupportedEditPage");
		//this.log("windURL: " + windURL.spec);

		if(!com.elclab.proveit.isSupportedEditPage())
        {
        	//this.log("Not MediaWiki");
	    	com.elclab.proveit.closeSidebar();
		}
        else
        {
        	//this.log("Is MediaWiki");
        	//if(!isOpen)
        	com.elclab.proveit.openSidebar();
	    }
	},


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
		return this.getSidebarDoc().getElementById("refbox");
	},

	/*
	 * Returns true if and only if ProveIt sidebar is open.
	 */
	isSidebarOpen : function()
	{
		//this.log("Entering isSidebarOpen.");
		var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
			 .getInterface(Components.interfaces.nsIWebNavigation)
			 .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
			 .rootTreeItem
			 .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
			 .getInterface(Components.interfaces.nsIDOMWindow);

		//this.log("hidden: " + mainWindow.document.getElementById("sidebar-box").hidden);

		//var isOpen = (location.href == "chrome://proveit/content/ProveIt.xul");
		// Above line WILL NOT always work, because context of location.href varies.

		var loc = document.getElementById("sidebar").contentWindow.location.href;
		var isOpen = (loc == "chrome://proveit/content/ProveIt.xul");
		//this.log("location is: " + loc);

		//var isOpen = com.elclab.proveit.isSidebarOpenBool;

		//this.log("isOpen: " + isOpen);

		return isOpen;
	},

	// Ensures ProveIt sidebar is open.
	openSidebar : function()
	{
		this.log("Entering openSidebar");
		var alreadyOpen = com.elclab.proveit.isSidebarOpen();
		this.log("openSidebar: alreadyOpen: " + alreadyOpen);
		var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
			 .getInterface(Components.interfaces.nsIWebNavigation)
			 .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
			 .rootTreeItem
			 .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
			 .getInterface(Components.interfaces.nsIDOMWindow);
		mainWindow.toggleSidebar("viewProveItSidebar", true);
		if(alreadyOpen)
		{
			this.log("openSidebar: Already open, so calling proveitonload manually.");
			com.elclab.proveit.proveitonload();
		}

		//com.elclab.proveit.isSidebarOpenBool = true;
	},

	// Ensures ProveIt sidebar is closed.

	closeSidebar : function()
	{
		this.log("Entering closeSidebar");

		var isOpen = com.elclab.proveit.isSidebarOpen();
		if(isOpen)
		{
			//this.log("Attemping to close sidebar.");
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
			 //this.log("Setting isSidebar false");
			 //com.elclab.proveit.isSidebarOpenBool = false;
		}
	},

	// Hard coded constant representing the number of vertical pixels half of textarea takes place.
	HALF_EDIT_BOX_HEIGHT : 204,

	/**
	 * Provides the x (left) and y (top) offsets to a given element.  From QuirksMode (http://www.quirksmode.org/js/findpos.html), a freely available site by Peter-Paul Koch
	 * @param node
	 * @return offsets to node, as object with left and top properties.
	 */
	getPosition : function(node)
	{
		var left = 0, top = 0;
		do
		{
			left += node.offsetLeft;
			top += node.offsetTop;
		} while (node = node.offsetParent);
		return {"left": left, "top": top};
	},

	// Highlights a given string in the MediaWiki edit box.
	highlightTargetString : function(targetStr)
	{
		this.log("Entering highlightTargetString");
		var mwBox = com.elclab.proveit.getMWEditBox();
		var editTop = this.getPosition(this.getEditForm()).top;
		content.window.scroll(0, editTop);
		var origText = mwBox.value;
		var startInd = origText.indexOf(targetStr);
		if(startInd == -1)
		{
			this.log("Target string \"" + targetStr + "\" not found.");
			return false;
		}
		var endInd = startInd + targetStr.length;
		mwBox.value = origText.substring(0, startInd);
		mwBox.scrollTop = 1000000; //Larger than any real textarea (hopefully)
		var curScrollTop = mwBox.scrollTop;
		mwBox.value += origText.substring(startInd);
		if(curScrollTop > 0)
		{
			mwBox.scrollTop = curScrollTop + this.HALF_EDIT_BOX_HEIGHT;
		}
		mwBox.focus();
		mwBox.setSelectionRange(startInd, endInd);
		this.log("Exiting highlightTargetString");
		return true;
	},

	// Convenience function.  Returns MediaWiki text area.
	getMWEditBox : function()
	{
		var textareaname;
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
		//this.log("Entering addOnsubmit.");
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
						this.log("ProveIt already in summary.");
					}
					 */
				});
				com.elclab.proveit.summaryActionAdded = true;
			}
			catch(e)
			{
				this.log("Failed to add onsubmit handler. e.message: " + e.message);
			}
		}
		/*
		else
		{
			this.log("Not adding to summary.");
			this.log("com.elclab.proveit.shouldAddSummary: " + com.elclab.proveit.shouldAddSummary);
			this.log("com.elclab.proveit.prefs.getBoolPref(\"shouldAddSummary\"): " + com.elclab.proveit.prefs.getBoolPref("shouldAddSummary"));
 		}
		 */
	},

	// This function sets things up so ProveIt will automatically load on a MediaWiki site.
	proveitpreload : function()
	{
		this.log("Entering proveitpreload.");
		top.getBrowser().addProgressListener(com.elclab.proveit.sendalert,
				com.elclab.proveit.NOTIFY_STATE_DOCUMENT);
		return true; // Is this necessary to ensure Firefox doesn't gray out buttons?
	},


	/*
	 * onload and onunload event handlers tied to the sidebar. These tie the
	 * event handler into the browser and remove it when finished.
	 */

	// Runs when we actually want to load the sidebar
	proveitonload : function() {
		this.log("Entering proveitonload");
		com.elclab.proveit.prefs = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
			.getBranch("com.elclab.proveit.");
		com.elclab.proveit.prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);
		//this.log("About to add observer.  What's this then?: " + this);
		com.elclab.proveit.prefs.addObserver("", com.elclab.proveit, false);
		com.elclab.proveit.shouldAddSummary = com.elclab.proveit.prefs.getBoolPref("shouldAddSummary");
		//this.log("com.elclab.proveit.shouldAddSummary: " + com.elclab.proveit.shouldAddSummary);

		com.elclab.proveit.summaryActionAdded = false;

		if(com.elclab.proveit.isSupportedEditPage())
		{
			//this.log("Calling scanRef from proveitonload.");
			com.elclab.proveit.scanRef();
		}

		window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
			.getInterface(Components.interfaces.nsIWebNavigation)
			.QueryInterface(Components.interfaces.nsIDocShellTreeItem)
			.rootTreeItem
			.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
			.getInterface(Components.interfaces.nsIDOMWindow).document.getElementById("ProveIt-status-bar").className = "open";

		return true;
	},

	// Runs when the sidebar is being unloaded.
	proveitonunload : function() {
		this.log("Entering proveitunload");
		if(com.elclab.proveit.prefs)
		{
			com.elclab.proveit.prefs.removeObserver("", com.elclab.proveit);
		}

		window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
			.getInterface(Components.interfaces.nsIWebNavigation)
			.QueryInterface(Components.interfaces.nsIDocShellTreeItem)
			.rootTreeItem
			.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
			.getInterface(Components.interfaces.nsIDOMWindow).document.getElementById("ProveIt-status-bar").className = "closed";

		//top.getBrowser().removeProgressListener(com.elclab.proveit.sendalert);
		//com.elclab.proveit.isSidebarOpenBool = false;
	},

	// Toggles the sidebar closed then open to avoid inconsistent state.
	respawn : function()
	{
		this.log("Entering respawn.");
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
     		        this.log("Preference change detected.");
     			com.elclab.proveit.shouldAddSummary = com.elclab.proveit.prefs.getBoolPref("shouldAddSummary");
     			this.log("com.elclab.proveit.shouldAddSummary: " + com.elclab.proveit.shouldAddSummary);
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

				com.elclab.proveit.openIfSupportedEditPage();
				if(com.elclab.proveit.isSidebarOpen())
				{
					//com.elclab.proveit.log("Reloading sidebar from onLocationChange.")
					com.elclab.proveit.respawn();
				}
				//com.elclab.proveit.proveitonload();

				if(com.elclab.proveit.isSupportedEditPage())
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

					com.elclab.proveit.openIfSupportedEditPage();
					if(com.elclab.proveit.isSupportedEditPage())
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
		//this.log("Entering clearList.");
		// var deletion = function(box) {
		// for (var i = 0; i < box.childNodes.length; i++) {
		// // deletion(box.childNodes[i]);
		// box.removeChild(box.childNodes[i]);
		// }
		// }
		var box = com.elclab.proveit.getRefbox();
		if(box == null)
		{
			//this.log("Ref box is not loaded yet.");
			return false;
		}
		var size = box.childNodes.length;
		// this.log(size);
		for (var i = 0; i < size; i++)
		{
			var item = box.removeChild(box.childNodes[0]);
		}
	},

	/** Does insertion into edit box.
	 * @param ref Reference to insert
	 * @param full Whether to insert the full text.
	 */
	insertRef : function(ref, full)
	{
		var txtarea = com.elclab.proveit.getMWEditBox();
		if(!txtarea)
		{
			this.log("insertRef: txtarea is null");
			return false;
		}
		var insertionText = ref.getInsertionText(full);

		// save textarea scroll position
		var textScroll = txtarea.scrollTop;
		// get current selection
		txtarea.focus();
		var startPos = txtarea.selectionStart;
		var endPos = txtarea.selectionEnd;
		var selText = txtarea.value.substring(startPos, endPos);
		// insert tags
		txtarea.value = txtarea.value.substring(0, startPos) + insertionText
				+ txtarea.value.substring(endPos, txtarea.value.length);
		// set new selection

		txtarea.selectionStart = startPos;
		txtarea.selectionEnd = txtarea.selectionStart + insertionText.length;

		// restore textarea scroll position
		txtarea.scrollTop = textScroll;

		com.elclab.proveit.includeProveItEditSummary();
	},

	/**
	 * Modifies citation object from user-edited GUI.  Note that the modification of citeObj is done in-place, so the return value is only for convenience.
	 *
	 * @param editBox the root element of edit popup/dialog.
	 * @param citeObj the original citation object we're modifying
	 *
	 * @return citeObj
	 */
	citationObjFromEditPopup : function(citeObj, editBox)
	{
		this.log("Entering citationObjFromEditPopup");
		var paramBoxes = editBox.getElementsByClassName("paramlist")[0].getElementsByTagName("hbox");
		var refNameValue = editBox.getElementsByClassName("refname")[0];
		if(refNameValue.value != "")
		{
			var newName = refNameValue.value;
			citeObj.name = newName;
		}
		else
		{
		        citeObj.name = null; // Save blank names as null
		}

		// Clear old params
		citeObj.params = {};

		var paramName, paramVal;
		for (var i = 0; i < paramBoxes.length; i++)
		{
			// this.log(item + ":" + paramBoxes[item].id);
			//this.log("item: " + i);
			var paramRow = paramBoxes[i];
			var valueTextbox = paramRow.getElementsByClassName("paramvalue")[0];
			if(paramRow.className == "addedrow") // Added with "Add another field"
			{
				paramName = paramRow.getElementsByClassName("paramname")[0].value.trim();
			}
			else
			{
				paramName = valueTextbox.id.substring(com.elclab.proveit.EDIT_PARAM_PREFIX.length);
			}
			this.log("paramName: " + paramName);
			paramVal = valueTextbox.value.trim();

			this.log("paramVal: " + paramVal);

			if (paramName != "" && paramVal != "")
			{
				//this.log("Setting " + paramName + "= " + paramVal);
				citeObj.params[paramName] = paramVal;
			}
		}
		if (citeObj.toString() != citeObj.orig)
		{
			citeObj.save = false;
		}
		this.log("Returning from citationObjFromEditPopup");
		return citeObj;
	},

	/**
	 * @param citeObj actual citation object.
	 */

	// Saves the changes the user made in the edit popup.
	saveEdit : function(citeObj)
	{
		//this.log("Entering saveEdit");
		if(!citeObj.save)
		{
			var newRichItem = this.makeRefboxElement(citeObj);
			var oldRichItem = this.getRefbox().selectedItem;
			oldRichItem.parentNode.replaceChild(newRichItem, oldRichItem);
			this.getRefbox().selectItem(newRichItem);

			citeObj.updateInText();
			this.includeProveItEditSummary();
		}
	},

	/*
	 * Updates the edit window (popup that appears when you click pencil icon).
	 * Moved from doSelect/dispSelect
	 */
	updateEditPopup : function(editWin, ref)
	{
		this.log("Entering updateEditPopup.");
		var editlist = editWin.document.getElementById("editlist");

		editWin.document.getElementById("editlabel").value = ref.getEditLabel();

		var refNameValue = editWin.document.getElementById("editrefname");
		if(ref.name)
		{
			refNameValue.value = ref.name;
		}
		else
		{
			refNameValue.value = "";
		}

		// Don't contaminate actual object with junk params.
		var tempParams = {};
		for(e in ref.params)
		{
			tempParams[e] = ref.params[e];
		}

		// Add default params with blank values.
		var defaults = ref.getDefaultParams();
		for(var i = 0; i < defaults.length; i++)
		{
			if(!tempParams[defaults[i]])
			{
				//this.log("Setting default blank parameter: defaults[i] = " + defaults[i]);
				tempParams[defaults[i]] = "";
			}
		}

		var required = ref.getRequiredParams();

		var paramNames = new Array();

		for(item in tempParams)	//First run through just to get names.
		{
			//this.log(item);
			paramNames.push(item);
		}

		var sorter = ref.getSorter();
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

		for(var i = 0; i < paramNames.length; i++)
		{
			//this.log("Calling addPopupRow on tempParams." + item);
			//this.log("i: " + i + ", paramNames[i]: " + paramNames[i]);
			com.elclab.proveit.addPopupRow(editWin, tempParams, ref.getDescriptions(), paramNames[i], required[paramNames[i]], true);
		}
		editWin.sizeToContent();
	},

	/**
	 * Adds a single row of popup
	 * @param rootWin root window for popup
	 * @param list the param list from the reference, or null for added rows.
	 * @param descs description array to use, or null for no description
	 * @param item the current param name
	 * @param req true if current param name is required, otherwise not required.
	 * @param fieldType true for label, false for textbox.
	 */
	addPopupRow : function(rootWin, list, descs, item, req, fieldType)
	{

		this.log("Entering addPopupRow.");
		/*
		this.log("item: " + item);
		this.log("req: " + req);
		this.log("fieldType: " + fieldType);
		*/

		var id = fieldType ? "preloadedparamrow" : "addedparamrow";
		this.log("addPopupRow: document: " + document);
		var newline = this.getSidebarDoc().getElementById(id).cloneNode(true);
		newline.id = "";
		com.elclab.proveit.activateRemove(newline);
		var paramName = newline.getElementsByClassName("paramdesc")[0];
		var paramValue = newline.getElementsByClassName("paramvalue")[0];

		newline.hidden = false;
		rootWin.document.getElementsByClassName("paramlist")[0].appendChild(newline);

		var star = this.getSidebarDoc().getElementById("star").cloneNode(true);
		star.id = "";
		star.style.display = "-moz-box"; // back to default display prop.
		star.style.visibility = (req ? "visible" : "hidden"); // Star will appear if field is required.
		newline.insertBefore(star, newline.firstChild);

		if(fieldType)
		{
			paramName.setAttribute("control", com.elclab.proveit.EDIT_PARAM_PREFIX + item);
			paramValue.id = com.elclab.proveit.EDIT_PARAM_PREFIX + item;

			var desc = descs[item];
			if(!desc)
			{
				this.log("Undefined description for param: " + item + ".  Using directly as description.");
				desc = item;
			}

			paramName.setAttribute("value", desc);
			paramValue.setAttribute("value", list[item]);
		}
		else
		{
			rootWin.sizeToContent();
		}
	},

	/*
	 * these are the current style and insert values to denote which one is
	 * currently active
	 */

	// togglestyle true signifies cite-style references, citation-style otherwise.  Used when creating a reference.
	togglestyle : true,

	/* toggleinsert true signifies full references, name-only otherwise.  Used when inserting.
	 * Note that new references are always inserted in full.
	 *
	 * TODO: This should be eliminated if only name only inserts are allowed.
	 */
	toggleinsert : false,

	/* This whole function is something of a hack.  Basically, it detects the current state of the "physical" toggle,
	 * and updates variables accordingly.
	 */
	flipToggle : function(toggle) {
		var label = this.getSidebarDoc().getElementById(toggle + "toggle");
		label.setAttribute("style", "font-weight: bold");
		if (toggle == "full") {
			this.getSidebarDoc().getElementById('nametoggle').setAttribute("style",
					"font-weight: normal");
			com.elclab.proveit.toggleinsert = true;
		} else if (toggle == "name") {
			this.getSidebarDoc().getElementById('fulltoggle').setAttribute("style",
					"font-weight: normal");
			com.elclab.proveit.toggleinsert = false;
		} else if (toggle == "cite") {
			this.getSidebarDoc().getElementById('citationtoggle').setAttribute("style",
					"font-weight: normal");
			com.elclab.proveit.togglestyle = true;
		} else if (toggle == "citation") {
			this.getSidebarDoc().getElementById('citetoggle').setAttribute("style",
					"font-weight: normal");
			com.elclab.proveit.togglestyle = false;
		}
	},

	/**
	 * Overly clever regex to parse template string (e.g. |last=Smith|first=John|title=My Life Story) into name and value pairs.
	 * @param workingstring template string to parse.
	 * @return Object with two properties, nameSplit and valSplit.
	 * nameSplit is an array of all names, and valSplit is an array of all values.
	 * While the length of nameSplit is equal to the number of name/value pairs (as expected),
	 * the length of valSplit is one greater due to a blank element at the beginning.
	 * Thus nameSplit[i] corresponds to valSplit[i+1].
	 * Calling code must take this into account.
	 *
	 * TODO: Remove the split code, and just use a regular regex (with two main groups for name and val), iteratively. Regex.find?  Make name and val indices match, and rework calling code as needed.  Also, check how this was done in the original code.
	 */
	splitNameVals : function (workingstring)
	{
		var split = {};
		split.nameSplit = workingstring.substring(workingstring.indexOf("|") + 1).split(/=(?:[^|]*?(?:\[\[[^|\]]*(?:\|(?:[^|\]]*))?\]\])?)+(?:\||\}\})/
); // The first component is "ordinary" text (no pipes), while the second is a correctly balanced wikilink, with optional pipe.  Any combination of the two can appear.
		split.valSplit = workingstring.substring(workingstring.indexOf("|"), workingstring.indexOf("}}")).split(/\|[^|=]*=/);
		return split;
	},

	/**
	 * This Function accesses the wiki edit box and scans the contained text for
	 * citation tags. It then sets up the display chooser.
	 *
	 * TODO: Replace this with a formal parser, for maintainability.
	 */
	scanRef : function()
	{
		this.log("Entering scanRef.");
		// these are strings used to allow the correct parsing of the tag
		var workingstring;
		var cutupstring;
		var text = this.getMWEditBox();
		if(!text)
		{
			throw new Error("scanRef: MW edit box is not defined.");
		}

		this.clearlist();

		var textValue = text.value;
		// since we should pick the name out before we get to the citation
		// tag type, here's a variable to hold it
		var name, orig;

		// currentScan holds the parsed (match objects) list of citations.
		var currentScan = textValue.match(/<[\s]*ref[^>]*>[\s]*{{+[\s]*(cite|Citation)[^}]*}}+[\s]*<[\s]*\/[\s]*ref[\s]*>/gi);
		// if there are results,
		if (currentScan)
		{
			for (var i = 0; i < currentScan.length; i++)
			{
				//this.log("currentScan[" + i + "]: " + currentScan[i]);
				// TODO.  There shouldn't be a need for the following two regexes.  Just add the name groups to the above (currentScan), put parens around the template itself, and set all the indices appropriately.
				// TODO: A factory function could be appropriate for much of this.
				var citation = this.CitationFactory(currentScan[i]);
				if(citation)
				{
					this.addNewElement(citation);
				}
			}
		}
	},

	/*
	 * Factory function for citations.  Takes text of a citation, and returns instance of the appropriate class.
	 * @param citationText match citation
	 */
	CitationFactory : function(citationText)
	{
		var citeFunction = citationText.match(/{{[\s]*cite/i) ? this.Cite : citationText.match(/{{[\s]*Citation/i) ? this.Citation : null;
		if(!citeFunction)
		{
			return null;
		}
		var workingstring = citationText.match(/{{[\s]*(cite|Citation)[^}]*}}/i)[0];
		var match = citationText.match(/<[\s]*ref[\s]*name[\s]*=[\s]*(?:(?:\"(.*?)\")|(?:\'(.*?)\')|(?:(.*?)))[\s]*\/?[\s]*>/);

		if(match && match != null)
		{
			var name = match[1] || match[2] || match[3]; // 3 possibilities, corresponding to above regex, are <ref name="foo">, <ref name='bar'>, and <ref name=baz>
		}

		//this.log("scanRef: workingstring: " + workingstring);
		var cutupstring = workingstring.split(/\|/g);

		// This little hack relies on the fact that 'e' appears first as the last letter of 'cite', and the type is next.
		if(citeFunction == this.Cite)
		{
			var typestart = cutupstring[0].toLowerCase().indexOf('e');
			// First end curly brace
			var rightcurly = cutupstring[0].indexOf('}');
		// Usually, rightcurly will be -1.  But this takes into account empty references like <ref>{{cite web}}</ref>
			var typeend = rightcurly != -1 ? rightcurly : cutupstring[0].length;
			// grab the type, then trim it.
			var type = cutupstring[0].substring(typestart + 1, typeend).trim();
		}
		// type may be undefined, but that's okay.
		var citation = new citeFunction({"name": name, "type": type, "save": true, "inMWEditBox": true, "orig": citationText});

		var split = this.splitNameVals(workingstring);
		var nameSplit = split.nameSplit;
		var valSplit = split.valSplit;

		for (var j = 0; j < nameSplit.length - 1; j++)
		{
			/* Drop blank space, and |'s without params, which are never correct for
			 citation templates.*/
			var paramName = nameSplit[j].trim().replace(/(?:\s*\|)*(.*)/, "$1");
			var paramVal = valSplit[j + 1].trim();
			// Should there be a setParam function?  It could handle empty values, and even drop (siliently or otherwise) invalid parameters.  Alternatively, should params be passed in the constructor?
			if (paramVal != "")
			{
				citation.params[paramName] = paramVal;
			}
		}
		return citation;
	},

	// Root Citation type
	AbstractCitation : function(argObj)
	{
		// Cite has a non-trivial override of this.
		if(!this.setType)
		{
			this.setType = function(type)
			{
				this.type = type;
			};
		}
		/**
		 <ref name/>
		 */
		this.name = argObj.name;

		/**
		  type of reference, e.g. cite web, cite news.  Also ussed (including for Citation objects) to determine default fields.
		 */
		this.setType(argObj.type);

 		 //TODO: Re-examine whether both (or indeed either) of save or inMWEditBox are really necessary.  Can it be determined from context?

 		/**
		  false indicates "dirty" citation that has yet to be updated in text and metadata.
		*/
		this.save = argObj.save;

		/**
		 true if and only if the ref is in the MW edit box with the same value as this object's orig.
 		 */
		this.inMWEditBox = argObj.inMWEditBox;

		/**
		 original wikitext for reference
		 */
		this.orig = argObj.orig;

		this.params = {};

		/* Used to map between parameter name and human-readable.  It can be
		 * internationalized easily.  Add descriptions.xx , where xx is
		 * the ISO 639-1 code for a language, then set com.elclab.proveit.LANG to "xx"
		 * to use the new descriptions.
		 */

		var descriptions =
		{
			en :
			{
					name: "Name",
					author: "Author (L, F)",
					last: "Last name",
					first: "First name",
					authorlink: "Author article name",
					title: "Title",
					publisher: "Publisher",
					year: "Year",
					location: "Location",
					place: "Location of work",
					isbn: "ISBN",
					id: "ID",
					doi: "DOI",
					pages: "Pages",
					quote: "Quote",
					month: "Month",
					journal: "Journal",
					edition: "Edition",
					volume: "Volume",
					issue: "Issue",
					url: "URL",
					date: "Publication date (YYYY-MM-DD)",
					accessdate: "Access date (YYYY-MM-DD)",
					coauthors: "Co-authors",
					booktitle: "Title of Proceedings",
					contribution: "Contribution/Chapter",
					encyclopedia: "Encyclopedia",
					newsgroup: "Newsgroup",
					version: "Version",
					site: "Site",
					newspaper: "Newspaper",
					"publication-place": "Publication location",
					editor: "Editor (L, F)",
					article: "Article",
					pubplace: "Publisher location",
					pubyear: "Publication year",
					inventor: "Inventor (L, F)",
					"issue-date": "Issue date (YYYY-MM-DD)",
					"patent-number": "Patent Number",
					"country-code": "Country code (XX)",
					work: "Work",
					format: "File format"
			}
		};

		// Convenience method.  Returns sorter.
		this.getSorter = function()
		{
			var thisCite = this;
			// Sorter uses paramSortKey first, then falls back on alphabetical order.
			return function(paramA, paramB)
			{
				var aInd = thisCite.getSortIndex(paramA);
				var bInd = thisCite.getSortIndex(paramB);
				if(aInd != -1 && bInd != -1)
				{
					return aInd - bInd;
				}
				else
				{
					if(paramA < paramB)
					{
						return -1;
					}
					else if(paramA == paramB)
					{
						return 0;
					}
					else
					{
						return 1;
					}
				}
			};
		};

		// Returns descriptions for the current language.
		this.getDescriptions = function()
		{
			//this could be made Cite-specific if needed.
			return descriptions[com.elclab.proveit.LANG];
		};

		// Returns true if this object is valid, false otherwise.
		// Assume all AbstractCitation objects are valid.  Can be overridden in subtypes.
		this.isValid = function(){return true};

		/**
		 * Generates label for reference using title, author, etc.
		 */
		this.getLabel = function()
		{
			var label = "";

			if (this.params.author)
			{
				label = this.params.author + "; ";
			}
			else if (this.params.last)
			{
				label = this.params.last;
				if (this.params.first)
				{
					label += ", " + this.params.first;
				}
				label += "; ";
			}

			if (this.params.title)
			{
				label += this.params.title;
			}

			if(label == "")
			{
				var value;
				for each(value in this.params)
				{
					break;
				}
				if(value) // There could be no parameters
				{
					label = value;
				}
			}
			return label;
		};


		/**
		 * Gets insertion text from reference object.
		 *
		 * TODO: Generate a regex object instead (getInsertionRegExp), so highlighting would not fail due to trivial changes (e.g. spacing).
		 * @param {If full is true, insert full text, otherwise ref name only} full
		 */
		this.getInsertionText = function(full)
		{
			com.elclab.proveit.log("getInsertionText");
			if(full)
			{
				return this.toString();
			}
			else
			{
				if(this.name)
				{
					return "<ref name=\""
						+ this.name + "\" />";
				}
				else
				{
					throw new Error("getInsertionText: ref.name is null");
				}
			}
		};

		/*
		 * This function takes the currently selected or edited reference and
		 * updates it in the edit box.
		 */
		this.updateInText = function()
		{
			var txtarea = com.elclab.proveit.getMWEditBox();

			if (!txtarea || txtarea == null)
				return;

			var textScroll = txtarea.scrollTop;
			// get current selection
			txtarea.focus();
			var startPos = txtarea.selectionStart;
			var endPos = txtarea.selectionEnd;
			var text = txtarea.value;

			text = text.replace(this.orig, this.toString());

			// Do replacement in textarea.
			txtarea.value = text;

			// Baseline for future modifications

			this.orig = this.toString();
			this.save = true;

			com.elclab.proveit.highlightTargetString(this.toString());
		};

		// label used in heading of edit box
		// this.getEditLabel
	},

	// A function representing a Cite style template.
	Cite : function(argObj)
	{
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

		// Sets the type, applying the mappings.  This is up top because it is used in AbstractCitation constructor.
		this.setType = function(rawType)
		{
			var mappedType = typeNameMappings[rawType];
			if(mappedType != null)
				this.type = mappedType;
			else
				this.type = rawType; // Use naive type as fallback.
		};

		com.elclab.proveit.AbstractCitation.call(this, argObj);

		this.getSortIndex = function(param)
		{
			// This is the order fields will be displayed or outputted.

			return [
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
			].indexOf(param);
		};

		// Returns this object as a string.
		this.toString = function() {
			if (this.name) {
				var returnstring = "<ref name=\"";
				returnstring += this.name;
				returnstring += "\">{{cite ";
			} else {
				var returnstring = "<ref>{{cite ";
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

		// References without these parameters will be flagged in red.
		// True indicates required (null, or undefined, means not required)
		var requiredParams =
		{
			web : { "url": true, "title": true},
			book : { "title": true },
			journal : { "title": true },
			conference : { "title": true },
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
		};

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

		this.getEditLabel = function()
		{
			return "cite " + this.type;
		};
	},

	/**
	 * A function for citation style tags.
	 */

	Citation : function(argObj) {
		com.elclab.proveit.AbstractCitation.call(this, argObj);

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
		this.getSortIndex = function(param)
		{
			// This is the order fields will be displayed or outputted.
			return [
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
			].indexOf(param);
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

		this.getRequiredParams = function()
		{
			return requiredParams;
		};

		// Default parameters, to be suggested when editing.
		this.getDefaultParams = function()
		{
			if(this.type)
			{
				return defaultParams[this.type];
			}
			else
			{
				return []; // Can't determine defaults when editing a pre-existing Citation.
			}
		};

		this.getEditLabel = function()
		{
			return "Citation";
		};
	},

	/**
	 * Convert the current contents of the add citation panel to a citation obj (i.e Cite(), Citation())
	 * @param box typepane root of add GUI (pane for specific type, e.g. journal)
         *
	 * TODO: This should be unified with citationObjFromEditPopup
	 *
	 * @return cite object or null if no panel exists yet.
	 */
	citationObjFromAddPopup : function(box)
	{
		this.log("Entering citationObjFromAddPopup");
		// get this working, lots of typing here.

		var type = box.id;
		var refNameValue = box.getElementsByClassName("refname")[0];
		var name;
		if(refNameValue.value != "")
		{
			name = refNameValue.value;
		}

		var citeFunc = this.togglestyle ? this.Cite : this.Citation;
		var tag = new citeFunc({"name": name, "type": type});

		var paramName, paramVal;

		var paramList = box.getElementsByClassName("paramlist")[0];
		for (var i = 0; i < paramList.childNodes.length; i++)
		{
			var paramRow =  paramList.childNodes[i];
			this.log("citationObjFromAddPopup: i: " + i);
			var valueTextbox = paramRow.getElementsByClassName("paramvalue")[0];

			if(paramRow.className == "addedrow") // Added with "Add another field"
			{
				paramName = paramRow.getElementsByClassName("paramname")[0].value.trim();
			}
			else
			{
				paramName = valueTextbox.id.substring(com.elclab.proveit.NEW_PARAM_PREFIX.length);
			}
			this.log("citationObjFromAddPopup: paramRow.childNodes.length: " + paramRow.childNodes.length);
			this.log("citationObjFromAddPopup: valueTextbox.tagName: " + valueTextbox.tagName);
			this.log("citationObjFromAddPopup: valueTextbox.id: " + valueTextbox.id);

			paramVal = valueTextbox.value.trim();
			this.log("citationObjFromAddPopup: paramName: " + paramName + "; paramVal: " + paramVal);
			if(paramName != "" && paramVal != "")
			{ // Non-blank
				tag.params[paramName] = paramVal;
			}
		}
		this.log("Exiting citationObjFromAddPopup");
		return tag;
	},

	/**
	 * Opens the Add Citation modal dialog window, and handles the user's input.
	 */
	openAddCitation : function()
	{
		var winData = {"proveit": this}; // ref will be set to the new reference, or remain null if the dialog is cancelled.
		window.openDialog("add_dialog.xul", "add dialog", "modal=no", winData);
	},

	/**
	 * Called from the add citation panel, this is the function used to
	 * add the actual citation.
	 *
	 * @param tag tag being added
	 */
	addCitation : function(tag) {
		//this.log("Entering addCitation.");
		// get this working, lots of typing here.

		this.addNewElement(tag);

		tag.orig = tag.toString();
		/*
		 * Cycle through the boxes and grab the id's versus the values, watch
		 * for the final box and make sure to grab the type as well
		 */

		com.elclab.proveit.insertRef(tag, true); // true means insert full text here, regardless of global toggle.
		tag.save = true;
		tag.inMWEditBox = true;
		com.elclab.proveit.includeProveItEditSummary();
		com.elclab.proveit.getRefbox().scrollToIndex(com.elclab.proveit.getRefbox().itemCount - 1);
		com.elclab.proveit.getRefbox().selectedIndex = com.elclab.proveit.getRefbox().itemCount - 1;
		this.highlightTargetString(tag.orig);
		this.log("Exiting addCitation.");
	},

	// Clear all rows of passed in add citation panes.
	clearCitePanes : function(citePanes)
	{
		if(citePanes.hasChildNodes())
		{
			citePanes.removeChild(citePanes.firstChild);
		}
	},

	activateRemove : function(row)
	{
		row.getElementsByClassName("remove")[0].addEventListener("command", function()
		{
			row.parentNode.removeChild(row);
			row.ownerDocument.defaultView.sizeToContent(); // This really only makes sense for the edit dialog, but it shouldn't hurt otherwise.
		}, false); // Activate remove button
	},

	/**
	 * Changes the panel for the cite entry panel to the correct type of entry
	 */
	changeCite : function(menu) {
		this.log("Entering changeCite");
		//this.log("menu.id: " + menu.id);

		this.log("changeCite: Calling citationObjFromAddPopup");
		menu.parentNode.parentNode.hidden = false; // cite/citation vbox.

		var citePanes = menu.parentNode.nextSibling;
		this.clearCitePanes(citePanes);
		var newCiteType = menu.value;

		var genPane = this.getSidebarDoc().getElementById("dummyCitePane").cloneNode(true);
		genPane.id = newCiteType;

		// Somewhat hackish.  What's a better way?
		var newCite;
		if(menu.id == "citemenu")
		{
			newCite = new this.Cite({});
		}
		else
		{
			newCite = new this.Citation({});
		}
		newCite.type = newCiteType;
		var descs = newCite.getDescriptions();
		var defaultParams = newCite.getDefaultParams().slice(0); // copy
		defaultParams.sort(newCite.getSorter());
		//var required = newCite.getRequiredParams();

		// Possibly, Cite objects should automatically include default parameters in their param maps.  That would seem to make this simpler.
		for(var i = 0; i < defaultParams.length; i++)
                {
			newCite.params[defaultParams[i]] = "";
		}

		this.log("changeCite: newCite: " + newCite);

		// Should there be a getParamKeys or similar function for this, or even getSortedParamKeys?
		var newParams = [];
		for(param in newCite.params)
		{
			newParams.push(param);
		}
		newParams.sort(newCite.getSorter());
		var required = newCite.getRequiredParams();

		var paramList = genPane.getElementsByClassName("paramlist")[0];
		for(var i = 0; i < newParams.length; i++)
		{
			var param = newParams[i];
			var paramBox;

			var star = com.elclab.proveit.getSidebarDoc().getElementById("star").cloneNode(true);
			star.id = "";
			star.style.display = "-moz-box";
			star.style.visibility = (required[param] ? "visible" : "hidden"); // star will appear if field is required."

			if(descs[param])
			{
				paramBox = com.elclab.proveit.getSidebarDoc().getElementById("preloadedparamrow").cloneNode(true);
				var label = paramBox.getElementsByClassName("paramdesc")[0];
				label.setAttribute("value", descs[param]);
				// Basically the same code as nameHbox above
				label.setAttribute("control", com.elclab.proveit.NEW_PARAM_PREFIX + param);
				paramBox.insertBefore(star, label);
			}
			else
			{
				// Throwing an error here doesn't make sense if user-added fields can be copied over.
				// throw new Error("Undefined description for param: " + param);
				paramBox = com.elclab.proveit.getSidebarDoc().getElementById("addedparamrow").cloneNode(true);
				var nameTextbox = paramBox.getElementsByClassName("paramname")[0];
				nameTextbox.setAttribute("value", param);
				paramBox.insertBefore(star, nameTextbox);
			}
			paramBox.id = "";
			com.elclab.proveit.activateRemove(paramBox);

			paramBox.getElementsByClassName("paramvalue")[0].id = com.elclab.proveit.NEW_PARAM_PREFIX + param;
			this.log("changeCite: param: " + param + "; newCite.params[param]: " + newCite.params[param]);
			//paramBox.childNodes[2].value = newCite.params[param]; // Causes parameters to disappear.  Why?
			paramBox.hidden = false;
			paramList.appendChild(paramBox);
		}
		genPane.hidden = false;
		citePanes.insertBefore(genPane, citePanes.firstChild);
		menu.ownerDocument.defaultView.sizeToContent(); // Resize dialog
		this.log("Exiting changeCite");
	},

	/**
	 * Generates rich list item and all children, to be used by addNewElement, and when updating
	 *
	 * @param ref reference to generate from
	 * @return new richlistitem element for refbox
	 */
	makeRefboxElement : function(ref)
	{
		// this.log("Entering makeRefboxElement.");
		var refName = ref.name; //may be null or blank

		var refbox = this.getRefbox();

		var newchild = this.getSidebarDoc().getElementById("prime").cloneNode(true);
		newchild.id = "";
		if(!ref.isValid())
		{
			// Flag as invalid.
			newchild.className = newchild.className + " badReference";
		}
		// grab the nodes that need changed out of it
		var newlabel = newchild.getElementsByClassName("richitemlabel")[0];
		var neweditimage = newchild.getElementsByClassName("richitemedit")[0];
		var newinsertimage = newchild.getElementsByClassName("richiteminsert")[0];
		newchild.hidden = false;
		var thisproveit = this;
		var tooltip = "";
		if(refName && refName != "")
                {
                        tooltip += this.getSidebarDoc().getElementById("refNameDesc").value + ref.name + "\n";
			newinsertimage.addEventListener("click", function() {
                        thisproveit.getRefbox().selectItem(this.parentNode);
                        thisproveit.insertRef(ref, thisproveit.toggleinsert);
                        }, false); // True may ensure row is selected prior to attempting to insert.
                        newinsertimage.setAttribute("tooltip", "enabled insert tooltip");
                }
                else
                {
                        newinsertimage.setAttribute("disabled", "true");
                        newinsertimage.setAttribute("tooltip", "disabled insert tooltip");
                }
		tooltip += ref.getLabel();
		newchild.setAttribute("tooltiptext", tooltip);

		var doEdit = function() {
			thisproveit.getRefbox().selectItem(newchild);
			var selectedIndex = thisproveit.getRefbox().selectedIndex;
			var winData = {"proveit": thisproveit, "ref": ref};
			window.openDialog("edit_dialog.xul", "edit dialog", "modal=no", winData);
			thisproveit.getRefbox().selectedIndex = selectedIndex;
		};

		newchild.addEventListener("click", function()
		{
			thisproveit.highlightTargetString(ref.orig);
		}, false);

		newchild.addEventListener("dblclick", doEdit, false);

		neweditimage.addEventListener("click", doEdit, false);

		newlabel.setAttribute("value", ref.getLabel());
		newlabel.setAttribute("control", "refbox");
		return newchild;
	},

	/**
	 * Only to be used internally to add the citations to the list
	 *
	 * @param ref the reference to add
	 */
	addNewElement : function(ref)
	{
		var refbox = this.getRefbox();
		refbox.appendChild(this.makeRefboxElement(ref));
	},

  	/**
 	 *
 	 * This avoids showing the prePath (https://developer.mozilla.org/En/Code_snippets/Tabbed_browser) in the titlebar.  It is only necessary if chrome=no.
 	 */
 	setPlainTitle : function()
 	{

 		var tabbrowser = Components.classes['@mozilla.org/appshell/window-mediator;1']
 			.getService(Components.interfaces.nsIWindowMediator)
 			.getMostRecentWindow("navigator:browser")
 			.gBrowser;
 		tabbrowser.updateTitlebar = function()
 		{
 			this.ownerDocument.title = this.contentTitle;
 		};
 		tabbrowser.updateTitlebar();
 	}
};

/**
 * Generic trim function, trims all leading and trailing whitespace.
 *
 * @return the trimmed string
 */
String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g, "");
};
