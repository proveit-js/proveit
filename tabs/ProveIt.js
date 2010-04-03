/*
 * Copyright 2008, 2009
 *
 * Georgia Tech Research Corporation
 *
 * Atlanta, GA 30332-0415
 *
 * ALL RIGHTS RESERVED
 */

if (proveit)
	throw new Error("com.elclab.proveit already exists");

var proveit = {
	HALF_EDIT_BOX_HEIGHT : 200,
	// KNOWN_ACTIONS : ["edit", "submit"],

	// KNOWN_NAMESPACES : [""],

	// LANG : "en", // currently used only for descriptions.  This could be preference-controlled, instead of hard-coded.

	// //Text before param name (e.g. url, title, etc.) in creation box, to avoid collisions with unrelated ids.
	// NEW_PARAM_PREFIX : "newparam",

	// //Text before param name (e.g. url, title, etc.) in edit box, to avoid collisions with unrelated ids.
	// EDIT_PARAM_PREFIX : "editparam",

	// // Convenience log function
	log : function(str)
	{
		//console.log("[ProveIt] " + str);
		//this.consoleService.logStringMessage("[ProveIt] " + str);
	},

	// // Returns true if we are on a known domain, and the action is set to edit or submit
	isSupportedEditPage : function()
	{
		this.log("Entering isSupportedEditPage");
		// try
		// {
			// var url = top.getBrowser().currentURI;
			// var path = url.path;
			// return this.KNOWN_HOSTS.indexOf(url.host) != -1 && // Known host
				// this.KNOWN_ACTIONS.indexOf(window.content.wrappedJSObject.wgAction) != -1 && // Known action
				// this.KNOWN_NAMESPACES.indexOf(window.content.wrappedJSObject.wgCanonicalNamespace) != -1; // Known namespace
		// }
		// catch(e if e.name == "NS_ERROR_FAILURE")
		// {
			// this.log("isSupportedEditPage: NS_ERROR_FAILURE: " + e);
			// this.log("isSupportedEditPage: Returning false.");
			// return false;
		// }
		return true; // for now
	},

	// /* If we are currently on an appropriate MediaWiki page as determined by isSupportedEditPage()
	   // open the sidebar.
	// */
	// openIfSupportedEditPage : function ()
	// {
		// this.log("Entering openIfSupportedEditPage");
		// //this.log("windURL: " + windURL.spec);

		// if(!this.isSupportedEditPage())
		// {
			// //this.log("Not MediaWiki");
			// this.closeSidebar();
		// }
		// else
		// {
			// //this.log("Is MediaWiki");
        		// //if(!isOpen)
			// this.openSidebar();
		// }
	// },


	// // Convenience function.  Returns the sidebar's document object.
	// getSidebarDoc : function()
	// {
		// return window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
		// .getInterface(Components.interfaces.nsIWebNavigation)
 		// .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
		// .rootTreeItem
		// .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
		// .getInterface(Components.interfaces.nsIDOMWindow).document.getElementById("sidebar").contentWindow.document;
	// },

	// Convenience function.   Returns the refbox element.
	getRefbox : function()
	{
		//return this.getSidebarDoc().getElementById("refbox");
		return $("#refs");
	},

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
		//alert('target str: ' + targetStr);
		this.log("Entering highlightTargetString");
		var mwBox = this.getMWEditBox();
		var editTop = this.getPosition(this.getEditForm()).top;
		//content.window.scroll(0, editTop);
		var origText = $(mwBox).val();
		var startInd = origText.indexOf(targetStr);
		if(startInd == -1)
		{
			this.log("Target string \"" + targetStr + "\" not found.");
			return false;
		}
		var endInd = startInd + targetStr.length;
		$(mwBox).val(origText.substring(0, startInd));
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
		//var contentDoc = top.window.content.document;
		//return contentDoc.getElementById('wikEdTextarea') || contentDoc.getElementById('wpTextbox1');
		return $("#editbox")[0];
	},

	// Returns edit form DOM object

	getEditForm : function()
	{
		return $("#editbox")[0];
	},

	// Runs a given function on submission of edit form
	addOnsubmit : function(subFunc)
	{
		//this.log("Entering addOnsubmit.");
		var form = this.getEditForm();
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
		if(this.shouldAddSummary && !this.summaryActionAdded)
		{
			try
			{
				var thisproveit = this;
				this.addOnsubmit(function()
				{
					var summary = thisproveit.getEditSummary();

					if(summary.value.indexOf("ProveIt") == -1)
					summary.value += " (edited by [[User:Superm401/ProveIt|Proveit]])";
					/*
					else
					{
						this.log("ProveIt already in summary.");
					}
					 */
				});
				this.summaryActionAdded = true;
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
			this.log("this.shouldAddSummary: " + this.shouldAddSummary);
			this.log("this.prefs.getBoolPref(\"shouldAddSummary\"): " + this.prefs.getBoolPref("shouldAddSummary"));
 		}
		 */
	},


	/*
	 * onload and onunload event handlers tied to the sidebar. These tie the
	 * event handler into the browser and remove it when finished.
	 */

	// Runs when we actually want to load the sidebar
	proveitonload : function() {
		this.log("Entering proveitonload");
		// this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
			// .getService(Components.interfaces.nsIPrefService)
			// .getBranch("com.elclab.proveit.");
		// this.prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);
		// this.prefs.addObserver("", this, false);
		// this.shouldAddSummary = this.prefs.getBoolPref("shouldAddSummary");
		//this.log("this.shouldAddSummary: " + this.shouldAddSummary);

		this.summaryActionAdded = false;

		if(this.isSupportedEditPage())
		{
			this.log("Calling scanRef from proveitonload.");
			this.scanRef();
		}

		// window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
			// .getInterface(Components.interfaces.nsIWebNavigation)
			// .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
			// .rootTreeItem
			// .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
			// .getInterface(Components.interfaces.nsIDOMWindow).document.getElementById("ProveIt-status-bar").className = "open";

		return true;
	},

	// Runs when the sidebar is being unloaded.
	proveitonunload : function() {
		this.log("Entering proveitunload");
		if(this.prefs)
		{
			this.prefs.removeObserver("", com.elclab.proveit);
		}

		window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
			.getInterface(Components.interfaces.nsIWebNavigation)
			.QueryInterface(Components.interfaces.nsIDocShellTreeItem)
			.rootTreeItem
			.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
			.getInterface(Components.interfaces.nsIDOMWindow).document.getElementById("ProveIt-status-bar").className = "closed";

		//top.getBrowser().removeProgressListener(this.sendalert);
		//this.isSidebarOpenBool = false;
	},

	/*
	 * This function is designed to clear the richlistbox in preparation for
	 * loading a new page. It is simply a recursive call to remove all children
	 * from any nodes inside the richlist box, Garbage collection should then
	 * easily wipe them.
	 */

	clearlist : function()
	{
		//this.log("Entering clearList.");
		// var deletion = function(box) {
		// for (var i = 0; i < box.childNodes.length; i++) {
		// // deletion(box.childNodes[i]);
		// box.removeChild(box.childNodes[i]);
		// }
		// }
		var box = this.getRefbox();
		if(box == null)
		{
			this.log("Ref box is not loaded yet.");
			return false;
		}
		// var size = box.childNodes.length;
		// // this.log(size);
		// for (var i = 0; i < size; i++)
		// {
			// var item = box.removeChild(box.childNodes[0]);
		// }

		var refs = $('tr', box);
		//this.log(refs.length + " rows");
		$(refs).remove();
		
	},

	/** Does insertion into edit box.
	 * @param ref Reference to insert
	 * @param full Whether to insert the full text.
	 */
	insertRef : function(ref, full)
	{
		var txtarea = this.getMWEditBox();
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

		this.includeProveItEditSummary();
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
			if(valueTextbox.wrappedJSObject)
			{
				valueTextbox = valueTextbox.wrappedJSObject;
				this.log("citationObjFromEditPopup: valueTextbox (after unwrapping): " + valueTextbox);
			}
			if(paramRow.className == "addedrow") // Added with "Add another field"
			{
				paramName = paramRow.getElementsByClassName("paramname")[0].value.trim();
			}
			else
			{
				paramName = valueTextbox.id.substring(this.EDIT_PARAM_PREFIX.length);
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
			this.addPopupRow(editWin, tempParams, ref.getDescriptions(), paramNames[i], required[paramNames[i]], true);
		}
		this.sizeAndCenter(editWin);
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
		/*
		this.log("Entering addPopupRow.");
		this.log("item: " + item);
		this.log("req: " + req);
		this.log("fieldType: " + fieldType);
		 */
		var id = fieldType ? "preloadedparamrow" : "addedparamrow";
		var newline = this.getSidebarDoc().getElementById(id).cloneNode(true);
		newline.id = "";
		this.activateRemove(newline);
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
			paramName.setAttribute("control", this.EDIT_PARAM_PREFIX + item);
			paramValue.id = this.EDIT_PARAM_PREFIX + item;

			var desc = descs[item];
			if(!desc)
			{
				this.log("Undefined description for param: " + item + ".  Using directly as description.");
				desc = item;
			}
			paramName.setAttribute("value", desc);
			paramName.setAttribute("tooltiptext", item);
			paramValue.setAttribute("value", list[item]);
		}
		else
		{
			this.sizeAndCenter(rootWin);
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

		var textValue = $(text).val();
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
				var citation = this.CitationFactory(currentScan[i]);
				if(citation)
				{
					this.addNewElement(citation);
				}
			}
			$('#numRefs').text(currentScan.length); // update the number of refs in the view tab
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
		// Cite has a non-trivial override of this.  This is defined early (and conditionally) because it is used in the constructor.
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
					last2: "Last name (auth. two)",
					last3: "Last name (auth. three)",
					last4: "Last name (auth. four)",
					last5: "Last name (auth. five)",
					last6: "Last name (auth. six)",
					last7: "Last name (auth. seven)",
					last8: "Last name (auth. eight)",
					last9: "Last name (auth. nine)",
					first: "First name",
					first2: "First name (auth. two)",
					first3: "First name (auth. three)",
					first4: "First name (auth. four)",
					first5: "First name (auth. five)",
					first6: "First name (auth. six)",
					first7: "First name (auth. seven)",
					first8: "First name (auth. eight)",
					first9: "First name (auth. nine)",
					authorlink: "Author article name",
					title: "Title",
					publisher: "Publisher",
					year: "Year",
					location: "Location",
					place: "Location of work",
					isbn: "ISBN",
					id: "ID",
					doi: "DOI",
					page: "Page",
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
					"patent-number": "Patent number",
					"country-code": "Country code (XX)",
					work: "Work",
					format: "File format",
					issn: "ISSN",
					pmid: "PMID",
					chapter: "Chapter"
			}
		};

		// Convenience method.  Returns sorter for parameters.
		this.getSorter = function()
		{
			var thisCite = this; // Make closure work as intended.
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
		this.isValid = function(){return true;};

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
				for (value in this.params)
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

		/**
		 * Internal helper method for toString.
		 * @param template template for ref (currently "cite" or "Citation"
		 * @param includeType true to include this.type, false otherwise
		 * @return string for current reference
		 */
		this.toStringInternal = function(template, includeType)
		{
			if(this.name)
			{
				var returnstring = "<ref name=\"" + this.name + "\">";
			}
			else
			{
				var returnstring = "<ref>";
			}
			returnstring += "{{" + template + (includeType ? " " + this.type : "");
			for (var name in this.params)
			{
				returnstring += " | " + name + "=" + this.params[name];
			}
			returnstring += "}}</ref>";
			return returnstring;
		};
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

		proveit.AbstractCitation.call(this, argObj);

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
				"author2",
				"last2",
				"first2",
				"author3",
				"last3",
				"first3",
				"author4",
				"last4",
				"first4",
				"author5",
				"last5",
				"first5",
				"author6",
				"last6",
				"first6",
				"author7",
				"last7",
				"first7",
				"author8",
				"last8",
				"first8",
				"author9",
				"last9",
				"first9",
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
		this.toString = function()
		{
			return this.toStringInternal("cite", true);
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
			"press release"	: { "title": true },
			episode : { "title": true }
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
			"press release"	: [ "title", "url", "publisher", "date", "accessdate" ],
			episode : ["title", "series", "credits", "network", "season" ]
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
		};

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
		this.toString = function()
		{
			return this.toStringInternal("Citation", false);
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
				return ["url", "title", "author", "date", "publisher"]; // Can't determine more specific defaults when editing a pre-existing Citation.
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
				paramName = valueTextbox.id.substring(this.NEW_PARAM_PREFIX.length);
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
		window.openDialog("add_dialog.xul", "add dialog", this.DIALOG_FEATURES, winData);
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

		this.insertRef(tag, true); // true means insert full text here, regardless of global toggle.
		tag.save = true;
		tag.inMWEditBox = true;
		this.includeProveItEditSummary();
		this.getRefbox().scrollToIndex(this.getRefbox().itemCount - 1);
		this.getRefbox().selectedIndex = this.getRefbox().itemCount - 1;
		this.highlightTargetString(tag.orig);
	},

	activateRemove : function(row)
	{
		var thisproveit = this;
		row.getElementsByClassName("remove")[0].addEventListener("command", function()
		{
			var win = row.ownerDocument.defaultView;
			row.parentNode.removeChild(row);
			thisproveit.sizeAndCenter(win);
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

			var star = this.getSidebarDoc().getElementById("star").cloneNode(true);
			star.id = "";
			star.style.display = "-moz-box";
			star.style.visibility = (required[param] ? "visible" : "hidden"); // star will appear if field is required."

			if(descs[param])
			{
				paramBox = this.getSidebarDoc().getElementById("preloadedparamrow").cloneNode(true);
				var label = paramBox.getElementsByClassName("paramdesc")[0];
				label.setAttribute("value", descs[param]);
				// Basically the same code as nameHbox above
				label.setAttribute("control", this.NEW_PARAM_PREFIX + param);
				paramBox.insertBefore(star, label);
			}
			else
			{
				// Throwing an error here doesn't make sense if user-added fields can be copied over.
				// throw new Error("Undefined description for param: " + param);
				paramBox = this.getSidebarDoc().getElementById("addedparamrow").cloneNode(true);
				var nameTextbox = paramBox.getElementsByClassName("paramname")[0];
				nameTextbox.setAttribute("value", param);
				paramBox.insertBefore(star, nameTextbox);
			}
			paramBox.id = "";
			this.activateRemove(paramBox);

			paramBox.getElementsByClassName("paramvalue")[0].id = this.NEW_PARAM_PREFIX + param;
			this.log("changeCite: param: " + param + "; newCite.params[param]: " + newCite.params[param]);
			//paramBox.childNodes[2].value = newCite.params[param]; // Causes parameters to disappear.  Why?
			paramBox.hidden = false;
			paramList.appendChild(paramBox);
		}
		genPane.hidden = false;
		citePanes.insertBefore(genPane, citePanes.firstChild);
		this.sizeAndCenter(menu.ownerDocument.defaultView);
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
		this.log("Entering makeRefboxElement.");
		var refName = ref.name; //may be null or blank

		var refbox = this.getRefbox();

		var newchild = $('<tr><td class="number"></td><td class="author"></td><td class="year"></td><td class="title"></td></tr>');
		$(newchild).addClass('light'); // TODO: needs to alternate somehow

		//var newchild = this.getSidebarDoc().getElementById("prime").cloneNode(true);
		//newchild.id = "";
		if(!ref.isValid())
		{
			// Flag as invalid.
			$(newchild).addClass('badReference');
		}
		// grab the nodes that need changed out of it
		//var newlabel = newchild.getElementsByClassName("richitemlabel")[0];
		//var neweditimage = newchild.getElementsByClassName("richitemedit")[0];
		//var newinsertimage = newchild.getElementsByClassName("richiteminsert")[0];
		//newchild.hidden = false;
		var thisproveit = this;
	//	var tooltip = "";
		if(refName && refName != "")
                {
                        //tooltip += this.getSidebarDoc().getElementById("refNameDesc").value + ref.name + "\n";
						//newinsertimage.addEventListener("click", function() {
                        //thisproveit.getRefbox().selectItem(this.parentNode);
                        //thisproveit.insertRef(ref, thisproveit.toggleinsert);
                        //}, false); // True may ensure row is selected prior to attempting to insert.
                        //newinsertimage.setAttribute("tooltip", "enabled insert tooltip");
                }
                // else
                // {
                        // newinsertimage.setAttribute("disabled", "true");
                        // newinsertimage.setAttribute("tooltip", "disabled insert tooltip");
                // }
		//tooltip += ref.getLabel();
		//newchild.setAttribute("tooltiptext", tooltip);
		
		var title = ref.params['title'];
		var shortTitle = this.truncateTitle(title);
		
		$('td.title', newchild).text(shortTitle);
		$('td.title', newchild).attr('title', title);
				
		$('td.year', newchild).text(ref.params['year']);
		
		$('td.author', newchild).text(ref.params['last']);

		// single click event handler
		
		// newchild.addEventListener("click", function()
		// {
			// thisproveit.highlightTargetString(ref.orig);
		// }, false);
		//alert(ref.orig);
		$(newchild).click(function() { thisproveit.highlightTargetString(ref.orig); });
		
		// double click event handler
		
		var doEdit = function() {
			thisproveit.getRefbox().selectItem(newchild);
			var selectedIndex = thisproveit.getRefbox().selectedIndex;
			var winData = {"proveit": thisproveit, "ref": ref};
			window.openDialog("edit_dialog.xul", "edit dialog", thisproveit.DIALOG_FEATURES, winData);
			thisproveit.getRefbox().selectedIndex = selectedIndex;
		};		

		$(newchild).dblclick(doEdit);
		//newchild.addEventListener("dblclick", doEdit, false);

		// neweditimage.addEventListener("click", doEdit, false);

		// newlabel.setAttribute("value", ref.getLabel());
		// newlabel.setAttribute("control", "refbox");
		return newchild;		
		
		// unchanged copy below 
		
		// var newchild = this.getSidebarDoc().getElementById("prime").cloneNode(true);
		// newchild.id = "";
		// if(!ref.isValid())
		// {
			// // Flag as invalid.
			// newchild.className = newchild.className + " badReference";
		// }
		// // grab the nodes that need changed out of it
		// var newlabel = newchild.getElementsByClassName("richitemlabel")[0];
		// var neweditimage = newchild.getElementsByClassName("richitemedit")[0];
		// var newinsertimage = newchild.getElementsByClassName("richiteminsert")[0];
		// newchild.hidden = false;
		// var thisproveit = this;
		// var tooltip = "";
		// if(refName && refName != "")
                // {
                        // tooltip += this.getSidebarDoc().getElementById("refNameDesc").value + ref.name + "\n";
						// newinsertimage.addEventListener("click", function() {
                        // thisproveit.getRefbox().selectItem(this.parentNode);
                        // thisproveit.insertRef(ref, thisproveit.toggleinsert);
                        // }, false); // True may ensure row is selected prior to attempting to insert.
                        // newinsertimage.setAttribute("tooltip", "enabled insert tooltip");
                // }
                // else
                // {
                        // newinsertimage.setAttribute("disabled", "true");
                        // newinsertimage.setAttribute("tooltip", "disabled insert tooltip");
                // }
		// tooltip += ref.getLabel();
		// newchild.setAttribute("tooltiptext", tooltip);

		// var doEdit = function() {
			// thisproveit.getRefbox().selectItem(newchild);
			// var selectedIndex = thisproveit.getRefbox().selectedIndex;
			// var winData = {"proveit": thisproveit, "ref": ref};
			// window.openDialog("edit_dialog.xul", "edit dialog", thisproveit.DIALOG_FEATURES, winData);
			// thisproveit.getRefbox().selectedIndex = selectedIndex;
		// };

		// newchild.addEventListener("click", function()
		// {
			// thisproveit.highlightTargetString(ref.orig);
		// }, false);

		// newchild.addEventListener("dblclick", doEdit, false);

		// neweditimage.addEventListener("click", doEdit, false);

		// newlabel.setAttribute("value", ref.getLabel());
		// newlabel.setAttribute("control", "refbox");
		// return newchild;
	},
	
	truncateTitle : function(title)
	{
		var MAX_LENGTH = 75;
		var truncated = title;
		if(title.length > MAX_LENGTH)
		{
			truncated = truncated.substring(0, MAX_LENGTH);
			var lastSpacePos = truncated.lastIndexOf(' ');
			if(lastSpacePos != -1)
			{
				truncated = truncated.substr(0, lastSpacePos);
				truncated += " ...";
			}
		}
		return truncated;
	},

	/**
	 * Only to be used internally to add the citations to the list
	 *
	 * @param ref the reference to add
	 */
	addNewElement : function(ref)
	{
		var refbox = this.getRefbox();
		$(refbox).append(this.makeRefboxElement(ref));
	}
};

/**
 * Generic trim function, trims all leading and trailing whitespace.
 *
 * @return the trimmed string
 */
String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g, "");
}