/**
 * ProveIt (http://code.google.com/p/proveit-js/) is a new tool for reliable referencing on Wikipedia
 *
 * Copyright 2008, 2009, 2010
 *
 * Georgia Tech Research Corporation
 *
 * Atlanta, GA 30332-0415
 *
 * ALL RIGHTS RESERVED
 */

if (typeof(proveit) != 'undefined')
	throw new Error("proveit already exists");

importScriptURI('http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js');
importScriptURI('http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.3/jquery-ui.min.js');

window.proveit = {
	HALF_EDIT_BOX_HEIGHT : 200,
	// KNOWN_ACTIONS : ["edit", "submit"],

	// KNOWN_NAMESPACES : [""],

	LANG : "en", // currently used only for descriptions.  This could be preference-controlled, instead of hard-coded.

	// //Text before param name (e.g. url, title, etc.) in creation box, to avoid collisions with unrelated ids.
	NEW_PARAM_PREFIX : "newparam",

	// //Text before param name (e.g. url, title, etc.) in edit box, to avoid collisions with unrelated ids.
	EDIT_PARAM_PREFIX : "editparam",

	STATIC_BASE : "http://proveit-js.googlecode.com/hg/static/",

	// // Convenience log function
	log : function(msg)
	{
		if(typeof(console) === 'object' && console.log)
		{
			console.log("[ProveIt] %o", msg);
		}

		//this.consoleService.logStringMessage("[ProveIt] " + str);
	},

	// // Returns true if we are on a known domain, and the action is set to edit or submit
	isSupportedEditPage : function()
	{
	        // "regular" page and edit or preview mode
		return wgCanonicalNamespace == '' && (wgAction == 'edit' || wgAction == 'submit');
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


	// Convenience function.   Returns the refbox element.
	getRefbox : function()
	{
		//return document.getElementById("refbox");
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

	// Highlights a given length of text, at a particular index.
	highlightLengthAtIndex : function(startInd, length)
	{
		if(startInd < 0 || length < 0)
		{
			this.log("highlightStringAtIndex: invalid negative arguments");
		}
		var mwBox = this.getMWEditBox();
		var origText = $(mwBox).val();
		var editTop = this.getPosition(this.getMWEditBox()).top;
		var endInd = startInd + length;
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
		return true;
	},

	// Highlights a given string in the MediaWiki edit box.
	highlightTargetString : function(targetStr)
	{
	        //this.log("Entering highlightTargetString");
		var mwBox = this.getMWEditBox();
		//content.window.scroll(0, editTop);
		var origText = $(mwBox).val();
		var startInd = origText.indexOf(targetStr);
		if(startInd == -1)
		{
			this.log("Target string \"" + targetStr + "\" not found.");
			return false;
		}
		var proveit = $('#proveit');
		proveit.addClass('translucent');
		setTimeout(function()
		{
		    proveit.removeClass('translucent');
		}, 3000);
		return this.highlightLengthAtIndex(startInd, targetStr.length);
	},

	// Convenience function.  Returns MediaWiki text area.
	getMWEditBox : function()
	{
		return $("#wpTextbox1")[0];
	},

	// Returns edit form DOM object

	getEditForm : function()
	{
		return $("#editform")[0];
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
		//this.log("this.shouldAddSummary: " + this.shouldAddSummary);

		this.summaryActionAdded = false;

		if(this.isSupportedEditPage())
		{
			this.createGUI();
		}

		return true;
	},

	// Runs when the sidebar is being unloaded.
	proveitonunload : function() {
		this.log("Entering proveitunload");
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

		var refs = $("tr:not('tr#dummyRef')", box);
		//this.log(refs.length + " rows");
		$(refs).remove();

	},

	/** Does insertion into edit box.
	 * @param ref Reference to insert
	 * @param full Insert the full reference text if true, pointer otherwise.
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
	 * @param editBox the root raw HTML element of edit popup/dialog.
	 * @param citeObj the original citation object we're modifying
	 *
	 * @return citeObj
	 */
	citationObjFromEditPopup : function(citeObj, editBox)
	{
		this.log("Entering citationObjFromEditPopup");
		var paramBoxes = $("div.input-row", editBox);

 		var refNameValue = $('.refname', editBox);
		var refName = refNameValue.val();
		citeObj.name = refName != "" ? refName : null; // Save blank names as null

		// Clear old params
		citeObj.params = {};

		var paramName, paramVal;
		for (var i = 0; i < paramBoxes.length; i++)
		{
			// this.log(item + ":" + paramBoxes[item].id);
			//this.log("item: " + i);
			var paramRow = paramBoxes[i];
			var valueTextbox = paramRow.getElementsByClassName("paramvalue")[0];
			if($(paramRow).hasClass("addedrow")) // Added with "Add another field"
			{
				paramName = paramRow.getElementsByClassName("paramdesc")[0].value.trim();
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
			var oldRichItem = $('.selected', this.getRefbox()).get(0);
			this.log('newRichItem: ' + newRichItem + ', oldRichItem: ' + oldRichItem + 'oldRichItem.parentNode: ' + oldRichItem.parentNode);
			var oldNumber = $('td.number',oldRichItem).text();
			$('td.number',newRichItem).text(oldNumber); // preserve old numbering
			oldRichItem.parentNode.replaceChild(newRichItem, oldRichItem);
			$(newRichItem).addClass('selected');

			citeObj.updateInText();
			this.includeProveItEditSummary();
		}
	},

	/*
	 * Updates the edit window (popup that appears when you click pencil icon).
	 * Moved from doSelect/dispSelect
	 */
	updateEditPopup : function(ref)
	{
		this.log("Entering updateEditPopup.");

		var refNameValue = $('#edit-pane .refname');

		refNameValue.val(ref.name || "");

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

		$('div:not(.hidden)', '#edit-fields').remove(); // clear all fields in the edit box (except the hidden ones)

		for(var i = 0; i < paramNames.length; i++)
		{
			//this.log("Calling addPopupRow on tempParams." + item);
			//this.log("i: " + i + ", paramNames[i]: " + paramNames[i]);
			this.addPopupRow($("#edit-pane").get(), tempParams, ref.getDescriptions(), paramNames[i], required[paramNames[i]], true);
		}

		var acceptButton = $('#edit-buttons .accept');
		var acceptEdit = function()
		{
			proveit.log("Entering acceptEdit");
			proveit.citationObjFromEditPopup(ref, $("#edit-pane").get());
			proveit.saveEdit(ref);
			acceptButton.unbind('click', acceptEdit);
			$("#edit-pane").hide();
			$("#view-pane").show();
		};
		acceptButton.click(acceptEdit);

		$('.tab-link').one('click', function()
		{
			acceptButton.unbind('click', acceptEdit);
		});
	},

	/**
	 * Adds a single row of popup
	 * @param root root window for popup
	 * @param list the param list from the reference, or null for added rows.
	 * @param descs description array to use, or null for no description
	 * @param item the current param name
	 * @param req true if current param name is required, otherwise not required.
	 * @param fieldType true for label, false for textbox.
	 */
	addPopupRow : function(root, list, descs, item, req, fieldType)
	{
		this.log("Entering addPopupRow.");
		/*
		this.log("item: " + item);
		this.log("req: " + req);
		this.log("fieldType: " + fieldType);
		 */
		var id = fieldType ? "preloadedparamrow" : "addedparamrow";
		var newline = $('#'+id).clone(); // clone the hidden row
		$(newline).attr('id',''); // clear the ID (can't have two elements with same ID)
		//this.activateRemove(newline);
		var paramName = $('.paramdesc', newline).eq(0);
		var paramValue = $('.paramvalue', newline).eq(0);


		$('.paramlist', root).append(newline);

		if(req) // if field is required...
		{
			$(paramName).addClass('required'); // visual indicator that label is required
			$('.remove', newline).remove(); // don't let people remove required fields
		}
		else
		{
			this.activateRemove(newline);
		}

		if(fieldType) // the description/name is a label (not a textbox)
		{
			paramName.attr("for", this.EDIT_PARAM_PREFIX + item);
			paramValue.attr('id',this.EDIT_PARAM_PREFIX + item);

			var desc = descs[item];
			if(!desc)
			{
				this.log("Undefined description for param: " + item + ".  Using directly as description.");
				desc = item;
			}
			$(paramName).text(desc);
			$(paramName).attr('title',item);
			$(paramValue).val(list[item]);

			$(newline).show();
		}
		else
		{
			// added a new row, so make it fancy
			$(newline).show('highlight',{},'slow');
			$('.inputs', root).scrollTop(100000);
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
		var name;

		// key - name
		// value -
		//      object - key - "citation", value - citation obj .  Avoids repeating same object in citations array.
                //               key - "strings", value - array of orig strings
		var pointers = {};

		// Array of citation objects.  At end of function, addNewElement called on each.
		var citations = [];

		// currentScan holds the parsed (match objects) list of citations.  Regex matches full or name-only reference.
		var currentScan = textValue.match(/<[\s]*ref[^>]*>(?:[\s]*{{+[\s]*(cite|Citation)[^}]*}}+[\s]*<[\s]*\/[\s]*ref[\s]*>)?/gi);
		// if there are results,
		if (currentScan)
		{
			for (var i = 0; i < currentScan.length; i++)
			{
				//this.log("currentScan[" + i + "]: " + currentScan[i]);
				var citation = this.CitationFactory(currentScan[i]);
				if(citation) // Full citation object
				{
					name = citation.name;
					if(!name) // with no name, no possibility of repeat name.
					{
						citations.push(citation);
					}
				}
				else // Not full object.  Possibly pointer.
				{
					var match = currentScan[i].match(this.REF_REGEX);
					name = match && (match[1] || match[2] || match[3]);
				}

				if(name)
				{
					if(!pointers[name])
					{
						// Create array of original reference strings
						pointers[name] = {};
						if(!pointers[name].strings)
						{
							pointers[name].strings = [];
						}
					}
					if(citation && !pointers[name].citation) // citation, and not already one for this name
					{
						pointers[name].citation = citation;
						citations.push(citation);
					}

					// Add to array
					pointers[name].strings.push(currentScan[i]);
				}
			}
		}
		for(var j = 0; j < citations.length; j++)
		{
			if(citations[j].name)
			{
				var pointer = pointers[citations[j].name];
				citations[j].setPointerStrings(pointer.strings);
			}
			this.addNewElement(citations[j]);
		}
		this.log("pointers: ");
		this.log(pointers);
	},

	REF_REGEX : /<[\s]*ref[\s]*name[\s]*=[\s]*(?:(?:\"(.*?)\")|(?:\'(.*?)\')|(?:(.*?)))[\s]*\/?[\s]*>/,

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
		var match = citationText.match(this.REF_REGEX);

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
		 * the ISO 639-1 code for a language, then set proveit.LANG to "xx"
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
					chapter: "Chapter",
					web: "Web",
					book: "Book",
					conference: "Conference",
					news: "News",
					paper: "Paper",
					"press release": "Press release"
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
			return descriptions[proveit.LANG];
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
			proveit.log("getInsertionText");
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
			var txtarea = proveit.getMWEditBox();

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

			proveit.highlightTargetString(this.toString());
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
				proveit.log('toStringInternal: param: ' + name);
				returnstring += " | " + name + "=" + this.params[name];
			}
			returnstring += "}}</ref>";
			return returnstring;
		};

		this.setPointerStrings = function(strings)
		{
			this.pointerStrings = strings;
		};

		/**
		 * @return (possibly empty) array of pointer strings.  Will not return null.
		 */
		this.getPointerStrings = function()
		{
			// Should this return a copy?
		        // Return empty array if null.
			return this.pointerStrings || [];
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
			paper:"journal",
			"press release":"press release",
		        "pressrelease":"press release",
		        "episode":"episode"
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
		        web : [ "url", "title", "author", "accessdate", "work", "publisher", "date", "pages"],
		        book : [ "title", "author", "authorlink", "year", "isbn", "publisher", "location", "pages" ],
		        journal : [ "title", "author", "journal", "volume", "issue", "year", "month", "pages", "url", "doi" ],
		        conference : [ "conference", "title", "booktitle", "author", "editor", "year", "month", "url", "id", "accessdate", "location", "pages", "publisher" ],
			encyclopedia: [ "title", "encyclopedia", "author", "editor", "accessdate", "edition", "year",
			"publisher", "volume", "location", "pages" ],
		        news: [ "title", "author", "url", "publisher", "date", "accessdate", "pages" ],
			newsgroup : [ "title", "author", "date", "newsgroup", "id", "url", "accessdate" ],
		        "press release"	: [ "title", "url", "publisher", "date", "accessdate" ],
		        episode : ["title", "series", "credits", "airdate", "city", "network", "season" ]
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
		proveit.AbstractCitation.call(this, argObj);

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
		var paramRows = $('div', paramList);
		for (var i = 0; i < paramRows.length; i++)
		{
			var paramRow =  paramRows[i];
			this.log("citationObjFromAddPopup: i: " + i + ", paramRow: " + paramRow);
			var valueTextbox = paramRow.getElementsByClassName("paramvalue")[0];

			if($(paramRow).hasClass("addedrow")) // Added with "Add another field"
			{
				paramName = paramRow.getElementsByClassName("paramdesc")[0].value.trim();
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
// 		this.getRefbox().scrollToIndex(this.getRefbox().itemCount - 1);
// 		this.getRefbox().selectedIndex = this.getRefbox().itemCount - 1;
		this.highlightTargetString(tag.orig);
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
		$('.remove', row).click(function()
		{
			$(row).hide(
				'highlight',{},'slow',
				function() {
					$(row).remove();
					}
				);
		});
	},

	/**
	 * Changes the panel for the add cite panel to the correct type of entry
	 * @param menu Raw HTML menu element
	 */
	changeCite : function(menu) {
		this.log("Entering changeCite");
		//this.log("menu.id: " + menu.id);

		this.log("changeCite: Calling citationObjFromAddPopup");
		$(menu.parentNode).show(); // cite/citation vbox.

		var citePanes = $(".addpanes", menu.parentNode.parentNode).get(0);
		//this.log("citePanes: " + citePanes);
		this.clearCitePanes(citePanes);
		var newCiteType = menu.value;

		var genPane = document.getElementById("dummyCitePane").cloneNode(true);
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

			if(descs[param])
			{
				paramBox = document.getElementById("preloadedparamrow").cloneNode(true);
				var label = $('.paramdesc', paramBox);
				if(required[param])
				{
					label.addClass("required");
					$('.remove', paramBox).remove(); // don't let people remove required fields
				}
				else
				{
					this.activateRemove(paramBox);
				}
				label.text(descs[param]);
				// Basically the same code as nameHbox above
				label.attr("for", this.NEW_PARAM_PREFIX + param);
			}
			else
			{
				// Throwing an error here doesn't make sense if user-added fields can be copied over.
				// throw new Error("Undefined description for param: " + param);
				paramBox = document.getElementById("addedparamrow").cloneNode(true);
				var nameTextbox = paramBox.getElementsByClassName("paramdesc")[0];
				nameTextbox.setAttribute("value", param);
			}
			paramBox.id = "";
			this.activateRemove(paramBox);

			paramBox.getElementsByClassName("paramvalue")[0].id = this.NEW_PARAM_PREFIX + param;
			this.log("changeCite: param: " + param + "; newCite.params[param]: " + newCite.params[param]);
			//paramBox.childNodes[2].value = newCite.params[param]; // Causes parameters to disappear.  Why?
			$(paramBox).show();
			paramList.appendChild(paramBox);
		}
		$(genPane).show();
		citePanes.insertBefore(genPane, citePanes.firstChild);
		this.log("Exiting changeCite");
	},

	/**
	 * Create ProveIt HTML GUI
	 */
	createGUI : function()
	{
	        // Keep jQuery UI CSS version in sync with JS above.
	        importStylesheetURI('http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.3/themes/base/jquery-ui.css');
		importStylesheetURI(this.STATIC_BASE + 'styles.css');

		// more JqueryUI CSS: http://blog.jqueryui.com/2009/06/jquery-ui-172/
		var gui = $('<div/>', {id: 'proveit'});
		var tabs = $('<div/>', {id: 'tabs'});
		var created = $('<h1/>');
		var createdLink = $('<a/>', {title: 'Created by the ELC Lab at Georgia Tech',
			                     href: 'http://www.cc.gatech.edu/elc',
					     target: '_blank'}).
			append('ProveIt');
		created.append(createdLink);
		var showHideButton = $('<button/>', {text: 'show/hide'});
		created.append(showHideButton);
		tabs.append(created);
		var header = $('<ul/>');
		var view = $('<li/>');
		var viewLink = $('<a/>', {id: 'view-link', class: 'tab-link', href: '#view-tab'});
		viewLink.append('References (');
		var numRefs = $('<span/>', {id: 'numRefs'}).
			append('0');
		viewLink.append(numRefs).
			append(')');
		view.append(viewLink);
		header.append(view);
		var add = $('<li/>');
		var addLink = $('<a/>', {id: 'add-link', class: 'tab-link', href: '#add-tab'}).
			append('Add');
		add.append(addLink);
		header.append(add);
		tabs.append(header);
		var viewTab = $('<div/>', {id: 'view-tab'});
		var viewPane = $('<div/>', {id: 'view-pane'});
		var viewScroll = $('<div/>', {class: 'scroll',
					      style: 'height: 210px;'});
		var refTable = $('<table/>', {id: 'refs'});
		var dummyRef = $('<tr/>', {id: 'dummyRef',
					   style: 'display: none;'});
		dummyRef.append($('<td/>', {class: 'number'})).
			append($('<td/>', {class: 'type'})).
			append($('<td/>', {class: 'title'})).
			append($('<td/>', {class: 'details'}));
		var editTd = $('<td/>', {class: 'edit'}).
			append($('<button/>', {text: 'edit'}));
		dummyRef.append(editTd);
		refTable.append(dummyRef);
		viewScroll.append(refTable);
		viewPane.append(viewScroll);
		viewTab.append(viewPane);
		var editPane = $('<div/>', {id: 'edit-pane', style: 'display: none'});
	        var refNameRow = $('<div/>', {class: 'ref-name-row',
					      tabindex: -1});
		var refLabel = $('<label/>', {for: 'editrefname',
					      title: 'This is an identifier that can be used to refer to this reference elsewhere on the page. It should be short and memorable.',
					      class: 'paramdesc'}).
			append('&lt;ref&gt; name (abbr. code)');
		refNameRow.append(refLabel);
		refNameRow.append($('<input/>', {id: 'editrefname',
	                                       class: 'refname paramvalue'}));
		editPane.append(refNameRow);
		var editFields = $('<div/>', {id: 'edit-fields',
					      class: 'inputs scroll paramlist',
					      style: 'height: 170px',
					      tabindex: 0});
		editPane.append(editFields);
		var editButtons = $('<div/>', {id: 'edit-buttons'});
		var addFieldButton = $('<button/>', {style: 'margin-right: 50px;'}).
			append('add field');
		editButtons.append(addFieldButton);
		var reqSpan = $('<span/>', {class: 'required',
					    text: 'red'});
		editButtons.append(reqSpan).
			append(' = required');
		var saveButton = $('<button/>', {class: 'right-side accept',
		                                 text: 'update edit form'});
		editButtons.append(saveButton);
		var cancelButton = $('<button/>', {class: 'right-side cancel',
			                           text: 'cancel'});
		editButtons.append(cancelButton);
		editPane.append(editButtons);
		viewTab.append(editPane);
		tabs.append(viewTab);
		var dummyCite = $('<div/>', {id: 'dummyCitePane',
					     class: 'typepane',
					     style: 'display: none'});
		var addRefNameRow = refNameRow.clone();
		$('.refname', addRefNameRow).attr('id', 'addrefname');
		$('label', addRefNameRow).attr('for', 'addrefname');
		dummyCite.append(addRefNameRow);
		dummyCite.append($('<div/>', {class: 'paramlist'}));
		tabs.append(dummyCite);
		var preloadedparam = $('<div/>', {id: 'preloadedparamrow',
						  class: 'preloadedrow input-row',
						  style: 'display: none'}).
			append($('<label/>', {class: 'paramdesc'}));
		var paramvalue = $('<input/>', {class: 'paramvalue',
				                tabindex: -1});
	        preloadedparam.append(paramvalue);
		var deleteButton = $('<button/>', {class: 'remove'}).
			append('delete field');
		preloadedparam.append(deleteButton);
		tabs.append(preloadedparam);
		var addedparam = $('<div/>', {id: 'addedparamrow',
					      class: 'addedrow input-row',
 					      style: 'display: none'}).
		        append($('<input/>', {class: 'paramdesc',
					      tabindex: -1})).
			append(paramvalue.clone()).
			append(deleteButton.clone());
		tabs.append(addedparam);
		var addTab = $('<div/>', {id: 'add-tab'});
		var addFields = $('<div/>', {id: 'add-fields',
					     class: 'inputs scroll',
					     style: 'height: 170px'});
		var cite = $('<div/>', {style: 'display: none',
					id: 'cite',
				        class: 'input-row'});
		var refCiteTypeLabel = $('<label/>', {for: 'citemenu',
						  class: 'paramdesc required',
						  text: 'Reference type'});
		cite.append(refCiteTypeLabel);
		var citemenu = $('<select/>', {id: 'citemenu',
					       change: function()
					       {
						       proveit.changeCite(citemenu.get(0));
					       }});
		// Lists of types (citeTypes, citationTypes) probably don't belong here
         	var citeTypes = ["web", "book", "journal", "conference", "encyclopedia", "news", "newsgroup", "press release", "episode"];
		var descs = new this.AbstractCitation({}).getDescriptions();
		for(var i = 0; i < citeTypes.length; i++)
		{
			citemenu.append($('<option/>', {value: citeTypes[i],
						        text: descs[citeTypes[i]]}));
		}
		cite.append(citemenu);
		addFields.append(cite);
		addFields.append($('<div/>', {class: 'addpanes',
					      id: 'citepanes',
					      tabindex: 0}));
		var citation = $('<div/>', {style: 'display: none',
					    id: 'citation',
					    class: 'input-row'});
		var refCitationTypeLabel = refCiteTypeLabel.clone().attr('for', 'citationmenu');
		citation.append(refCitationTypeLabel);
		var citationmenu = $('<select/>', {id: 'citemenu',
		                                   change: function()
						   {
							   proveit.changeCite(citationmenu.get(0));
						   }});
		var citationTypes = ['web', 'book', 'journal', 'encyclopedia', 'news', 'patent'];
		for(var j = 0; j < citationTypes.length; j++)
		{
			citationmenu.append($('<option/>', {value: citationTypes[i],
			                                    text: descs[citationTypes[i]]}));
		}
		citation.append(citationmenu);
		addFields.append(citation).
			append($('<div/>', {class: 'addpanes',
					    id: 'citationpanes'}));
		addTab.append(addFields);
		var addButtons = $('<div/>', {id: 'add-buttons'});
		addButtons.append($('<button/>', {style: 'margin-right: 50px;',
						  text: 'add field'})).
			append(reqSpan.clone()).
			append(" = required").
			append(saveButton.clone().text('insert into edit form')).
			append(cancelButton.clone());
		addTab.append(addButtons);
		tabs.append(addTab);
		gui.append(tabs);
		$(document.body).prepend(gui);

		var cancelEdit = function() {
				$("#edit-pane").hide();
				$("#view-pane").show();
		};

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

						case 1: // add
						    cancelEdit();
						    proveit.changeCite(document.getElementById(proveit.togglestyle ? 'citemenu' : 'citationmenu'));
						break;

				      //	case 1: // edit
						// proveit.updateEditPopup();
						//	$('tr.selected').dblclick();
						//break;

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
			 })
		.next().next().button({
			icons: {
				primary: 'ui-icon-circle-check',
				secondary: 'ui-icon-circle-arrow-e'
			}
		}).click(function()
			 {
				 proveit.addCitation(proveit.citationObjFromAddPopup($('#add-tab .typepane').get(0)));
				 $("#tabs").tabs( { selected: '#view-tab' } );
				 $("div.scroll, #view-pane").scrollTop(100000); // scroll to new ref
			 }).next().
		button({
			icons: {
				primary: 'ui-icon-circle-close'
				}
		}).click(function()
			 {
				 $("#tabs").tabs( { selected: '#view-tab' } );
			 });

		// cancel buttons
		$("button.cancel").click(cancelEdit);

		// edit panel buttons
		$("#edit-buttons button:first").button({
			icons: {
				primary: 'ui-icon-circle-plus'
			}
		}).click(function()
			 {
				 proveit.addPopupRow($("#edit-pane"));
			 }).
		next().next().
		button({
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

		// create the minimize button
		showHideButton.button({
			icons: {
				primary: 'ui-icon-triangle-1-s'
			},
			text: false
		});

		// set up the minimize button
		showHideButton.toggle(
			function() {
				$("#view-tab, #add-tab").hide();
				$(this).button("option", "icons", { primary: 'ui-icon-triangle-1-n' } );
			},
			function() {
				$("#view-tab, #add-tab").show();
				$(this).button("option", "icons", { primary: 'ui-icon-triangle-1-s' } );
			}
		);

		this.scanRef();

		// make individual refs selectable
		$("#refs tr").click(
			function() {
				proveit.selectRow(this);
			}
		);


		$("#refs tr").eq(0).click().click(); // select first item in list.  TODO: Why two .click?

		// alternate row colors
		$("#refs tr:even").addClass('light');
		$("#refs tr:odd").addClass('dark');
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

		//var refbox = this.getRefbox();

		var newchild = $('<tr><td class="number"></td><td class="type"></td><td class="title"></td><td class="details"></td><td class="ibid"><button>ibid.</button></td><td class="edit"><button>edit</button><span class="pointers"></span></td></tr>').get(0);

		$("td.edit button", newchild).button({
			icons: {
				primary: 'ui-icon-pencil'
			},
			text: false
		});

		if(!ref.isValid())
		{
			// Flag as invalid.
			$(newchild).addClass('invalid');
		}
		// grab the nodes that need changed out of it
		//var newlabel = newchild.getElementsByClassName("richitemlabel")[0];
		var neweditimage = $('.edit button', newchild).get(0);
		//var newinsertimage = newchild.getElementsByClassName("richiteminsert")[0];
		//newchild.hidden = false;
		var thisproveit = this;
	//	var tooltip = "";
		if(refName && refName != "")
                {
                        //tooltip += document.getElementById("refNameDesc").value + ref.name + "\n";
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

		var title = '';
		var shortTitle = '';

		if(ref.params['title'] != null)
		{
			title = ref.params['title'];
			shortTitle = this.truncateTitle(title);
		}

		$('td.title', newchild).text(shortTitle);
		$('td.title', newchild).attr('title', title);

		// deal with variations of date info
		var formattedYear = '';

		if(ref.params['year'])
			formattedYear = ref.params['year'];
		else if (ref.params['date'])
		{
			var year = ref.params['date'].substr(0,4); // use just the year
			if( (year.substr(0,1) == '1') || (year.substr(0,1) == '2') ) // rough check of year validity
				formattedYear = year;
		}

		//$('td.year', newchild).text(formattedYear);

		// deal with variations of author info
		var formattedAuthor = '';

		if(ref.params['author'])
			formattedAuthor = ref.params['author'];
		else if (ref.params['last'])
		{
			// if(ref.params['first'])
				// formattedAuthor = ref.params['last'] + ', ' + ref.params['first'];
			// else
				formattedAuthor = ref.params['last'];
		}

		if(ref.params['coauthors'] || ref.params['last2'])
			formattedAuthor += ' <i>et al.</i>';

		// build the "details" cell based on presence of author/year data
		var details = '';
		if (formattedYear != '' && formattedAuthor != '')
			details = '(' + formattedAuthor + ', ' + formattedYear + ')';
		else if (formattedYear != '')
			details = '(' + formattedYear + ')';
		else if (formattedAuthor != '')
			details = '(' + formattedAuthor + ')';
		$('td.details', newchild).html(details);

		// pick an icon based on ref type
		var icon = this.STATIC_BASE;
		switch(ref.type)
		{
			case 'web':
				icon += 'page_white_world.png';
				break;
			case 'book':
				icon += 'book.png';
				break;
			case 'journal':
			case 'conference':
			case 'paper':
				icon += 'page_white_text.png';
				break;
			case 'news':
				icon += 'newspaper.png';
				break;
			case 'newsgroup':
				icon += 'comments.png';
				break;
			case 'press release':
				icon += 'report.png';
				break;
			default:
				icon += 'page_white.png';
				break;
		}
		$('td.type', newchild).css('background-image','url('+icon+')');
		$('td.type', newchild).attr('title',ref.type);

		//$('td.author', newchild).html(formattedAuthor);

		// single click event handler

		// newchild.addEventListener("click", function()
		// {
			// thisproveit.highlightTargetString(ref.orig);
		// }, false);
		//alert(ref.orig);

		// get ref number by counting number of refs (this includes dummy ref)
		var numRefs = $('#refs tr').length + 1;
		$('td.number', newchild).text(numRefs);
		$('#numRefs').text(numRefs); // update the number of refs in the view tab

		// event handler for selecting a ref)
		$(newchild).click(function() { thisproveit.highlightTargetString(ref.orig); thisproveit.highlightTargetString(ref.orig); });

		// double click event handler

		var doEdit = function() {
			thisproveit.selectRow(newchild);

		//	var selectedTab = $( "#tabs" ).tabs( "option", "selected" );
		//	alert(selectedTab);
		//	if(selectedTab != 1)
		//      $( "#tabs" ).tabs( "option", "selected", 1 );

			thisproveit.updateEditPopup(ref);

			$("#view-pane").hide();
			$("#edit-pane").show();
		};

		var pointStrings = ref.getPointerStrings();

		// ibid button
		var ibidEnabled = pointStrings.length != 0;
		var ibidButton = $("td.ibid button", newchild).button({
			icons: {
				primary: 'ui-icon-arrowthick-1-e'
			},
			text: false,
			disabled: !ibidEnabled
		});
		if(ibidEnabled)
		{
		    ibidButton.click(function()
		    {
			thisproveit.insertRef(ref, false);
			return false;
		    });
		}
		var pointers = $('.pointers', newchild);

		for(var i = 0; i < pointStrings.length; i++)
		{
			var dividend = i + 1;
			var colName = "";

			while(dividend > 0)
			{
				var mod = (dividend - 1) % 26;
				colName = String.fromCharCode(97 + mod) + colName;  // a = 97
				dividend = Math.floor(dividend / 26);
			}
			var pointerHolder = $('<a href="#">' + colName + '</a>');
			// Bind i
			var proveit = this;
			var clickFunc = (function(i)
			{
				return function()
				{
					var last = 0, j = 0;
					var text = $(proveit.getMWEditBox()).val();
					for(j = 0; j < i; j++)
					{
						last = text.indexOf(pointStrings[j], last);

						// Shouldn't happen.  Indicates pointer strings are out of date.
						if(last == -1)
						{
							break;
						}
						last += pointStrings[j].length;
					}
					if(j == i)
					{
						proveit.highlightLengthAtIndex(text.indexOf(pointStrings[i], last),
									    pointStrings[i].length);
						return false;
					}
				};
			})(i);

			pointerHolder.click(clickFunc);
			pointers.append(pointerHolder);
		}

		//var selectedIndex = thisproveit.getRefbox().selectedIndex;
		//var winData = {"proveit": thisproveit, "ref": ref};
		//selectRow(newchild);
		//window.openDialog("edit_dialog.xul", "edit dialog", thisproveit.DIALOG_FEATURES, winData);
		//thisproveit.getRefbox().selectedIndex = selectedIndex;

		$(newchild).dblclick(doEdit);
		//newchild.addEventListener("dblclick", doEdit, false);
		$(neweditimage).click(doEdit);
		//neweditimage.addEventListener("click", doEdit, false);

		// newlabel.setAttribute("value", ref.getLabel());
		// newlabel.setAttribute("control", "refbox");
		return newchild;
	},

	truncateTitle : function(title)
	{
		var MAX_LENGTH = 65;
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
	},

	selectRow : function(row)
	{
		$("#refs tr").removeClass('selected');
		$(row).addClass('selected');
		//$(row).click();
	}
};

/**
 * Generic trim function, trims all leading and trailing whitespace.
 *
 * @return the trimmed string
 */

if(!String.prototype.trim)
{
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, "");
	};
}

addOnloadHook(function()
{
	proveit.proveitonload();
});
