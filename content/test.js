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

	knownSites : ["wiktionary.org",	"wikipedia.org", "wikinews.org"],
	
	logEnum :
	{
		console : 0,
		alert: 1
	},
	
	logType : 0, // apparently this can not be set to a previous variable.  
	             // It only seemed to work before because it interpreted window.alert when I meant logEnum.alert
	
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
	
	isMediaWikiEditPage : function ()
	{
		var isMediaWiki = null;
		var url = top.getBrowser().currentURI;
		com.elclab.proveit.log("url: " + url.spec);
		
		//com.elclab.proveit.log("Entering isMediaWikiEditPage");
		var found = false;
		var i = 0;
		var host = url.host;
		var path = url.path;
		
		//com.elclab.proveit("host: " + host);
		
		while(!found && i < com.elclab.proveit.knownSites.length)
		{
			if(host.indexOf(com.elclab.proveit.knownSites[i]) != -1)
				found = true;
			i++;
		}
		
		var index;
		
		if(found)
		{
			index = path.indexOf("action=edit");	
			if(index != -1)
				isMediaWiki = true;
		}
		else
			isMediaWiki = false;
			
		com.elclab.proveit.log("host: " + host);
		com.elclab.proveit.log("isMediaWiki: " + isMediaWiki);
        return isMediaWiki;
	},
	
	openOnlyForMediawiki : function ()
	{
		//com.elclab.proveit.log("Entering openOnlyForMediawiki");
		//com.elclab.proveit.log("windURL: " + windURL.spec);
		
		if(!com.elclab.proveit.isMediaWikiEditPage())
        {
        	com.elclab.proveit.log("Not MediaWiki");
	    	com.elclab.proveit.closeSidebar();
		}            
        else
        {
        	com.elclab.proveit.log("Is MediaWiki");
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
	
	DEFAULT_SIDEBAR_WIDTH : 300,
	
	/**
	 * Sets sidebar to hopefully sufficient default width, because resize will be disabled.
	 */
	setDefaultSidebarWidth : function()
	{
		com.elclab.proveit.setSidebarWidth(com.elclab.proveit.DEFAULT_SIDEBAR_WIDTH);
	},
	
	
	/**
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
	
	/**
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
	
	getSidebarDoc : function()
	{
		return window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
		 .getInterface(Components.interfaces.nsIWebNavigation)
 		 .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
         .rootTreeItem
         .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
         .getInterface(Components.interfaces.nsIDOMWindow).document.getElementById("sidebar").contentWindow.document;
	},
	
	getRefbox : function()
	{
		return com.elclab.proveit.getSidebarDoc().getElementById("refbox");
	},
	
	/**
	 * Returns true if and only if ProveIt sidebar is open.
	 */
	isSidebarOpen : function()
	{
		com.elclab.proveit.log("Entering isSidebarOpen.");
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
		com.elclab.proveit.log("location is: " + loc);
		
		//var isOpen = com.elclab.proveit.isSidebarOpenBool;
		
		com.elclab.proveit.log("isOpen: " + isOpen);
		
		return isOpen;
	},
	
	/**
	 * Ensures ProveIt sidebar is open.
	 */
	
	openSidebar : function()
	{
		//com.elclab.proveit.log("Entering openSidebar");
		toggleSidebar("viewProveItSidebar", true);
		//com.elclab.proveit.isSidebarOpenBool = true;
	},
	
	/**
	 * Ensures ProveIt sidebar is closed.
	 */
	
	closeSidebar : function()
	{
		com.elclab.proveit.log("Entering closeSidebar");
		
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
	
	HALF_EDIT_BOX_IN_PIXELS : 204,
	
	highlightTargetString : function(target)
	{
		com.elclab.proveit.log("Entering highlightTargetString");
		var t = com.elclab.proveit.getMWEditBox();
		var origText = t.value; 
		var startInd = origText.indexOf(target); 
		var endInd = startInd + target.length; 
		t.value = origText.substring(0, startInd); 
		t.scrollTop = 1000000; //Larger than any real textarea (hopefully)
		var curScrollTop = t.scrollTop; 
		t.value += origText.substring(startInd); 
		t.scrollTop = curScrollTop + com.elclab.proveit.HALF_EDIT_BOX_IN_PIXELS; 
		t.focus(); 
		t.setSelectionRange(startInd, endInd); 
		//alert(curScrollTop);
	},
		
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
			return;
		}
		
		return top.window.content.document.getElementById(textareaname);
	},
	
	proveitpreload : function()
	{
		com.elclab.proveit.log("Entering proveitpreload.")
		top.getBrowser().addProgressListener(com.elclab.proveit.sendalert,
				com.elclab.proveit.NOTIFY_STATE_DOCUMENT);
		return true; // Is this necessary to ensure Firefox doesn't gray out buttons?
	},
	
	proveitonload : function() {
		//com.elclab.proveit.isSidebarOpenBool = true;
		com.elclab.proveit.log("Loading ProveIt.");
		com.elclab.proveit.disableResize();
		com.elclab.proveit.getSidebarDoc().getElementById("edit").openPopup(
				com.elclab.proveit.getRefbox(), "end_before", 0, 0, false,
				false);
		com.elclab.proveit.getSidebarDoc().getElementById('edit').hidePopup();
		
		if(com.elclab.proveit.isMediaWikiEditPage())
			com.elclab.proveit.scanRef();
		
		return true;
	},

	proveitonunload : function() {
		com.elclab.proveit.enableResize();
		//top.getBrowser().removeProgressListener(com.elclab.proveit.sendalert);
		//com.elclab.proveit.isSidebarOpenBool = false;
	},
	/**
	 * A progress listener that catches events to drive the reloading of the
	 * citation list.
	 * 
	 * @type {}
	 */
	sendalert : {
		onLocationChange : function(aProgress, aRequest, aURI) {
			if (!aProgress.isLoadingDocument) {
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
				if(com.elclab.proveit.isMediaWikiEditPage())
					com.elclab.proveit.scanRef();
		
				/*
				com.elclab.proveit.log("Calling highlightTargetString");
				com.elclab.proveit.highlightTargetString("<ref");
				*/
				
				
			};
		},
		onStateChange : function(aProgress, aRequest, aFlag, aStatus) {
			if ((aFlag & com.elclab.proveit.STATE_STOP) && (aRequest.URI)
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
					com.elclab.proveit.scanRef();
		
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
		},
		onSecurityChange : function(aWebProgress, aRequest, aState) {
		},
		onStatusChange : function(aWebProgress, aRequest, aStatus, aMessage) {
		},
		onProgressChange : function(aWebProgress, aRequest, aCurSelfProgress,
				aMaxSelfProgress, aCurTotalProgress, aMaxTotalProgress) {
		},
		onLinkIconAvailable : function(a, b) {
		}
	},

	/**
	 * This function is designed to clear the richlistbox in preparation for
	 * loading a new page. It is simply a recursive call to remove all children
	 * from any nodes inside the richlist box, Garbage collection should then
	 * easily wipe them. Then we clear the scanref list to get rid of the
	 * meta-data as well.
	 */

	clearlist : function() {
		com.elclab.proveit.log("Entering clearList.");
		// var deletion = function(box) {
		// for (var i = 0; i < box.childNodes.length; i++) {
		// // deletion(box.childNodes[i]);
		// box.removeChild(box.childNodes[i]);
		// }
		// }
		var box = com.elclab.proveit.getSidebarDoc().getElementById("refbox");
		var size = box.childNodes.length;
		// com.elclab.proveit.log(size);
		for (var i = 0; i < size; i++) {
			var item = box.removeItemAt(box.getIndexOfItem(box.childNodes[0]));
			// com.elclab.proveit.log("Deleting #" + i + ": " + item.id);
			// com.elclab.proveit.log(size);
		}
		com.elclab.proveit.log("Clearing currentScan and currentrefs");
		com.elclab.proveit.currentScan = [];
		com.elclab.proveit.currentrefs = [];
	},

	getInsertionText : function()
	{
		// Adapted from dispSelect
		var textToInsert = "";
		if (com.elclab.proveit.getSidebarDoc().getElementById("refbox").selectedItem) {
			var name = com.elclab.proveit.getRefbox().selectedItem.id;
			if (com.elclab.proveit.toggleinsert) {
				// com.elclab.proveit.log(name);
				textToInsert = com.elclab.proveit.currentrefs[name]
						.toString();
			} else {
				if (com.elclab.proveit.currentrefs[name].name) {
					textToInsert = "<ref name=\""
							+ com.elclab.proveit.currentrefs[name].name + "\" />";
				} else {
					com.elclab.proveit.log("Selected item appears invalid.  Returning empty insertion text");
					textToInsert = "";
				}
			}
			
		}
		else
		{
			com.elclab.proveit.log("No selected item.  Returning empty insertion text");
			textToInsert = "";
		}
		
		return textToInsert;
	},
	
	/**
	 * this function takes the text from the display area and inserts it to the
	 * location of the cursor in the document.
	 */
	insert : function() {
		if (com.elclab.proveit.getRefbox().selectedItem) {
			var txtarea = com.elclab.proveit.getMWEditBox();
			if(!txtarea)
				return false;
			//var sel = com.elclab.proveit.getSidebarDoc().getElementById('display').value;
			var sel = com.elclab.proveit.getInsertionText();

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

		}
	},

	/**
	 * This function takes the currently selected or editted reference and
	 * updates it in the edit box.
	 */

	updateInText : function() {
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
		var regexpstring = com.elclab.proveit.currentrefs[item]["orig"].replace(/\|/g, "\\|");
		var regex = new RegExp(regexpstring);
		text = text.replace(regex, com.elclab.proveit.currentrefs[item].toString());
		// insert tags
		txtarea.value = text;

		// restore textarea scroll position
		com.elclab.proveit.currentrefs[item]["orig"] = com.elclab.proveit.currentrefs[item].toString();
		com.elclab.proveit.currentrefs[item]["save"] = true;
		txtarea.scrollTop = textScroll;

	},

	/**
	 * this is the cancel button code for the edit panel. It just closes the
	 * window and resets the values.
	 */
	cancelEdit : function() {
		com.elclab.proveit.getSidebarDoc().getElementById('edit').hidePopup();
		com.elclab.proveit.getSidebarDoc().getElementById('editextra').value = "";
		com.elclab.proveit.dispSelect();
	},

	editSave : function() {
		var name = com.elclab.proveit.getRefbox().selectedItem.id;
		var list = com.elclab.proveit.getSidebarDoc().getElementById("editlist").childNodes;
		for (item in list) {
			if (list[item]) {
				// com.elclab.proveit.log(item + ":" + list[item].id);
				var node = list[item].id;
				delete(com.elclab.proveit.currentrefs[name][node]);
				if (item != "length" && item != "item"
						&& com.elclab.proveit.getSidebarDoc().getElementById(node + "namec").value != ""
						&& com.elclab.proveit.getSidebarDoc().getElementById(node + "value").value != "")
					com.elclab.proveit.currentrefs[name][com.elclab.proveit.getSidebarDoc().getElementById(node
							+ "namec").value] = com.elclab.proveit.getSidebarDoc().getElementById(node
							+ "value").value;
				if (node == "name"
						&& com.elclab.proveit.getSidebarDoc().getElementById(node + "value").value != "") {
					com.elclab.proveit.getSidebarDoc().getElementById(name + "label").value = com.elclab.proveit.getSidebarDoc()
							.getElementById(node + "value").value;
				}
			}
		}
		var extra = com.elclab.proveit.getSidebarDoc().getElementById("editextra").value;
		extra = extra.split(/\,/gi);
		if (extra == -1 && com.elclab.proveit.getSidebarDoc().getElementById("editextra").value != "") {
			var split = extra[i].split(/\=/i);
			if (split[0].trim() == "name") {
				// com.elclab.proveit.log("Setting name(single): " + split[1].trim());
				com.elclab.proveit.getSidebarDoc().getElementById(name + "label").value = split[1].trim();
			}
			com.elclab.proveit.currentrefs[name][split[0].trim()] = split[1].trim();
		} else if (com.elclab.proveit.getSidebarDoc().getElementById('editextra').value != "") {
			for (var i = 0; i < extra.length; i++) {
				var split = extra[i].split(/\=/i);
				if (split[0].trim() == "name") {
					// com.elclab.proveit.log("Setting name(multi): " + split[1].trim());
					com.elclab.proveit.getSidebarDoc().getElementById(name + "label").value = split[1]
							.trim();
				}
				com.elclab.proveit.currentrefs[name][split[0].trim()] = split[1].trim();
			}
		}
		com.elclab.proveit.getSidebarDoc().getElementById("editextra").value = "";
		com.elclab.proveit.getSidebarDoc().getElementById("edit").hidePopup();
		if (com.elclab.proveit.currentrefs[name].toString() != com.elclab.proveit.currentrefs[name]["orig"]) {
		com.elclab.proveit.currentrefs[name]["save"] = false;
		}
		com.elclab.proveit.dispSelect();
		com.elclab.proveit.updateInText();
	},
	
	ignoreSelection : false,

	restoreSelection : function()
	{
		com.elclab.proveit.log("Entering restoreSelection.")
		// Restores selection after edit box is left and sidebar returned to..
		if(com.elclab.proveit.curRefItem != null)
		{
			com.elclab.proveit.ignoreSelection = true;
			com.elclab.proveit.getRefbox().selectItem(com.elclab.proveit.curRefItem);
		}
	},
	
	curRefItem : null,
	
	/**
	 * Selects reference in main article, as well as showing below (for now)
	 */
	doSelect : function()
	{
		com.elclab.proveit.log("Entering doSelect");
		
		//com.elclab.proveit.log("Selected item: " + com.elclab.proveit.getRefbox().selectedItem);
		
		//if(this.ignoreSelection || this.curRefItem == document.getElementById("refbox").selectedItem)
		if(com.elclab.proveit.ignoreSelection)
		{
			com.elclab.proveit.ignoreSelection = false;
			return; //ignore event thrown by scripted select or clearSelection.
		}
		//com.elclab.proveit.dispSelect();
		
		//if(com.elclab.proveit.getRefbox().selectedItem != null)
		//{
			com.elclab.proveit.curRefItem = com.elclab.proveit.getRefbox().selectedItem; // don't allow overwriting with null selection.
		//}
		//com.elclab.proveit.log("curRefItem: " + com.elclab.proveit.curRefItem + "; curRefItem.id: " + com.elclab.proveit.curRefItem.id)
		//com.elclab.proveit.log("currentrefs: " + com.elclab.proveit.currentrefs);
		var curRef = com.elclab.proveit.currentrefs[com.elclab.proveit.curRefItem.id];
		if(curRef.inMWEditBox)
		{
			com.elclab.proveit.log("Current ref is in edit box.  Highlighting ref.")
			var curRefText = curRef["orig"];
			com.elclab.proveit.log(curRefText);
			/*
			if(isStringHighlighted(curRefText))
			{
				return;
			}
			*/
			com.elclab.proveit.highlightTargetString(curRefText);
			/*var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
			 .getInterface(Components.interfaces.nsIWebNavigation)
	 		 .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
	         .rootTreeItem
	         .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
	         .getInterface(Components.interfaces.nsIDOMWindow);
	        */
	        //mainWindow.focus();
	        //mainWindow.document.focus();
			com.elclab.proveit.log("About to clear refbox selection.")
			com.elclab.proveit.ignoreSelection = true;
	        com.elclab.proveit.getRefbox().clearSelection(); //Clearing selection throws onSelect!
			//com.elclab.proveit.ignoreSelection = true; // Focus event may also have effect on selection.
	        com.elclab.proveit.getMWEditBox().focus();
			com.elclab.proveit.log("Scrolled and highlighted, and attempted to focus.");
		}
		else
		{
			com.elclab.proveit.log("Current reference is not yet saved to textbox.")
		}
		com.elclab.proveit.log("Leaving doSelect");
	},
		
	/**
	 * updates the edit window and puts the text in the small display window.
	 */
	
	dispSelect : function() {
		//com.elclab.proveit.log("Entering dispSelect");
		var box = com.elclab.proveit.getSidebarDoc().getElementById("editlist");
		var size = box.childNodes.length;
		// com.elclab.proveit.log(size);
		for (var i = 0; i < size; i++) {
			var item = box.removeChild(box.childNodes[0]);
			// com.elclab.proveit.log("Deleting #" + i + ": " + item.id);
			// com.elclab.proveit.log(size);
		}
		if (com.elclab.proveit.getRefbox().selectedItem) {
			/*
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
			*/
		} else {
			return;
		}
		var current = com.elclab.proveit.currentrefs[name];
		if (current["type"]) {
			com.elclab.proveit.getSidebarDoc().getElementById("editlabel").value = current["type"];
		} else {
			com.elclab.proveit.getSidebarDoc().getElementById("editlabel").value = "Citation";
		}
		for (item in current) {
			if (item != "type" && item != "toString" && item != "orig"
					&& item != "save") {
				var newline = com.elclab.proveit.getSidebarDoc().getElementById("editprime")
						.cloneNode(true);
				var left = newline.childNodes[0];
				var right = newline.childNodes[2];
				newline.id = "" + item;
				newline.hidden = false;
				com.elclab.proveit.getSidebarDoc().getElementById("editlist").appendChild(newline);

				left.id = "" + item + "namec";
				right.id = "" + item + "value";
				com.elclab.proveit.getSidebarDoc().getElementById(item + "namec").value = item;
				com.elclab.proveit.getSidebarDoc().getElementById(item + "value").value = current[item];
			}
		}
		// either enable or disable the save changes text
		
	},

	/*
	 * these are the current style and insert values to denote which one is
	 * currently active
	 */
	togglestyle : true,

	toggleinsert : true,

	flipToggle : function(toggle) {
		var label = com.elclab.proveit.getSidebarDoc().getElementById(toggle + "toggle");
		label.setAttribute("style", "font-weight: bold");
		if (toggle == "full") {
			com.elclab.proveit.getSidebarDoc().getElementById('nametoggle').setAttribute("style",
					"font-weight: normal");
			com.elclab.proveit.toggleinsert = true;
			com.elclab.proveit.dispSelect();
		} else if (toggle == "name") {
			com.elclab.proveit.getSidebarDoc().getElementById('fulltoggle').setAttribute("style",
					"font-weight: normal");
			com.elclab.proveit.toggleinsert = false;
			com.elclab.proveit.dispSelect();
		} else if (toggle == "cite") {
			com.elclab.proveit.getSidebarDoc().getElementById('citationtoggle').setAttribute("style",
					"font-weight: normal");
			com.elclab.proveit.togglestyle = true;
			com.elclab.proveit.getSidebarDoc().getElementById('citation').hidden = true;
			com.elclab.proveit.getSidebarDoc().getElementById('cite').hidden = false;
		} else if (toggle == "citation") {
			com.elclab.proveit.getSidebarDoc().getElementById('citetoggle').setAttribute("style",
					"font-weight: normal");
			com.elclab.proveit.togglestyle = false;
			com.elclab.proveit.getSidebarDoc().getElementById('cite').hidden = true;
			com.elclab.proveit.getSidebarDoc().getElementById('citation').hidden = false;
		}
	},

	currentrefs : [],

	/**
	 * This Function accesses the wiki edit box and scans the contained text for
	 * citation tags. It then puts them into the global currentScan and setsup
	 * the display chooser.
	 */
	scanRef : function() {
		com.elclab.proveit.log("Entering scanRef.");
		// textValue is the text from the edit box
		var text;
		// zero out the old scan, just in case
		com.elclab.proveit.currentScan = [];
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
		
		var textValue;
		if (text) {
			com.elclab.proveit.log("Edit box object is valid.");
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
				com.elclab.proveit.log("currentScan is valid.");
				// just for me and testing, make them easier to read by
				// replacing
				// all | with newlines and a tab
				for (var i = 0; i < com.elclab.proveit.currentScan.length; i++) {
					workingstring = com.elclab.proveit.currentScan[i]
							.match(/{{[\s]*(cite|Citation)[^}]*}}/i)[0];
					name = com.elclab.proveit.currentScan[i].match(/<[\s]*ref[^>]*/i);
					name = name[0].split(/\"/gi)[1];
					// com.elclab.proveit.log(name);
					if (!name || name == -1) {
						delete(name);
					}
					orig = com.elclab.proveit.currentScan[i];
					//com.elclab.proveit.log("name: " + name);
					// com.elclab.proveit.log(workingstring);
					// com.elclab.proveit.log(com.elclab.proveit.currentScan[i]);
					cutupstring = workingstring.split(/\|/g);
					//com.elclab.proveit.log("currentrefs[" + name + "]" + com.elclab.proveit.currentrefs[name]);
					if (!com.elclab.proveit.currentrefs[name]) {
						if (workingstring.indexOf('c') != -1 // Forking on c/C will not work, as templates are case insensitive.
								&& workingstring.substr(workingstring
										.indexOf('c'), 4) == "cite") {
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
							citation["type"] = type;
							// the rest of the cutup are the attributes, cycle
							// through them and parse them
							for (var j = 1; j < cutupstring.length; j++) {
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
									parts[0] = parts[0].trim();
									parts[1] = parts[1].trim();
									// add it to the object
									if (parts[1] != "") {
										citation[parts[0]] = parts[1];
									}
								}
							}
						} else if (workingstring.indexOf('C') != -1 
								&& workingstring.substr(workingstring
										.indexOf('C'), 8) == "Citation") {
							var citation = new com.elclab.proveit.Citation();
							if (name) {
								citation["name"] = name;
							}
							citation["orig"] = orig;
							citation["save"] = true;
							citation.inMWEditBox = true;
							var citstart = workingstring.indexOf('C');
							workingstring = workingstring.substring(citstart
									+ 8);
							cutupstring = workingstring.split(/\|/g);
							for (var j = 0; j < cutupstring.length; j++) {
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
								parts[0] = parts[0].trim();
								parts[1] = parts[1].trim();
								// add it to the object
								if (parts[1] != "") {
									citation[parts[0]] = parts[1];
								}
							}
						} else {
							// com.elclab.proveit.log("Can't Parse: " + com.elclab.proveit.currentScan[i]);
							var citation = workingstring;
						}
						//com.elclab.proveit.log("Adding: " + name);
						if (name) {
							//com.elclab.proveit.log("Name is defined: " + name)
							var text = com.elclab.proveit.addNewElement(name);
							//com.elclab.proveit.log("text: " + text);
							//com.elclab.proveit.log("citation: " + citation);
							com.elclab.proveit.currentrefs[text] = citation;
							//com.elclab.proveit.log("com.elclab.proveit.currentrefs[text]: " + com.elclab.proveit.currentrefs[text]);
							//com.elclab.proveit.log("currentrefs.length: " + com.elclab.proveit.currentrefs.length);
							
							//com.elclab.proveit.log("currentrefs: " + com.elclab.proveit.currentrefs);

						} else {
							//com.elclab.proveit.log("Name is not defined.")
							name = "";
							if (citation["author"]) {
								name = citation["author"] + "; ";
							} else if (citation["last"]) {
								name = citation["last"];
								if (citation["first"]) {
									name += ", " + citation["first"] + "; ";
								}
							}

							if (citation["title"]) {
								name += citation["title"];
							}
							//com.elclab.proveit.log("Generated name: " + name)
							var text = com.elclab.proveit.addNewElement(name);
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
		//document.getElementById('display').value = "";
		com.elclab.proveit.log("com.elclab.proveit.currentScan: " + com.elclab.proveit.currentScan)
		com.elclab.proveit.log("currentrefs: " + com.elclab.proveit.currentrefs);
		//com.elclab.proveit.log("currentrefs.length: " + com.elclab.proveit.currentrefs.length);
		
		
	},

	/**
	 * A function for Cite style tags.
	 */
	Cite : function() {
		this.name;
		this.type;
		this.save; 
		this.inMWEditBox; // true if and only if the ref is in the MW edit box with the same value as this object's orig.
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
			for (var name in this) {
				if (!((name == "type") || (name == "name")
						|| (name == "toString") || (name == "orig") || (name == "save") || (name == "inMWEditBox"))
						&& (this[name])) {
					returnstring += " | ";
					returnstring += name;
					returnstring += "=";
					returnstring += this[name];
					returnstring += " ";
				}
			}
			returnstring += "}}</ref>";
			return returnstring;
		}
	},

	/**
	 * A function for citation style tags.
	 */

	Citation : function() {
		this.name;
		this.save; 
		this.inMWEditBox; // true if and only if the ref is in the MW edit box with the same value as this object's orig.
		this.toString = function() {
			if (this.name) {
				var returnstring = "<ref name=\"";
				returnstring += this.name;
				returnstring += "\">{{Citation ";
			} else {
				var returnstring = "<ref>{{Citation "
			}
			for (var name in this) {
				if (!((name == "name") || (name == "toString")
						|| (name == "add") || (name == "orig") || (name == "save") || (name == "inMWEditBox"))
						&& (this[name] != "")) {
					returnstring += " | ";
					returnstring += name;
					returnstring += "=";
					returnstring += this[name];
					returnstring += " ";
				}
			}
			returnstring += "}}</ref>";
			return returnstring;
		}
	},

	/**
	 * Called from the actual add citation panel, this is the function used to
	 * add the actual citation.
	 * 
	 * @param {}
	 *            type the type of citation being added, the particular button
	 *            used will hand this to the function.
	 */
	addCitation : function(type) {
		// get this working, lots of typing here.
		var box = com.elclab.proveit.getSidebarDoc().getElementById(type);
		var tag;
		if (com.elclab.proveit.togglestyle) {
			tag = new com.elclab.proveit.Cite();
			tag["type"] = type;
		} else {
			tag = new com.elclab.proveit.Citation();
		}
		tag["save"] = true;
		tag.inMWEditBox = false;
		if (com.elclab.proveit.currentrefs[com.elclab.proveit.getSidebarDoc().getElementById(type + "name").value]) {
			for (var j = 2; true; j++) {
				if (!com.elclab.proveit.currentrefs[com.elclab.proveit.getSidebarDoc().getElementById(type + "name").value
						+ j]) {
					tag[box.childNodes[i].childNodes[1].id
							.substring(type.length)] = box.childNodes[i].childNodes[1].value
							+ j;
				}
			}
		}

		for (var i = 0; i < box.childNodes.length - 1; i++) {
			if (box.childNodes[i].childNodes[1]
					&& box.childNodes[i].childNodes[1].id == (type + "extra")) {

			} else if (box.childNodes[i].childNodes[1]
					&& box.childNodes[i].childNodes[1].id == (type + "name")) {
				if (com.elclab.proveit.currentrefs[com.elclab.proveit.getSidebarDoc().getElementById(type + "name").value]) {
					for (var j = 2; true; j++) {
						if (!com.elclab.proveit.currentrefs[com.elclab.proveit.getSidebarDoc().getElementById(type
								+ "name").value
								+ j]) {
							tag[box.childNodes[i].childNodes[1].id
									.substring(type.length)] = box.childNodes[i].childNodes[1].value
									+ j;
						}
					}
				} else {
					tag[box.childNodes[i].childNodes[1].id
							.substring(type.length)] = box.childNodes[i].childNodes[1].value;
				}
				com.elclab.proveit.addNewElement(box.childNodes[i].childNodes[1].value);
			} else if (box.childNodes[i].childNodes[1]
					&& box.childNodes[i].childNodes[1].value != "") {
				tag[box.childNodes[i].childNodes[1].id.substring(type.length)] = box.childNodes[i].childNodes[1].value;
			}
		}
		com.elclab.proveit.currentrefs[com.elclab.proveit.getSidebarDoc().getElementById(type + 'name').value] = tag;
		com.elclab.proveit.getSidebarDoc().getElementById('createnew').hidePopup();
		tag["orig"] = tag.toString();
		/*
		 * Cycle through the boxes and grab the id's versus the values, watch
		 * for the final box and make sure to grab the type as well
		 */
	},

	/**
	 * Opens and closes the the extra field window
	 * 
	 * @param {}
	 *            type the type/name of the extra field to open.
	 */
	openExtra : function(type) {
		var showable = com.elclab.proveit.getSidebarDoc().getElementById(type + "extra");
		var current = showable.hidden;
		showable.hidden = !current;
	},

	/**
	 * Changes the panel for the cite entry panel to the correct type of entry
	 */
	changeCite : function() {
		var that = com.elclab.proveit.getSidebarDoc().getElementById("citemenu").value;
		that = com.elclab.proveit.getSidebarDoc().getElementById(that);
		var childlist = com.elclab.proveit.getSidebarDoc().getElementById("citepanes").childNodes;
		for (var i = 0; i < childlist.length; i++) {
			childlist[i].hidden = true;
		}
		that.hidden = false;
	},

	/**
	 * changes the panel for the citation entry panel to the correct type of
	 * entry
	 */
	changeCitation : function() {
		var that = com.elclab.proveit.getSidebarDoc().getElementById("citationmenu").value;
		that = com.elclab.proveit.getSidebarDoc().getElementById(that);
		var childlist = com.elclab.proveit.getSidebarDoc().getElementById("citationpanes").childNodes;
		for (var i = 0; i < childlist.length; i++) {
			childlist[i].hidden = true;
		}
		that.hidden = false;
	},
	/**
	 * Only to be used internally to add the citations to the list
	 * 
	 * @param {}
	 *            name the name of the Citation tag, will be displayed as the
	 *            label.
	 * @return {} the id of the child so that we can add info to it, will be
	 *         used to tie the meta-data to the list.
	 */
	addNewElement : function(name) {
		// grab the list
		var blah = com.elclab.proveit.getRefbox();
		// blah.rows = 5;
		// get the number of rows, used to give id's to the new item
		// grab some input from the textbox
		// create a new richlistitem from the dummy prototype.
		var newchild = com.elclab.proveit.getSidebarDoc().getElementById("prime").cloneNode(true);
		// grab the nodes that need changed out of it
		var newlabel = newchild.firstChild.childNodes[0];
		var infoholder = newchild.firstChild.childNodes[1];
		var newimage = newchild.firstChild.childNodes[3];
		// change the necessary information in those nodes, as well as
		// change the dummy node to not hidden. note the use of num in id's
		// first check to see if there is a node with this name already
		var bad = false;
		for (var i = 0; i < blah.childNodes.length; i++) {
			if (blah.childNodes[i].id == name) {
				bad = true;
				break;
			}
		}
		// if there is, add a number surrounded by parens to the name at the end
		if (com.elclab.proveit.getSidebarDoc().getElementById(name) && bad) {
			var num = 1;
			while (true) {
				if (!com.elclab.proveit.getSidebarDoc().getElementById(name + "(" + num + ")")) {
					name = name + "(" + num + ")";
					break;
				}
				num++;
			}
		}
		newchild.id = name;
		newchild.hidden = false;
		blah.appendChild(newchild);
		newimage.id = name + "image";
		newimage.addEventListener("click", function() {
			com.elclab.proveit.getRefbox().selectItem(this.parentNode);
			// com.elclab.proveit.log("Onclick happenned!");
			com.elclab.proveit.getSidebarDoc().getElementById("edit").openPopup(this, "end_before", 0, 0,
					false, false);
		}, false);
		newlabel.id = name + "label";
		// not sure why this is necessary, but it's the only way to get it to
		// work in ff3
		// you have to add the item to the page before you can change the value
		// and control.id
		com.elclab.proveit.getSidebarDoc().getElementById(name + "label").value = name;
		com.elclab.proveit.getSidebarDoc().getElementById(name + "label").control = "refbox";
		// add an event listener to the edit image
		// this will only matter on the ff2 compliant version
		// return the id so the caller functions can set up the citation text
		// deprecated
		return name;
	}
}

/**
 * Generic trim function, trims all leading and trailing whitespace.
 * 
 * @return {} the trimmed string
 */

String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g, "");
}

Array.prototype.toString = function() {
	str = "";
	
	for(e in this)
	{
		str += e.toString() + ", ";
	}
	
	return str.substring(0, str.length - 1);
}


