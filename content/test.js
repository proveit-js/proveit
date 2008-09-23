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
	
	logType : this.alert, 
	
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
	
	isMediaWikiEditPage : function (url)
	{
		var isMediaWiki = null;
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
		
		if(found)
			isMediaWiki = path.indexOf("action=edit");
		else
			isMediaWiki = false;
			
		//alert("isMediaWiki: " + isMediaWiki);
        return isMediaWiki;
	},
	
	closeUnlessMediaWiki : function ()
	{
		com.elclab.proveit.log("Entering closeUnlessMediaWiki");
		var windURL = top.getBrowser().currentURI;
		if(!com.elclab.proveit.isMediaWikiEditPage(windURL))
        {
        	com.elclab.proveit.log("Not MediaWiki");
	    	com.elclab.proveit.closeSidebar();
		}            
        else
        {
        	com.elclab.proveit.log("Is MediaWiki");
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
	
	/**
	 * Returns true if and only if ProveIt sidebar is open.
	 */
	isSidebarOpen : function()
	{
		
		var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
			 .getInterface(Components.interfaces.nsIWebNavigation)
			 .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
			 .rootTreeItem
			 .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
			 .getInterface(Components.interfaces.nsIDOMWindow);
		
		com.elclab.proveit.log("hidden: " + mainWindow.document.getElementById("sidebar-box").hidden);	 
		com.elclab.proveit.log("Entering isSidebarOpen.");
		
		var isOpen = (location.href == "chrome://proveit/content/ProveIt.xul");
		//com.elclab.proveit.log("checked: " + mainWindow.document.getElementById("sidebar-box").getAttribute("checked"))
		
		//var isOpen = (mainWindow.document.getElementById("sidebar-box").getAttribute("checked") == "checked");
		
		com.elclab.proveit.log("isOpen: " + isOpen);
		
		return isOpen;
	},
	
	/**
	 * Ensures ProveIt sidebar is open.
	 */
	
	openSidebar : function()
	{
		toggleSidebar("viewProveItSidebar", true);
	},
	
	/**
	 * Ensures ProveIt sidebar is closed.
	 */
	
	closeSidebar : function()
	{
		com.elclab.proveit.log("Entering closeSidebar");
		if(this.isSidebarOpen())
		{
			if(!window.bogusMethod || window.bogusMethod == undefined)
				com.elclab.proveit.log("bogusMethod DNE");
				
			/*
			if(typeof fakeWithoutNamespace == undefined || !fakeWithoutNamespace || fakeWithoutNamespace == undefined)
				com.elclab.proveit.log("fakeWithoutNamespace DNE");
			*/
			/*
			if(!toggleSidebar || toggleSidebar == undefined)
				com.elclab.proveit.log("toggleSidebar DNE");
			else
			{
			*/
			
			com.elclab.proveit.log("toggleSidebar exists.  Attemping to close sidebar.");
			//toggleSidebar("viewProveItSidebar");
			//top.getBrowser().toggleSidebar();
			//toggleSidebar('viewBookmarksSidebar'); // Try bookmarks.
			
			var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
			 .getInterface(Components.interfaces.nsIWebNavigation)
			 .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
			 .rootTreeItem
			 .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
			 .getInterface(Components.interfaces.nsIDOMWindow);
			 
			 //mainWindow.document.getElementById("sidebar-box").hidden = true;
			 //mainWindow.document.getElementById("sidebar").hidden = true;
			 
			 mainWindow.toggleSidebar("viewProveItSidebar");
			 
			 com.elclab.proveit.log("is Open: " + com.elclab.proveit.isSidebarOpen());
			
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
		t.scrollTop = curScrollTop + this.HALF_EDIT_BOX_IN_PIXELS; 
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
	
	proveitonload : function() {
		top.getBrowser().addProgressListener(this.sendalert,
				this.NOTIFY_STATE_DOCUMENT);
		com.elclab.proveit.disableResize();
		document.getElementById("edit").openPopup(
				document.getElementById('refbox'), "end_before", 0, 0, false,
				false);
		document.getElementById('edit').hidePopup();
		com.elclab.proveit.log("Loading ProveIt.");
		this.scanRef();

	},

	proveitonunload : function() {
		com.elclab.proveit.enableResize();
		top.getBrowser().removeProgressListener(this.sendalert);
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
				
				com.elclab.proveit.closeUnlessMediaWiki();
				/*
				com.elclab.proveit.log("Calling highlightTargetString");
				com.elclab.proveit.highlightTargetString("<ref");
				*/
				com.elclab.proveit.scanRef();
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
				
				com.elclab.proveit.closeUnlessMediaWiki();
				/*
				com.elclab.proveit.log("Calling highlightTargetString");
				com.elclab.proveit.highlightTargetString("<ref");
				*/
				com.elclab.proveit.scanRef();
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
		// var deletion = function(box) {
		// for (var i = 0; i < box.childNodes.length; i++) {
		// // deletion(box.childNodes[i]);
		// box.removeChild(box.childNodes[i]);
		// }
		// }
		var box = document.getElementById("refbox");
		var size = box.childNodes.length;
		// com.elclab.proveit.log(size);
		for (var i = 0; i < size; i++) {
			var item = box.removeItemAt(box.getIndexOfItem(box.childNodes[0]));
			// com.elclab.proveit.log("Deleting #" + i + ": " + item.id);
			// com.elclab.proveit.log(size);
		}
		this.currentScan = [];
		this.currentrefs = [];
	},

	getInsertionText : function()
	{
		// Adapted from dispSelect
		var textToInsert = "";
		if (document.getElementById("refbox").selectedItem) {
			var name = document.getElementById("refbox").selectedItem.id;
			if (this.toggleinsert) {
				// com.elclab.proveit.log(name);
				textToInsert = this.currentrefs[name]
						.toString();
			} else {
				if (this.currentrefs[name].name) {
					textToInsert = "<ref name=\""
							+ this.currentrefs[name].name + "\" />";
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
		if (document.getElementById("refbox").selectedItem) {
			var txtarea = this.getMWEditBox();
			if(!txtarea)
				return false;
			//var sel = document.getElementById('display').value;
			var sel = this.getInsertionText();

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
		var item = document.getElementById("refbox").selectedItem.id;
		var textareaname;
		if (top.window.content.document.getElementById('wikEdTextarea')) {
			textareaname = "wikEdTextarea";
		} else if (top.window.content.document.getElementById('wpTextbox1')) {
			textareaname = "wpTextbox1";
		} else {
			return;
		}
		var sel = document.getElementById(item).toString();
		var txtarea = top.window.content.document.getElementById(textareaname);
		var textScroll = txtarea.scrollTop;
		// get current selection
		txtarea.focus();
		var startPos = txtarea.selectionStart;
		var endPos = txtarea.selectionEnd;
		var text = txtarea.value;
		var textScroll = txtarea.scrollTop;
		//com.elclab.proveit.log("Replacing: \n\t" + this.currentrefs[item]["orig"] + "\nWith:\n\t" + this.currentrefs[item].toString());
		var regexpstring = this.currentrefs[item]["orig"].replace(/\|/g, "\\|");
		var regex = new RegExp(regexpstring);
		text = text.replace(regex, this.currentrefs[item].toString());
		// insert tags
		txtarea.value = text;

		// restore textarea scroll position
		this.currentrefs[item]["orig"] = this.currentrefs[item].toString();
		this.currentrefs[item]["save"] = true;
		txtarea.scrollTop = textScroll;

	},

	/**
	 * this is the cancel button code for the edit panel. It just closes the
	 * window and resets the values.
	 */
	cancelEdit : function() {
		document.getElementById('edit').hidePopup();
		document.getElementById('editextra').value = "";
		this.dispSelect();
	},

	editSave : function() {
		var name = document.getElementById("refbox").selectedItem.id;
		var list = document.getElementById("editlist").childNodes;
		for (item in list) {
			if (list[item]) {
				// com.elclab.proveit.log(item + ":" + list[item].id);
				var node = list[item].id;
				delete(this.currentrefs[name][node]);
				if (item != "length" && item != "item"
						&& document.getElementById(node + "namec").value != ""
						&& document.getElementById(node + "value").value != "")
					this.currentrefs[name][document.getElementById(node
							+ "namec").value] = document.getElementById(node
							+ "value").value;
				if (node == "name"
						&& document.getElementById(node + "value").value != "") {
					document.getElementById(name + "label").value = document
							.getElementById(node + "value").value;
				}
			}
		}
		var extra = document.getElementById("editextra").value;
		extra = extra.split(/\,/gi);
		if (extra == -1 && document.getElementById("editextra").value != "") {
			var split = extra[i].split(/\=/i);
			if (split[0].trim() == "name") {
				// com.elclab.proveit.log("Setting name(single): " + split[1].trim());
				document.getElementById(name + "label").value = split[1].trim();
			}
			this.currentrefs[name][split[0].trim()] = split[1].trim();
		} else if (document.getElementById('editextra').value != "") {
			for (var i = 0; i < extra.length; i++) {
				var split = extra[i].split(/\=/i);
				if (split[0].trim() == "name") {
					// com.elclab.proveit.log("Setting name(multi): " + split[1].trim());
					document.getElementById(name + "label").value = split[1]
							.trim();
				}
				this.currentrefs[name][split[0].trim()] = split[1].trim();
			}
		}
		document.getElementById("editextra").value = "";
		document.getElementById("edit").hidePopup();
		if (this.currentrefs[name].toString() != this.currentrefs[name]["orig"]) {
		this.currentrefs[name]["save"] = false;
		}
		this.dispSelect();
		this.updateInText();
	},
	
	ignoreSelection : false,

	restoreSelection : function()
	{
		com.elclab.proveit.log("Entering restoreSelection.")
		// Restores selection after edit box is left and sidebar returned to..
		if(this.curRefItem != null)
		{
			this.ignoreSelection = true;
			document.getElementById("refbox").selectItem(this.curRefItem);
		}
	},
	
	curRefItem : null,
	
	/**
	 * Selects reference in main article, as well as showing below (for now)
	 */
	doSelect : function()
	{
		//com.elclab.proveit.log("Selected item: " + document.getElementById("refbox").selectedItem);
		
		//if(this.ignoreSelection || this.curRefItem == document.getElementById("refbox").selectedItem)
		if(this.ignoreSelection)
		{
			this.ignoreSelection = false;
			return; //ignore event thrown by scripted select or clearSelection.
		}
		com.elclab.proveit.log("Entering doSelect");
		//com.elclab.proveit.dispSelect();
		
		//if(document.getElementById("refbox").selectedItem != null)
		//{
			this.curRefItem = document.getElementById("refbox").selectedItem; // don't allow overwriting with null selection.
		//}
		
		var curRef = this.currentrefs[this.curRefItem.id];
		if(curRef.inMWEditBox)
		{
			com.elclab.proveit.log("Current ref is in edit box.  Highlighting ref.")
			var curRefText = curRef["orig"];
			this.log(curRefText);
			/*
			if(isStringHighlighted(curRefText))
			{
				return;
			}
			*/
			this.highlightTargetString(curRefText);
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
	        document.getElementById("refbox").clearSelection(); //Clearing selection throws onSelect!
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
		var box = document.getElementById("editlist");
		var size = box.childNodes.length;
		// com.elclab.proveit.log(size);
		for (var i = 0; i < size; i++) {
			var item = box.removeChild(box.childNodes[0]);
			// com.elclab.proveit.log("Deleting #" + i + ": " + item.id);
			// com.elclab.proveit.log(size);
		}
		if (document.getElementById("refbox").selectedItem) {
			/*
			var name = document.getElementById("refbox").selectedItem.id;
			if (this.toggleinsert) {
				// com.elclab.proveit.log(name);
				document.getElementById('display').value = this.currentrefs[name]
						.toString();
			} else {
				if (this.currentrefs[name].name) {
					document.getElementById('display').value = "<ref name=\""
							+ this.currentrefs[name].name + "\" />";
				} else {
					document.getElementById('display').value = "There is no name for this reference.";
				}
			}
			*/
		} else {
			return;
		}
		var current = this.currentrefs[name];
		if (current["type"]) {
			document.getElementById("editlabel").value = current["type"];
		} else {
			document.getElementById("editlabel").value = "Citation";
		}
		for (item in current) {
			if (item != "type" && item != "toString" && item != "orig"
					&& item != "save") {
				var newline = document.getElementById("editprime")
						.cloneNode(true);
				var left = newline.childNodes[0];
				var right = newline.childNodes[2];
				newline.id = "" + item;
				newline.hidden = false;
				document.getElementById("editlist").appendChild(newline);

				left.id = "" + item + "namec";
				right.id = "" + item + "value";
				document.getElementById(item + "namec").value = item;
				document.getElementById(item + "value").value = current[item];
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
		var label = document.getElementById(toggle + "toggle");
		label.setAttribute("style", "font-weight: bold");
		if (toggle == "full") {
			document.getElementById('nametoggle').setAttribute("style",
					"font-weight: normal");
			this.toggleinsert = true;
			this.dispSelect();
		} else if (toggle == "name") {
			document.getElementById('fulltoggle').setAttribute("style",
					"font-weight: normal");
			this.toggleinsert = false;
			this.dispSelect();
		} else if (toggle == "cite") {
			document.getElementById('citationtoggle').setAttribute("style",
					"font-weight: normal");
			this.togglestyle = true;
			document.getElementById('citation').hidden = true;
			document.getElementById('cite').hidden = false;
		} else if (toggle == "citation") {
			document.getElementById('citetoggle').setAttribute("style",
					"font-weight: normal");
			this.togglestyle = false;
			document.getElementById('cite').hidden = true;
			document.getElementById('citation').hidden = false;
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
		// text is the text from the edit box
		var text;
		// zero out the old scan, just in case
		this.currentScan = [];
		// these are strings used to allow the correct parsing of the tag
		var workingstring;
		var cutupstring;
		// we use different textarea id's if people are using wikiEd, this
		// should fix that.
		var textareaname;
		// check to see if the edit box exists, basically a boilerplate for
		// using it
		// on the wrong page. We also check to see which textarea is being used,
		// wikiEd's or the normal one.
		this.clearlist();
		if (top.window.content.document.getElementById('wikEdTextarea')) {
			textareaname = "wikEdTextarea";
		} else if (top.window.content.document.getElementById('wpTextbox1')) {
			textareaname = "wpTextbox1";
		}
		if (textareaname) {
			// since we should pick the name out before we get to the citation
			// tag type, here's a variable to hold it
			var name, orig;
			// grab the text from the box, wpTextbox1 is the standard boxx name.
			text = top.window.content.document.getElementById(textareaname).value;
			// scan it for citation tags...
			this.currentScan = text
					.match(/<[\s]*ref[^>]*>[\s]*{{+[\s]*(cite|Citation)[^}]*}}+[\s]*<[\s]*\/[\s]*ref[\s]*>/gi);
			// if there are results,
			if (this.currentScan) {
				// just for me and testing, make them easier to read by
				// replacing
				// all | with newlines and a tab
				for (var i = 0; i < this.currentScan.length; i++) {
					workingstring = this.currentScan[i]
							.match(/{{[\s]*(cite|Citation)[^}]*}}/i)[0];
					name = this.currentScan[i].match(/<[\s]*ref[^>]*/i);
					name = name[0].split(/\"/gi)[1];
					// com.elclab.proveit.log(name);
					if (!name || name == -1) {
						delete(name);
					}
					orig = this.currentScan[i];
					// com.elclab.proveit.log(name);
					// com.elclab.proveit.log(workingstring);
					// com.elclab.proveit.log(this.currentScan[i]);
					cutupstring = workingstring.split(/\|/g);
					if (!this.currentrefs[name]) {
						if (workingstring.indexOf('c') != -1 // Forking on c/C will not work, as templates are case insensitive.
								&& workingstring.substr(workingstring
										.indexOf('c'), 4) == "cite") {
							// create a new cite object
							var citation = new this.Cite();
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
							var citation = new this.Citation();
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
							// com.elclab.proveit.log("Can't Parse: " + this.currentScan[i]);
							var citation = workingstring;
						}
						// com.elclab.proveit.log("Adding: " + name);
						if (name) {
							var text = this.addNewElement(name);
							this.currentrefs[text] = citation;

						} else {
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

							var text = this.addNewElement(name);
							this.currentrefs[text] = citation;

						}
					} else {
					}
				}
			} else {
			}
		}
		//document.getElementById('display').value = "";
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
						|| (name == "add") || (name == "orig") || (name == "save"))
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
		var box = document.getElementById(type);
		var tag;
		if (this.togglestyle) {
			tag = new this.Cite();
			tag["type"] = type;
		} else {
			tag = new this.Citation();
		}
		tag["save"] = true;
		tag.inMWEditBox = false;
		if (this.currentrefs[document.getElementById(type + "name").value]) {
			for (var j = 2; true; j++) {
				if (!this.currentrefs[document.getElementById(type + "name").value
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
				if (this.currentrefs[document.getElementById(type + "name").value]) {
					for (var j = 2; true; j++) {
						if (!this.currentrefs[document.getElementById(type
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
				this.addNewElement(box.childNodes[i].childNodes[1].value);
			} else if (box.childNodes[i].childNodes[1]
					&& box.childNodes[i].childNodes[1].value != "") {
				tag[box.childNodes[i].childNodes[1].id.substring(type.length)] = box.childNodes[i].childNodes[1].value;
			}
		}
		this.currentrefs[document.getElementById(type + 'name').value] = tag;
		document.getElementById('createnew').hidePopup();
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
		var showable = document.getElementById(type + "extra");
		var current = showable.hidden;
		showable.hidden = !current;
	},

	/**
	 * Changes the panel for the cite entry panel to the correct type of entry
	 */
	changeCite : function() {
		var that = document.getElementById("citemenu").value;
		that = document.getElementById(that);
		var childlist = document.getElementById("citepanes").childNodes;
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
		var that = document.getElementById("citationmenu").value;
		that = document.getElementById(that);
		var childlist = document.getElementById("citationpanes").childNodes;
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
		var blah = document.getElementById("refbox");
		// blah.rows = 5;
		// get the number of rows, used to give id's to the new item
		// grab some input from the textbox
		// create a new richlistitem from the dummy prototype.
		var newchild = document.getElementById("prime").cloneNode(true);
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
		if (document.getElementById(name) && bad) {
			var num = 1;
			while (true) {
				if (!document.getElementById(name + "(" + num + ")")) {
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
			document.getElementById('refbox').selectItem(this.parentNode);
			// com.elclab.proveit.log("Onclick happenned!");
			document.getElementById("edit").openPopup(this, "end_before", 0, 0,
					false, false);
		}, false);
		newlabel.id = name + "label";
		// not sure why this is necessary, but it's the only way to get it to
		// work in ff3
		// you have to add the item to the page before you can change the value
		// and control
		document.getElementById(name + "label").value = name;
		document.getElementById(name + "label").control = "refbox";
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
