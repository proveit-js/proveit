/*
 * ProveIt ([[User:ProveIt GT]]) is a powerful GUI tool for viewing, adding, editing, and inserting references on Wikipedia.
 *
 * Copyright 2008 - 2011
 *
 * Georgia Tech Research Corporation
 *
 * Atlanta, GA 30332-0415
 *
 * Copyright 2011 -
 *
 * Matthew Flaschen
 *
 * ALL RIGHTS RESERVED
 *
 * ProveIt is available under the GNU Free Documentation License (GFDL-1.3.txt), Creative Commons
 * Attribution/Share-Alike License 3.0 (http://creativecommons.org/licenses/by-sa/3.0/), and the GNU
 * General Public License 2 (GPL-2.txt)
 */

/**
 * Electronic Learning Communities
 * @module elc
 */

/*
 Second parameter (pre-existing proveit object, if any) passed to extend overrides first.
 Gives users option to easily override initial constants, such as shouldAddSummary.

 If proveit is unintentionally imported more than once, the first import will take precedence.
*/
/**
 * Main class and namespace for ProveIt software.  This is the only global variable.
 * @class proveit
 */
window.proveit = $.extend({
	/**
	 * Approximately half the height of the edit box.  Used in scrolling when highlighting text.
	 * @type Number
	 */
	HALF_EDIT_BOX_HEIGHT: 200,

	// This could be preference-controlled, instead of hard-coded.
	/**
	 * Language used for descriptions
	 * @type String
	 */
	LANG: "en",

	/**
	 * Text before param name (e.g. url, title, etc.) in creation box, to avoid collisions with unrelated ids.
	 * @type String
	 */
	NEW_PARAM_PREFIX: "newparam",

	/**
	 * Text before param name (e.g. url, title, etc.) in edit box, to avoid collisions with unrelated ids.
	 * @type String
	 */
	EDIT_PARAM_PREFIX: "editparam",

	GUI_ID: "proveit",

	/**
	 * Base URL used for static content
	 *
	 * This directory includes icons from the Silk set (http://www.famfamfam.com/lab/icons/silk/), by Mark James
	 * @type String
	 */
	STATIC_BASE: "//proveit-js.googlecode.com/hg/static/",

	/* Used to map between keys, including citation parameter names, and human-readable text.  It can be
	 * internationalized easily.  Add descriptions.xx , where xx is
	 * the ISO 639-1 code for a language, then set proveit.LANG to "xx"
	 * to use the new descriptions.
	 */
	descriptions :
	{
		en :
		{
			agency: "Agency",
			name: "Name",
			author: "Author (L, F)",
			author2: "Author two (L, F)",
			author3: "Author three (L, F)",
			author4: "Author four (L, F)",
			author5: "Author five (L, F)",
			author6: "Author six (L, F)",
			author7: "Author seven (L, F)",
			author8: "Author eight (L, F)",
			author9: "Author nine (L, F)",
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
			trans_title: "Title in English",
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
			date: "Publication date",
			accessdate: "Access date",
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
			"issue-date": "Issue date",
			"patent-number": "Patent number",
			"country-code": "Country code (XX)",
			work: "Work",
			format: "Format",
			issn: "ISSN",
			pmid: "PMID",
			chapter: "Chapter",
			web: "Web",
			book: "Book",
			conference: "Conference",
			news: "News",
			paper: "Paper",
			"press release": "Press release",
			interview: "Interview",
			"AV media": "Audiovisual work",
			subject: "Subject",
			subjectlink: "Subject article name",
			subject2: "Subject two",
			subjectlink2: "Subject two article name",
			subject3: "Subject three",
			subjectlink3: "Subject three article name",
			subject4: "Subject four",
			interviewer: "Interviewer",
			cointerviewers: "Co-interviewers",
			type: "Type",
			program: "Program",
			callsign: "Call sign",
			city: "City",
			archiveurl: "Archive URL",
			archivedate: "Date archived",
			episode: "Episode",
			episodelink: "Episode article name",
			series: "Series",
			serieslink: "Series article name",
			credits: "Credits",
			network: "Network",
			station: "Station",
			airdate: "Airdate",
			began: "Start date",
			ended: "End date",
			season: "Season number",
			seriesno: "Season number",
			number: "Number",
			minutes: "Minutes",
			transcript: "Transcript",
			transcripturl: "Transcript URL",
			people: "People",
			medium: "Production medium",
			language: "Language",
			time: "Time",
			oclc: "OCLC",
			ref: "Anchor ID",
			months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			deadurl: 'Dead URL?'
		},
		// Finnish translation by Olli (ollinpostit at gmail.com)
		fi: {
                        agency: "Edustaja",
                        name: "Nimi",
                        author: "Tekijä",
                        author2: "Tekijä kaksi",
                        author3: "Tekijä kolme",
                        author4: "Tekijä neljä",
                        author5: "Tekijä viisi",
                        author6: "Tekijä kuusi",
                        author7: "Tekijä seitsemän",
                        author8: "Tekijä kahdeksan",
                        author9: "Tekijä yhdeksän",
                        last: "Sukunimi",
                        last2: "Sukunimi (tekijä 2)",
                        last3: "Sukunimi (tekijä 3)",
                        last4: "Sukunimi (tekijä 4)",
                        last5: "Sukunimi (tekijä 5)",
                        last6: "Sukunimi (tekijä 6)",
                        last7: "Sukunimi (tekijä 7)",
                        last8: "Sukunimi (tekijä 8)",
                        last9: "Sukunimi (tekijä 9)",
                        first: "Etunimi",
                        first2: "Etunimi (tekijä 2)",
                        first3: "Etunimi (tekijä 3)",
                        first4: "Etunimi (tekijä 4)",
                        first5: "Etunimi (tekijä 5)",
                        first6: "Etunimi (tekijä 6)",
                        first7: "Etunimi (tekijä 7)",
                        first8: "Etunimi (tekijä	8)",
                        first9: "Etunimi (tekijä 9)",
                        authorlink: "Tekijästä kertova sivu",
                        title: "Otsikko",
                        publisher: "Julkaisija",
                        year: "Vuosi",
                        location: "Paikka",
                        place: "Työn paikka",
                        isbn: "ISBN",
                        id: "ID",
                        doi: "DOI",
                        page: "Sivu",
                        pages: "Sivuja",
                        quote: "Lainaus",
                        month: "Kuukausi",
                        journal: "Aikakauslehti",
                        edition: "Painos",
                        volume: "Vuosikerta",
                        issue: "Numero",
                        url: "Osoite",
                        date: "Julkaisupäivä",
                        accessdate: "Luettu",
                        coauthors: "Muut tekijät",
                        booktitle: "Jatko-osien otsikko",
                        contribution: "Osallistuminen/yhteistyö",
                        encyclopedia: "Tietosanakirja",
                        newsgroup: "Uutisryhmä",
                        version: "Versio",
                        site: "Sivusto",
                        newspaper: "Sanomalehti",
                        "publication-place": "Julkaisupaikka",
                        editor: "Toimittaja",
                        article: "Artikkeli",
                        pubplace: "Julkaisijan paikka",
                        pubyear: "Julkaisuvuosi",
                        inventor: "Keksijä",
                        "issue-date": "Saatavilla päivänä",
                        "patent-number": "Patenttinumero",
                        "country-code": "Maakoodi (XX)",
                        work: "Työ",
                        format: "Muoto",
                        issn: "ISSN",
                        pmid: "PMID",
                        chapter: "Luku",
                        web: "Verkko",
                        book: "Kirja",
                        conference: "Kokous",
                        news: "Uutiset",
                        paper: "Lehti",
                        "press release": "Lehdistötiedote",
                        interview: "Haastattelu",
                        subject: "Otsikko",
                        subjectlink: "Artikkelin otsikko",
                        subject2: "Otsikko kaksi",
                        subjectlink2: "Artikkelin kaksi otsikko",
                        subject3: "Otsikko kolme",
                        subjectlink3: "Artikkelin kolme otsikko",
                        subject4: "Otsikko neljä",
                        interviewer: "Haastattelija",
                        cointerviewers: "Muut haastattelijat",
                        type: "Tyyppi",
                        program: "Ohjelma",
                        callsign: "Call sign",
                        city: "Kaupunki",
                        archiveurl: "Arkiston osoite",
                        archivedate: "Arkistointipäivämäärä",
                        episode: "Jakso",
                        episodelink: "Jakson sivun nimi",
                        series: "Sarja",
                        serieslink: "Sarjan sivun nimi",
                        credits: "Tekijät",
                        network: "Verkko",
                        station: "Asema",
                        airdate: "Lähetyspäivä",
                        began: "Aloituspäivä",
                        ended: "Lopetuspäivä",
                        season: "Kauden numero",
                        seriesno: "Kauden numero",
                        number: "Numero",
                        minutes: "Minuutit",
                        transcript: "Puhtaaksi kirjoitettu teksti",
                        transcripturl: "Puhtaaksikirjoitetun osoite",
                        video: "Video",
                        people: "Ihmiset",
                        medium: "Tuotantomedia",
                        language: "Kieli",
                        time: "Aika",
                        oclc: "OCLC",
                        ref: "Ankkurin ID-tunnus",
                        months: ['tammikuu', 'helmikuu', 'maaliskuu', 'huhtikuu', 'toukokuu', 'kesäkuu', 'heinäkuu', 'elokuu', 'syyskuu', 'lokakuu', 'marraskuu', 'joulukuu']
                }
	},

	/**
	 * Returns descriptions for the current language.
	 * @return {Object} descriptions
	 */
	getDescriptions: function()
	{
		//this could be made Cite-specific if needed.
		return this.descriptions[proveit.LANG];
	},

	/**
	 * String added to logs for easy search
	 * @type String
	 */
	LOG_MARKER: "[ProveIt] ",

	/**
	 * Convenience log function
	 * @param {...Object} var_args objects (including strings) to log
	 */
	log: function()
	{
		var args = Array.prototype.slice.call(arguments);
		args.unshift(this.LOG_MARKER);
		mw.log.apply(mw, args);
	},

	/**
	 * Log error object if possible, using error (preferable), or log, if available.
	 * @param {Error} ex error object
	 */
	logException: function(ex)
	{
		var args = [ex, ex.stack];
		if(typeof(console) === "object" && $.isFunction(console.error))
		{
			args.unshift(this.LOG_MARKER);
			console.error.apply(null, args);
		}
		else
		{
			this.log.apply(this, args);
		}
	},

	/**
	 * Returns true if the page has an edit box
	 *
	 * @return {Boolean} true if the page has an edit box, false otherwise
	 */
	isEditPage: function()
	{
		return wgAction == 'edit' || wgAction == 'submit';
	},

	/**
	 * Returns true if the page is likely to contain references
	 * @return {Boolean} true if page is supported, false otherwise
	 */
	isSupportedPage: function()
	{
	        // "Regular" article, userspace, or Wikipedia:Sandbox (exception for testing).
	        return (wgCanonicalNamespace == '' || wgCanonicalNamespace == 'User' || wgPageName == 'Wikipedia:Sandbox');
	},

	/**
	 * Convenience function.  Returns the refbox element.
	 * @return {$Node} reference box
	 */
	getRefBox: function()
	{
		return $("#refs");
	},

	/**
	 * Provides the x (left) and y (top) offsets to a given element. From QuirksMode (http://www.quirksmode.org/js/findpos.html), a freely available site by Peter-Paul Koch
	 * @param {Node} node any HTML node
	 * @return {Object} offsets to node, as object with left and top properties.
	 */
	getPosition: function(node)
	{
		var left = 0, top = 0;
		do
		{
			left += node.offsetLeft;
			top += node.offsetTop;
		} while (node = node.offsetParent);
		return {"left": left, "top": top};
	},

	/**
	 * Highlights a given length of text, at a particular index.
	 * @param {Number} startInd start index in Wikipedia edit box
	 * @param {Number} length length of string to highlight
	 * @return {Boolean} always true
	*/
	highlightLengthAtIndex: function(startInd, length)
	{
		if(startInd < 0 || length < 0)
		{
			this.log("highlightStringAtIndex: invalid negative arguments");
		}
		var box = this.getMWEditBox();
		var origText = box.value;
		var editTop = this.getPosition(box).top;
		box.value = origText.substring(0, startInd);
		box.focus();
		box.scrollTop = 1000000; //Larger than any real textarea (hopefully)
		var curScrollTop = box.scrollTop;
		box.value += origText.substring(startInd);
		if(curScrollTop > 0)
		{
			box.scrollTop = curScrollTop + this.HALF_EDIT_BOX_HEIGHT;
		}
		$(box).focus().textSelection('setSelection',
		{
			start: startInd,
			end: startInd + length
		});
		editTop = this.getPosition(box).top;
		window.scroll(0, editTop);
		return true;
	},

	/**
	 * Highlights the first instance of a given string in the MediaWiki edit box.
	 * @param {String} targetStr the string in the edit box to highlight
	 * @return {Boolean} true if successful, false otherwise
	*/
	highlightTargetString: function(targetStr)
	{
		var origText = this.getMWEditValue();
		var startInd = origText.indexOf(targetStr);
		if(startInd == -1)
		{
			this.log("Target string \"" + targetStr + "\" not found.");
			return false;
		}
		return this.highlightLengthAtIndex(startInd, targetStr.length);
	},

	/**
	 * Convenience function. Returns the raw MediaWiki textarea element.
	 * @return {Node} the edit box element
	*/
	getMWEditBox: function()
	{
		return $("#wpTextbox1")[0];
	},

	/**
	 * Provides value of edit box with CR normalization
	 *
	 * @return {String} value of edit box with CRs stripped if document.selection exists
	 */
	getMWEditValue: function()
	{
		var box = this.getMWEditBox();
		var value = box.value;
		if(!box.selectionStart && document.selection) // IE 8-like behavior
		{
			value = value.replace(/\r\n/g, "\n");
		}
		return value;
	},

	/**
	 * Returns raw edit form element, which contains MWEditBox, among other things.
	 * @return {Node} the edit form element
	*/
	getMWEditForm: function()
	{
		return $("#editform")[0];
	},

	/**
	 * Runs a given function on submission of edit form
	 * @param {Function} subFunc function to run on submission
	*/
	addOnsubmit: function(subFunc)
	{
		var form = this.getMWEditForm();
		if(!form)
		{
			throw new Error("No edit form, possibly due to protected page.");
		}
		form.addEventListener("submit", subFunc, false);
	},

	/**
	 * Returns the raw MW edit summary element
	 * @return {Node} the edit summary element
	*/
	getEditSummary: function()
	{
		return $("#wpSummary")[0];
	},

	/**
	 * Keep track of whether we have already added an onsubmit function to include ProveIt in the summary.
	 * This guarantees the function will not be run twice.
	 * @type Boolean
	 */
	summaryFunctionAdded: false,

	/**
	 * Does the user want us to ever add "Edited by ProveIt" summary?
	 * @type Boolean
	*/
	shouldAddSummary: true,

	/**
	 * ProveIt should be visible on load (rather than requiring toolbar button click) on supported edit pages
	 * @type Boolean
	 */
 	loadVisible: true,

	/**
	 * Maximize ProveIt when it first becomes visible.  If false, it will start minimized.  This has no effect on when it becomes visible.
	 * @type Boolean
	 */
	loadMaximized: false,

	/**
	 * Specifies to include ProveIt edit summary on next save.
	 * Can be disabled by modifying shouldAddSummary
	 */
	includeProveItEditSummary: function()
	{
		if(this.shouldAddSummary && !this.summaryFunctionAdded)
		{
			try
			{
				var thisproveit = this;
				this.addOnsubmit(function()
				{
					var summary = thisproveit.getEditSummary();

					if(summary.value.indexOf("ProveIt") == -1)
					{
						summary.value += " (edited with [[User:ProveIt_GT|ProveIt]])";
					}
				});
				this.summaryFunctionAdded = true;
			}
			catch(e)
			{
				this.log("Failed to add onsubmit handler. e.message: " + e.message);
			}
		}
	},

	/**
	 * Setup button so users can load ProveIt on demand
	 */
	setupButton: function()
	{
		var $box = $(this.getMWEditBox());

		// Ensures wikiEditor is loaded
		$box.bind('wikiEditor-toolbar-buildSection-main', function(event, section)
		{
			delete section.groups.insert.tools.reference;

			section.groups.insert.tools.proveit = {
				label: 'ProveIt',
				type: 'button',
				icon: '//upload.wikimedia.org/wikipedia/commons/thumb/1/19/ProveIt_logo_for_user_boxes.svg/22px-ProveIt_logo_for_user_boxes.svg.png',
				action: {
					type: 'callback',
					execute: function()
					{
						proveit.toggleVisibility();
					}
				}
			};
		});
	},

	/**
	 * Sets up ProveIt if we're on an edit page.  This includes setting up the toolbar button.  Depending on configuration and the current page, it may also call load to show ProveIt.
	 */
	setup: function()
	{
		if(this.isEditPage())
		{
			if(this.loadVisible && this.isSupportedPage())
			{
				this.load();
			}

			this.setupButton();
		}
	},

	/**
	 * Loads dependencies and creates GUI
	 */
	load: function()
	{
		addOnloadHook(function()
		{
			var dependencies = ['jquery.ui.tabs', 'jquery.ui.button', 'jquery.effects.highlight', 'jquery.textSelection'];
			mw.loader.using(dependencies, function()
			{
				try
				{
					proveit.createGUI();
					if(proveit.loadMaximized)
					{
						proveit.toggleViewAddVisibility();
					}
				}
				catch(ex)
				{
					proveit.logException(ex);
				}
			}, function(ex, errorDependencies)
			{
				proveit.log('Failed to load one of: ', errorDependencies);
			});
		});
	},

	/**
	 * Clears the refBox of refBoxRows, except for dummy rows.
	 * @return {Boolean} false if refBox wasn't found
	 */

	clearRefBox: function()
	{
		var box = this.getRefBox();
		if(box == null)
		{
			this.log("Ref box is not loaded yet.");
			return false;
		}
		$("tr:not('tr#dummyRef')", box).remove();
		return true;
	},

	/** Inserts ref text into MW edit box.
	 * @param {String} ref Reference text to insert
	 * @param {Boolean} full Insert the full reference text if true, citation otherwise.
	 * @return {Boolean} false if errors
	 */
	insertRefIntoMWEditBox: function(ref, full)
	{
		var txtarea = this.getMWEditBox();
		if(!txtarea)
		{
			this.log("insertRefIntoMWEditBox: txtarea is null");
			return false;
		}
		txtarea = $(txtarea);
		var insertionText = ref.getInsertionText(full);
		 // Replace existing selection (if any), then scroll
		txtarea.textSelection('encapsulateSelection',
		{
			peri: insertionText,
			replace: true
		});
		var caretPos = txtarea.textSelection('getCaretPosition', {startAndEnd: true});

		// This is slightly redundant.  It is called primarily for the scrollig workaround
		this.highlightLengthAtIndex(caretPos[0], caretPos[1] - caretPos[0]);

		this.includeProveItEditSummary();
	},

	/**
	 * Modifies reference object from user-edited GUI. The reference object is mutated in place, so the return value is only for convenience.
	 *
	 * @param {Node} editPane the raw element of the editPane
	 * @param {AbstractReference} ref the original citation object we're modifying
	 *
	 * @return {AbstractReference} same ref that was passed in
	 */
	changeRefFromEditPane: function(ref, editPane)
	{
		var paramBoxes = $("div.input-row", editPane);

		var refName = $('#editrefname').val();
		ref.name = refName != "" ? refName : null; // Save blank names as null

		// Clear old params
		ref.params = {};

		var paramName, paramVal;
		for (var i = 0; i < paramBoxes.length; i++)
		{
			var paramRow = paramBoxes[i];
			var valueTextbox = $(".paramvalue", paramRow)[0];
			if($(paramRow).hasClass("addedrow")) // Added with "Add another field"
			{
				paramName = $.trim($(".paramdesc", paramRow)[0].value);
			}
			else
			{
				paramName = valueTextbox.id.substring(this.EDIT_PARAM_PREFIX.length);
			}
			this.log("paramName: " + paramName);
			paramVal = $.trim(valueTextbox.value);

			this.log("paramVal: " + paramVal);

			if (paramName != "" && paramVal != "")
			{
				ref.params[paramName] = paramVal;
			}
		}
		if (ref.toString() != ref.orig)
		{
			ref.save = false;
		}
		ref.update();
		return ref;
	},

	/**
	 * Creates refBoxRow, updates numbering for all refBoxRows, replaces old refBoxRow with new one, and updates ref text in MWEditBox.
	 * @param {AbstractReference} ref the ref we want to save.
	 */
	saveRefFromEdit: function(ref)
	{
		if(!ref.save)
		{
		    var newRichItem = this.makeRefBoxRow(ref, true);
			var oldRichItem = $('.selected', this.getRefBox()).get(0);
			var oldNumber = $('td.number',oldRichItem).text();
			$('td.number',newRichItem).text(oldNumber); // preserve old numbering
			oldRichItem.parentNode.replaceChild(newRichItem, oldRichItem);
			$(newRichItem).addClass('selected');

			ref.updateInText();
			this.includeProveItEditSummary();
		}
	},

	/**
	 * Updates the edit pane when you choose a reference to edit.
	 * @param {AbstractReference} ref the ref that was chosen.
	 */
	updateEditPane: function(ref)
	{
		$('#editrefname').val(ref.name || "");

		// Don't contaminate actual object with junk params.
		var tempParams = {};
		for(var param in ref.params)
		{
			tempParams[param] = ref.params[param];
		}

		// Add default params with blank values.
		var defaults = ref.getDefaultParams();
		for(var i = 0; i < defaults.length; i++)
		{
			if(!tempParams[defaults[i]])
			{
				tempParams[defaults[i]] = "";
			}
		}

		var required = ref.getRequiredParams();

		var paramNames = new Array();

		for(var item in tempParams)	//First run through just to get names.
		{
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

		$('#edit-fields').children('.paramlist').children().remove('div:not(.hidden)'); // clear all fields in the edit box (except the hidden ones)

		for(var j = 0; j < paramNames.length; j++)
		{
			this.addPaneRow($("#edit-pane").get(), tempParams, this.getDescriptions(), paramNames[j], required[paramNames[j]], true);
		}

		var acceptButton = $('#edit-buttons .accept');
		var acceptEdit = function()
		{
			proveit.changeRefFromEditPane(ref, $("#edit-pane").get());
			proveit.saveRefFromEdit(ref);
			$("#edit-pane").hide();
			$("#view-pane").show();
		};

		// Without setTimeout, scoll reset doesn't work in Firefox.
		setTimeout(function()
		{
		    // Reset scroll
		    $('#edit-fields').scrollTop(0);
		}, 0);

		acceptButton.unbind('click.proveit').bind('click.proveit', acceptEdit);
	},

	/**
	 * Add a row to an editPane or addPane.
	 * @param {Node} root root element for pane
	 * @param {Object} params the param object from the reference, or null for added rows.
	 * @param {Object} descs description object to use, or null for no description
	 * @param {String} item the current param name
	 * @param {Boolean} req true if current param name is required, otherwise not required.
	 * @param {Boolean} fieldType true for label, false for textbox.
	 */
	addPaneRow: function(root, params, descs, item, req, fieldType)
	{
		var id = fieldType ? "preloadedparamrow" : "addedparamrow";
		var newline = $('#'+id).clone(); // clone the hidden row
		$(newline).attr('id',''); // clear the ID (can't have two elements with same ID)
		//this.activateRemoveField(newline);
		var paramName = $('.paramdesc', newline).eq(0);
		var paramValue = $('.paramvalue', newline).eq(0);


		$('.paramlist', root).append(newline);

		if(req) // if field is required...
		{
			$(paramName).addClass('required'); // visual indicator that label is required
			$('.delete-field', newline).remove(); // don't let people remove required fields
		}
		else
		{
			this.activateRemoveField(newline);
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
			$(paramValue).val(params[item]);

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

	/**
	 * true signifies cite-style references, citation-style otherwise.  Used when creating a reference.
	 * @type Boolean
	 */
	togglestyle: true,

	// TODO: This should be eliminated if only name only inserts are allowed.
	/** true signifies full references, name-only otherwise.  Used when inserting.
	 * Note that new references are always inserted in full.
	 *
	 * @type Boolean
	 */
	toggleinsert: false,

	/* Cross-Browser Split 1.0.1
	 (c) Steven Levithan <stevenlevithan.com>; MIT License
	 http://blog.stevenlevithan.com/archives/cross-browser-split
	 An ECMA-compliant, uniform cross-browser split method
	 */
	/**
	 * Cross-browser implementation of ECMAScript String.prototype.split function.
	 *
	 * @param {String} str input string to split
	 * @param separator separator to split on, as RegExp or String
	 * @param {Number} limit limit on number of splits.  If the parameter is absent, no limit is imposed.
	 * @return {Array} array resulting from split
	 */
	split: function (str, separator, limit)
	{
		// if `separator` is not a regex, use the native `split`
		if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
			return proveit.split._nativeSplit.call(str, separator, limit);
		}

		var output = [],
		lastLastIndex = 0,
		flags = (separator.ignoreCase ? "i" : "") +
			(separator.multiline  ? "m" : "") +
			(separator.sticky     ? "y" : ""),
			separator = RegExp(separator.source, flags + "g"), // make `global` and avoid `lastIndex` issues by working with a copy
		separator2, match, lastIndex, lastLength;

		str = str + ""; // type conversion
		if (!proveit.split._compliantExecNpcg) {
			separator2 = RegExp("^" + separator.source + "$(?!\\s)", flags); // doesn't need /g or /y, but they don't hurt
		}

		/* behavior for `limit`: if it's...
		 - `undefined`: no limit.
		 - `NaN` or zero: return an empty array.
		 - a positive number: use `Math.floor(limit)`.
		 - a negative number: no limit.
		 - other: type-convert, then use the above rules. */
		if (limit === undefined || +limit < 0) {
			limit = Infinity;
		} else {
			limit = Math.floor(+limit);
			if (!limit) {
				return [];
			}
		}

		while (match = separator.exec(str)) {
			lastIndex = match.index + match[0].length; // `separator.lastIndex` is not reliable cross-browser

			if (lastIndex > lastLastIndex) {
				output.push(str.slice(lastLastIndex, match.index));

				// fix browsers whose `exec` methods don't consistently return `undefined` for nonparticipating capturing groups
				if (!proveit.split._compliantExecNpcg && match.length > 1) {
					match[0].replace(separator2, function () {
								 for (var i = 1; i < arguments.length - 2; i++) {
									 if (arguments[i] === undefined) {
										 match[i] = undefined;
									 }
								 }
							 });
				}

				if (match.length > 1 && match.index < str.length) {
					Array.prototype.push.apply(output, match.slice(1));
				}

				lastLength = match[0].length;
				lastLastIndex = lastIndex;

				if (output.length >= limit) {
					break;
				}
			}

			if (separator.lastIndex === match.index) {
				separator.lastIndex++; // avoid an infinite loop
			}
		}

		if (lastLastIndex === str.length) {
			if (lastLength || !separator.test("")) {
				output.push("");
			}
		} else {
			output.push(str.slice(lastLastIndex));
		}

		return output.length > limit ? output.slice(0, limit) : output;
	},

	// TODO: Remove the split code, and just use a regular regex (with two main groups for name and val), iteratively. Regex.find?  Make name and val indices match, and rework calling code as needed.  Also, check how this was done in the original code.
	/**
	 * Overly clever regex to parse template string (e.g. |last=Smith|first=John|title=My Life Story) into name and value pairs.
	 *
	 * names is an array of all names, and values is an array of all values.  They have equal lengths.
	 *
	 * @param {String} workingString template string to parse.
	 * @return {Object} object with two properties, names and values.
	 */
	splitNameVals: function (workingString)
	{
		var split = {};
		// The first component is "ordinary" text (no pipes), while the second is a correctly balanced wikilink, with optional pipe.  Any combination of the two can appear.
		split.names = proveit.split(workingString.substring(workingString.indexOf("|") + 1), /=(?:[^|]*?(?:\[\[[^|\]]*(?:\|(?:[^|\]]*))?\]\])?)+(?:\||\}\})/);
		split.names.length--; // Remove single empty element at end

		split.values = proveit.split(workingString.substring(workingString.indexOf("=") + 1, workingString.indexOf("}}")), /\|[^|=]*=/);
		return split;
	},

	/**
	 * Scan for references in the MWEditBox, and create a reference object and refBoxRow for each.
	 */
	scanForRefs: function()
	{
		// these are strings used to allow the correct parsing of the ref
		var workingstring;
		var cutupstring;

		this.clearRefBox();

		var textValue = this.getMWEditValue();
		// since we should pick the name out before we get to the reference type, here's a variable to hold it
		var name;

		// key - name
		// value -
		//      object - key - "reference", value - reference obj .  Avoids repeating same object in references array.
                //               key - "strings", value - array of orig strings
		var citations = {};

		// Array of reference objects.  At end of function, addNewElement called on each.
		var references = [];
		 // allRefs should count opening refs, but not ref citation (not <ref name="..."" />)
		var allRefs = textValue.match(/<[\s]*ref[^\/>]*>/gi);
		// currentScan holds the parsed (match objects) list of references.  Regex matches full or name-only reference.
		var currentScan = textValue.match(/<[\s]*ref[^>]*>(?:[^<]*<[\s]*\/[\s]*ref[\s]*>)?/gi); // [^<]* doesn't handle embedded HTML tags (or comments) correctly.
		// if there are results,
		if (currentScan)
		{
			for (var i = 0; i < currentScan.length; i++)
			{
				var reference = this.makeRef(currentScan[i]);
				if(reference) // Full reference object
				{
					name = reference.name;
					if(!name) // with no name, no possibility of repeat name.
					{
						references.push(reference);
					}
				}
				else // Not full reference.  Possibly citation.
				{
					var match = currentScan[i].match(this.REF_REGEX);
					name = match && (match[1] || match[2] || match[3]);
				}

				if(name)
				{
					if(!citations[name])
					{
						// Create array of original reference strings
						citations[name] = {};
						if(!citations[name].strings)
						{
							citations[name].strings = [];
						}
					}
					if(reference && !citations[name].reference) // reference, and not already one for this name
					{
						citations[name].reference = reference;
						references.push(reference);
					}

					// Add to array
					citations[name].strings.push(currentScan[i]);
				}
			}
		}
		for(var j = 0; j < references.length; j++)
		{
			if(references[j].name)
			{
				var citation = citations[references[j].name];
				references[j].setCitationStrings(citation.strings);
			}
			this.addNewElement(references[j]);
		}
	},

	/**
	 * Regex for parsing any reference text.
	 * @type RegExp
	*/
	REF_REGEX: /<[\s]*ref[\s]*name[\s]*=[\s]*(?:(?:\"(.*?)\")|(?:\'(.*?)\')|(?:(.*?)))[\s]*\/?[\s]*>/,

	/**
	 * Factory function for references.  Takes text of a reference, and returns instance of the appropriate class.
	 * @param {String} refText reference string
	 * @return {AbstractReference} null if refText isn't a ref, otherwise the reference object
	 */
	makeRef: function(refText)
	{
		var isReference = /<[\s]*ref[^>]*>[^<]*\S[^<]*<[\s]*\/[\s]*ref[\s]*>/.test(refText); // Tests for reference (non-citation);
		if(!isReference)
		{
			return null;
		}
		var citeFunction = refText.match(/{{[\s]*cite/i) ? this.CiteReference : refText.match(/{{[\s]*Citation/i) ? this.CitationReference : this.RawReference;

		if(citeFunction != this.RawReference)
		{
			var workingstring = refText.match(/{{[\s]*(cite|Citation)[\s\S]*?}}/i)[0];
			var match = refText.match(this.REF_REGEX);

			if(match && match != null)
			{
				var name = match[1] || match[2] || match[3]; // 3 possibilities, corresponding to above regex, are <ref name="foo">, <ref name='bar'>, and <ref name=baz>
			}

			var cutupstring = workingstring.split(/\|/g);

			// This little hack relies on the fact that 'e' appears first as the last letter of 'cite', and the type is next.
			if(citeFunction == this.CiteReference)
			{
				var typestart = cutupstring[0].toLowerCase().indexOf('e');
				// First end curly brace
				var rightcurly = cutupstring[0].indexOf('}');
				// Usually, rightcurly will be -1.  But this takes into account empty references like <ref>{{cite web}}</ref>
				var typeend = rightcurly != -1 ? rightcurly : cutupstring[0].length;
				// grab the type, then trim it.
				var type = $.trim(cutupstring[0].substring(typestart + 1, typeend));
			}
		}
		// type may be undefined, but that's okay.
		var citation = new citeFunction({"name": name, "type": type, "save": true, "inMWEditBox": true, "orig": refText});

		if(citeFunction != this.RawReference)
		{
			var split = this.splitNameVals(workingstring);
			var names = split.names;
			var values = split.values;

			for (var j = 0; j < names.length; j++)
			{
				/* Drop blank space, and |'s without params, which are never correct for
				 citation templates.*/
				var paramName = $.trim(names[j]).replace(/(?:\s*\|)*(.*)/, "$1");
				var paramVal = $.trim(values[j]);
						       // Should there be a setParam function?  It could handle empty values, and even drop (siliently or otherwise) invalid parameters.  Alternatively, should params be passed in the constructor?
				if (paramVal != "")
				{
					citation.params[paramName] = paramVal;
				}
			}
		}
		return citation;
	},

	/**
	 * Root reference type. Parent of RawReference, CiteReference, and CitationReference.
	 * @class AbstractReference
	 * @for	proveit
	 * @constructor
	 * @param {Object} argObj argument object with keys for each option
	*/
	AbstractReference: function(argObj)
	{
		// CiteReference has a non-trivial override of this.  This is defined early (and conditionally) because it is used in the constructor.
		if(!this.setType)
		{
			/**
			 * @param {String} type type of reference
			 */
			this.setType = function(type)
			{
				this.type = type;
			};
		}

		/**
		 * Update citation strings after changing reference.  This runs after modifying a reference's fields (name, params), but before changing orig
		 */
		this.update = function()
		{
			var newCiteText = this.toString();
			var strings = this.getCitationStrings();

			/*
			 * Update main citation in strings list.
			 *
			 * TODO:
			 * Use strings array here to find and update citations that are not main references.  As is, they are orphaned.
			 * Both array and textbox should be updated.
			 * It may be enough to just set all non-main citations in text and array to this.getInsertionText(false).
			 * However, if they remove the name entirely (not recommended), that would be a problem.
			 */
			if(strings.length > 0) // This implies there was a name before
			{
				for(var i = 0; i < strings.length; i++)
				{
					// If we find the full citation as a citation, update to the new text.
					if(strings[i] == this.orig)
					{
						// this.orig itself is updated in updateInText
						strings[i] = newCiteText;
					}
				}
			}
			else if(this.name != null) // They have added a name, so we should have a main citation.
			{
				// Now that it has a name, it is a citation to itself.
				strings.push(newCiteText);
			}
		};
		/**
		 * &lt;ref name /&gt; for reference
		 * @type String
		 */
		 this.name = argObj.name != "" ? argObj.name : null; // Save blank names as null

		/*
		  type of reference, e.g. cite web, cite news.  Also used (including for CitationReference objects) to determine default fields.
		 */
		this.setType(argObj.type);

 		 //TODO: Re-examine whether both (or indeed either) of save or inMWEditBox are really necessary.  Can it be determined from context?

 		/**
		 * flag to determine whether citation must be saved.  false indicates "dirty" citation that has yet to be updated in text and metadata.
		 * @type Boolean
		*/
		this.save = argObj.save;

		/**
		 * true if and only if the ref is in the MW edit box with the same value as this object's orig.
		 * @type Boolean
 		 */
		this.inMWEditBox = argObj.inMWEditBox;

		/**
		 * original wikitext for reference
		 * @type String
		 */
		this.orig = argObj.orig;

		/**
		 * mapping of parameter names to values
		 * @type Object
		 */
		this.params = {};

		/**
		 * Convenience method.  Returns sorter for parameters.
		 * @return {Function} sorter for parameters
		*/
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
					proveit.log('Parameter missing from getSortIndex, which causes the sort to be invalid. paramA: ', paramA, ', aInd: ', aInd, ', paramB: ', paramB, ', bInd: ', bInd);
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

		/**
		 * Returns true if this reference is valid, false otherwise.
		 * Assume all AbstractReference objects are valid.  Can be overridden in subtypes.
		 * @return {Boolean} AbstractReference.isValid always returns true
		*/
		this.isValid = function(){return true;};

		/**
		 * Generates label for reference using title, author, etc.
		 * @return {String} the label that was generated
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
		 * Gets insertion text (for edit box).
		 *
		 * TODO: Generate a regex object instead (getInsertionRegExp), so highlighting would not fail due to trivial changes (e.g. spacing).
		 * @param {Boolean} full If true, insert full text, otherwise ref name only
		 * @return {String} insertion text
		 */
		this.getInsertionText = function(full)
		{
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

		/**
		 * Updates this reference in the edit box.
		 */
		this.updateInText = function()
		{
			var txtarea = proveit.getMWEditBox();

			if (!txtarea || txtarea == null)
				return;

			txtarea.focus();
			var text = proveit.getMWEditValue();

			text = text.replace(this.orig, this.toString());

			// Do replacement in textarea.
			txtarea.value = text;

			// Baseline for future modifications

			this.orig = this.toString();
			this.save = true;

			proveit.highlightTargetString(this.toString());
		};

		/**
		 * Internal helper method for toString.
		 * @param {String} template template for ref (currently "cite" or "Citation"
		 * @param {Boolean} includeType true to include this.type, false otherwise
		 * @return {String} string for current reference
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

		/**
		 * Array of citation strings for this reference.
		 * @type Array
		*/
		this.citationStrings = [];

		/**
		 * Sets citationStrings to an array
		 * @param {Array} strings array of citation strings, not null
		 */
		this.setCitationStrings = function(strings)
		{
			this.citationStrings = strings;
		};

		/**
		 * Gets array of citationStrings.
		 * @return {Array} (possibly empty) array of citation strings.  Will not return null.
		 */
		this.getCitationStrings = function()
		{
			return this.citationStrings;
		};

		/**
		 * Get icon URL for reference
		 * @return {String} icon URL
		 */
		this.getIcon = function()
		{
			return proveit.STATIC_BASE + "page_white.png";
		};
	},

	/**
	 * Constructor for CiteReference type.
	 * @class CiteReference
	 * @for proveit
	 * @constructor
	 * @extends AbstractReference
	 * @param {Object} argObj the argument object, with keys for each option
	*/
	CiteReference: function(argObj)
	{
		/* Mostly an identity mapping, except for redirects.  I think
		 * having the self-mappings is better than some kind of special case array.
		 */
		var typeNameMappings =
		{
			web: "web",
			book: "book",
			journal: "journal",
			conference: "conference",
			encyclopedia: "encyclopedia",
			news: "news",
			newsgroup: "newsgroup",
			paper: "journal",
			"press release": "press release",
		        "pressrelease": "press release",
			interview: "interview",
		        episode: "episode",
			"AV media": "AV media",
			DVD: "AV media",
			audio: "AV media",
			"av media": "AV media",
			cd: "AV media",
			dvd: "AV media",
			media: "AV media",
			movie: "AV media",
			"music video": "AV media",
			video: "AV media",
			visual: "AV media"
		};

		// Sets the type (e.g. web for cite web), applying the mappings.  This is up top because it is used in AbstractReference constructor.
		this.setType = function(rawType)
		{
			var mappedType = typeNameMappings[rawType];
			if(mappedType != null)
				this.type = mappedType;
			else
				this.type = rawType; // Use naive type as fallback.
		};

		proveit.AbstractReference.call(this, argObj);

		// TODO: Should CiteReference.getSortIndex and CitationReference.getSortIndex be merged into AbstractCitation?  Less fine-grained, but simpler to maintain.
		/**
		 * Returns the sort index for a given parameter
		 * @param {String} param parameter name
		 * @return {Number} sort index if found, otherwise -1
		 */
		this.getSortIndex = function(param)
		{
			// This is the order fields will be displayed or outputted.

			return $.inArray(param, [
				"url",
				"title",
				"trans_title",
				"encyclopedia",
				"publisher",
				"work",
				"date",
				"agency",
				"accessdate",
				"author",
				"last",
				"first",
				"subject",
				"subjectlink",
				"inventor",
				"editor",
				"author2",
				"last2",
				"first2",
				"subject2",
				"subjectlink2",
				"author3",
				"last3",
				"first3",
				"subject3",
				"subjectlink3",
				"author4",
				"last4",
				"first4",
				"subject4",
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
				"interviewer",
				"cointerviewers",
				"type",
				"newsgroup",
				"journal",
				"booktitle",
				"program",
				"episodelink",
				"series",
				"serieslink",
				"credits",
				"network",
				"station",
				"callsign",
				"city",
				"airdate",
				"began",
				"ended",
				"season",
				"seriesno",
				"number",
				"minutes",
				"transcript",
				"transcripturl",
				"people",
				"year",
				"month",
				"article",
				"contribution",
				"format",
				"medium",
				"newspaper",
				"conference",
				"volume",
				"edition",
				"issue",
				"location",
				"pages",
				"page",
				"language",
				"isbn",
				"issn",
				"oclc",
				"doi",
				"pmid",
				"id",
				"archiveurl",
				"archivedate",
				"deadurl",
				"time",
				"quote",
				"ref"
			]);
		};

		/**
		 * Returns this reference as a string.
		 * @return {String} reference as string
		 */
		this.toString = function()
		{
			return this.toStringInternal("cite", true);
		};

		// References without these parameters will be flagged in red.
		// True indicates required (null, or undefined, means not required)
		var requiredParams =
		{
			web: { "url": true, "title": true},
			book: { "title": true },
			journal: { "title": true },
			conference: { "title": true },
			encyclopedia: { "title": true, "encyclopedia": true },
			news: { "title": true, "work": true, "date": true },
			newsgroup: { "title": true },
			"press release"	: { "title": true },
			interview: { "last": true }, // TODO: Interview requires last *or* subject.  Currently, we can't represent that.
			episode: { "title": true },
			"AV media": { "title": true }
		};

		/**
		 * Return required parameters for this citation type.
		 * @return {Object} object with required parameters as keys and true as value; empty object for unknown type
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
		        web: [ "url", "title", "author", "accessdate", "work", "publisher", "date", "pages"],
		        book: [ "title", "author", "authorlink", "year", "isbn", "publisher", "location", "pages" ],
		        journal: [ "title", "author", "journal", "volume", "issue", "year", "month", "pages", "url", "doi" ],
		        conference: [ "conference", "title", "booktitle", "author", "editor", "year", "month", "url", "id", "accessdate", "location", "pages", "publisher" ],
			encyclopedia: [ "title", "encyclopedia", "author", "editor", "accessdate", "edition", "year",
			"publisher", "volume", "location", "pages" ],
		        news: [ "title", "author", "url", "work", "date", "accessdate", "pages", "location", "agency" ],
			newsgroup: [ "title", "author", "date", "newsgroup", "id", "url", "accessdate" ],
		        "press release"	: [ "title", "url", "publisher", "date", "accessdate" ],
			interview: ["last", "first", "subjectlink", "interviewer", "title", "callsign", "city", "date", "program", "accessdate"],
		        episode: ["title", "series", "credits", "airdate", "city", "network", "season"],
			"AV media": ["people", "date", "url", "title", "medium", "location", "publisher"]
		};

		/**
		 * Returns default parameters (to be suggested when editing) for current reference
		 * @return {Array} array of default parameter names; empty array if unknown
		*/
		this.getDefaultParams = function()
		{
			var curDefault = defaultParams[this.type];
			if(curDefault)
				return curDefault;
			else
				return []; // Return empty array rather than null to avoid dereferencing null.
		};

		this.isValid = function()
		{
		        if(this.type == '')
			{
			    return false;
			}
			var req = this.getRequiredParams();
			var i = 0;
			var allFound = true;
			for(var reqParam in req)
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

		var iconMapping =
		{
			web: "page_white_world.png",
			book: "book.png",
			journal: "page_white_text.png",
			news: "newspaper.png",
			newsgroup: "comments.png",
			"press release": "transmit_blue.png",
			interview: "telephone.png",
			episode: "television.png",
			video: "film.png"
		};

		var superGetIcon = this.getIcon;
		this.getIcon = function()
		{
			var icon = iconMapping[this.type];
			if(icon)
			{
				return proveit.STATIC_BASE + icon;
			}
			return superGetIcon.call(this);
		};
	},

	/**
	 * A function for citation style refs.
	 * @class CitationReference
	 * @for proveit
	 * @constructor
	 * @extends AbstractReference
	 * @param {Object} argObj argument object with keys for each option
	 */

	CitationReference: function(argObj) {
		proveit.AbstractReference.call(this, argObj);

		// None currently required;
		var requiredParams = {};

		// These paramaters will be auto-suggested when editing.
		var defaultParams =
		{
			web: [ "url", "author", "title", "date", "accessdate"],
			news: [ "author", "title", "newspaper", "url", "publication-place", "volume", "issue", "date", "pages"],
			encyclopedia: ["author", "editor", "contribution", "title", "publisher", "place", "year", "volume", "pages"],
			book: ["author", "title", "publisher", "place", "year"],
			journal: ["author", "title", "journal", "volume", "issue", "year", "pages"],
			patent: ["inventor", "title", "issue-date", "patent-number", "country-code"]
		};

		/**
		 * Returns the sort index for a given parameter
		 * @param {String} param parameter name
		 * @return {Number} sort index if found, otherwise -1
		 */
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
				"version",
				"pages",
				"page",
				"id",
				"isbn",
				"doi",
				"oclc",
				"accessdate"
			].indexOf(param);
		};

		/**
		 * Returns this reference as a string.
		 * @return {String} reference as string
		 */
		this.toString = function()
		{
			return this.toStringInternal("Citation", false);
		};

		/**
		 * Return required parameters for this citation type.
		 * @return {Object} object with required parameters as keys and true as value; empty object for unknown type
		 */
		this.getRequiredParams = function()
		{
			return requiredParams;
		};

		/**
		 * Returns default parameters (to be suggested when editing) for current reference
		 * @return {Array} array of default parameter names; empty array if unknown
		 */
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
	},

	/**
	 * Constructor for RawReference type.
	 * @class RawReference
	 * @for proveit
	 * @constructor
	 * @extends AbstractReference
	 * @param {Object} argObj the argument object, with keys for each option
	 */
	RawReference: function(argObj)
	{
		proveit.AbstractReference.call(this, argObj);
		this.type = 'raw';

		/**
		 * Returns this reference as a string.
		 * @return {String} reference as string
		 */
		this.toString = function()
		{
			return this.orig;
		};
		this.params['title'] = this.orig;

		this.getIcon = function()
		{
			return proveit.STATIC_BASE + 'raw.png';
		};
	},

	// TODO: This should be unified with changeRefFromEditPane
	/**
	 * Convert the current contents of the add citation panel to a reference (i.e CiteReference(), CitationReference())
	 * @for proveit
	 * @param {Node} box typepane root of add GUI (pane for specific type, e.g. journal)
         * @return {AbstractReference} ref or null if no panel exists yet.
	 */
	getRefFromAddPane: function(box)
	{
		// get this working, lots of typing here.

		var type = box.id;

		// get <ref> name
		var refName = $('#addrefname').val();

		var citeFunc = this.togglestyle ? this.CiteReference : this.CitationReference;
		var ref = new citeFunc({"name": refName, "type": type});

		var paramName, paramVal;

		var paramList = $(".paramlist", box)[0];
		var paramRows = $('div', paramList);
		for (var i = 0; i < paramRows.length; i++)
		{
			var paramRow =  paramRows[i];
			var valueTextbox = $(".paramvalue", paramRow)[0];

			if($(paramRow).hasClass("addedrow")) // Added with "Add another field"
			{
				paramName = $.trim($(".paramdesc", paramRow)[0].value);
			}
			else
			{
				paramName = valueTextbox.id.substring(this.NEW_PARAM_PREFIX.length);
			}

			paramVal = $.trim(valueTextbox.value);
			if(paramName != "" && paramVal != "")
			{ // Non-blank
				ref.params[paramName] = paramVal;
			}
		}
		ref.update();
		return ref;
	},

	/**
	 * Called from the add citation panel, this is the function used to
	 * add the actual citation.
	 *
	 * @param {AbstractReference} ref reference being added
	 */
	addReference: function(ref) {
		// get this working, lots of typing here.

		this.addNewElement(ref);

		ref.orig = ref.toString();
		/*
		 * Cycle through the boxes and grab the id's versus the values, watch
		 * for the final box and make sure to grab the type as well
		 */

		this.insertRefIntoMWEditBox(ref, true); // true means insert full text here, regardless of global toggle.
		ref.save = true;
		ref.inMWEditBox = true;
	},

	/**
	 * Clear all rows of passed in add citation panes.
	 * @param {Node} citePanes raw DOM element
	 */
	clearCitePanes: function(citePanes)
	{
		if(citePanes.hasChildNodes())
		{
			citePanes.removeChild(citePanes.firstChild);
		}
	},

	/**
	 * Add event handler to Delete Field button in Add/Edit Reference panes
	 * @param {Node} fieldRow the fieldRow DOM element to remove
	 */
	activateRemoveField: function(fieldRow)
	{
		$('.delete-field', fieldRow).click(function()
		{
			$(fieldRow).hide(
				'highlight',{},'slow',
				function() {
					$(fieldRow).remove();
					}
				);
		});
	},

	/**
	 * Changes the panel for the add reference panel to the correct type of entry
	 * @param {Node} menu Raw HTML menu element
	 */
	changeAddPane: function(menu) {
		// Reset scroll
		$('#add-fields').scrollTop(0);
		$(menu.parentNode).show(); // cite/citation vbox.

		var citePanes = $(".addpanes", menu.parentNode.parentNode).get(0);
		this.clearCitePanes(citePanes);
		var newRefType = menu.value;

		var genPane = document.getElementById("dummyCitePane").cloneNode(true);
		genPane.id = newRefType.replace(' ', '_');

		// name the ref-name-row
		$('.ref-name-row',genPane).children('input').attr('id','addrefname');
		$('.ref-name-row',genPane).children('label').attr('for','addrefname');

		// Somewhat hackish.  What's a better way?
		var newRef;
		if(menu.id == "citemenu")
		{
			newRef = new this.CiteReference({});
		}
		else
		{
			newRef = new this.CitationReference({});
		}
		newRef.type = newRefType;
		var descs = this.getDescriptions();
		var defaultParams = newRef.getDefaultParams().slice(0); // copy
		defaultParams.sort(newRef.getSorter());
		//var required = newRef.getRequiredParams();

		// Possibly, Cite objects should automatically include default parameters in their param maps.  That would seem to make this simpler.
		for(var i = 0; i < defaultParams.length; i++)
                {
			newRef.params[defaultParams[i]] = "";
		}

		// Should there be a getParamKeys or similar function for this, or even getSortedParamKeys?
		var newParams = [];
		for(param in newRef.params)
		{
			newParams.push(param);
		}
		newParams.sort(newRef.getSorter());
		var required = newRef.getRequiredParams();

		var paramList = $(".paramlist", genPane)[0];
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
					$('.delete-field', paramBox).remove(); // don't let people remove required fields
				}
				else
				{
					this.activateRemoveField(paramBox);
				}
				label.text(descs[param]);
				// Basically the same code as nameHbox above
				label.attr("for", this.NEW_PARAM_PREFIX + param);
				if(param == 'accessdate')
					$('.paramvalue', paramBox).val(this.formatDate(new Date));
			}
			else
			{
				// Throwing an error here doesn't make sense if user-added fields can be copied over.
				// throw new Error("Undefined description for param: " + param);
				paramBox = document.getElementById("addedparamrow").cloneNode(true);
				var nameTextbox = $(".paramdesc", paramBox)[0];
				nameTextbox.setAttribute("value", param);
			}
			paramBox.id = "";
			this.activateRemoveField(paramBox);

			$(".paramvalue", paramBox)[0].id = this.NEW_PARAM_PREFIX + param;
			//paramBox.childNodes[2].value = newRef.params[param]; // Causes parameters to disappear.  Why?
			$(paramBox).show();
			paramList.appendChild(paramBox);
		}
		$(genPane).show();
		citePanes.insertBefore(genPane, citePanes.firstChild);
	},

	/**
	 * Create ProveIt HTML GUI
	 */
	createGUI: function()
	{
		if(this.getGUI().length > 0)
		{
			// GUI already created
			return false;
		}

		importStylesheetURI(this.STATIC_BASE + 'styles.css');

		// more JqueryUI CSS: http://blog.jqueryui.com/2009/06/jquery-ui-172/
		var gui = $('<div/>', {id: this.GUI_ID});
		var tabs = $('<div/>', {id: 'tabs'});
		var created = $('<h1/>');
		var createdLink = $('<a/>', {title: 'Created by the ELC Lab at Georgia Tech',
			                     href: 'http://proveit.cc.gatech.edu',
					     target: '_blank'});
		// Main logo in upper-right
		var logo = $('<img/>', {src: this.STATIC_BASE + 'logo.png', alt: 'ProveIt', height: 30, width: 118 });
		createdLink.append(logo);
		created.append(createdLink);
		// Minimize/maximize button
		var showHideButton = $('<button/>', {text: 'show/hide'});
		created.append(showHideButton);
		tabs.append(created);
		var header = $('<ul/>');
		var view = $('<li/>');
		// View tab link
		var viewLink = $('<a/>', {id: 'view-link', "class": 'tab-link', href: '#view-tab'});
		viewLink.append('References (');
		var numRefs = $('<span/>', {id: 'numRefs'}).
			append('0');
		viewLink.append(numRefs).
			append(')');
		view.append(viewLink);
		header.append(view);
		var add = $('<li/>');
		// Add tab link
		var addLink = $('<a/>', {id: 'add-link', "class": 'tab-link', href: '#add-tab'}).
			append('Add a Reference');
		add.append(addLink);
		header.append(add);
		tabs.append(header);
		// View tab
		var viewTab = $('<div/>', {id: 'view-tab', css: {display: 'none'}});
		// View pane used for displaying references; within view tab
		var viewPane = $('<div/>', {id: 'view-pane'});
		var viewScroll = $('<div/>', {"class": 'scroll',
					      style: 'height: 210px;'});
		// Ref list root element
		var refTable = $('<table/>', {id: 'refs'});
		var dummyRef = $('<tr/>', {id: 'dummyRef',
					   style: 'display: none;'});
		dummyRef.append($('<td/>', {"class": 'number'})).
			append($('<td/>', {"class": 'type'})).
			append($('<td/>', {"class": 'title'}));
			//append($('<td/>', {"class": 'details'}));
		var editTd = $('<td/>', {"class": 'edit'}).
			append($('<button/>', {text: 'edit'}));
		dummyRef.append(editTd);
		refTable.append(dummyRef);
		viewScroll.append(refTable);
		viewPane.append(viewScroll);
		viewTab.append(viewPane);
		// div#edit-pane, within view tab
		var editPane = $('<div/>', {id: 'edit-pane', style: 'display: none'});
		// div#edit-fields
		var editFields = $('<div/>', {id: 'edit-fields',
					      "class": 'inputs scroll',
					      style: 'height: 170px',
					      tabindex: -1});
		// div.ref-name-row
		var refNameRow = $('<div/>', {"class": 'ref-name-row',
					      tabindex: -1});
		var refLabel = $('<label/>', {'for': 'editrefname',
					      title: 'This is a unique identifier that can be used to refer to this reference elsewhere on the page.',
					      "class": 'paramdesc'}).
			append('&lt;ref&gt; name');
		refNameRow.append(refLabel);
		refNameRow.append($('<input/>', {id: 'editrefname',
						 "class": 'paramvalue',
						 tabindex: 0}));
		// div.paramlist
		var paramList = $('<div/>', {"class": 'paramlist'});

		editFields.append(refNameRow);
		editFields.append(paramList);
		editPane.append(editFields);

		// div#edit-buttons, part of edit pane
		var editButtons = $('<div/>', {id: 'edit-buttons'});
		var addFieldButton = $('<button/>', {style: 'margin-right: 50px;'}).
			append('add field');
		editButtons.append(addFieldButton);
		var reqSpan = $('<span/>', {"class": 'required',
					    text: 'bold'});
		editButtons.append(reqSpan).
			append(' = required field');
		var saveButton = $('<button/>', {"class": 'right-side accept',
		                                 text: 'update edit form'});
		editButtons.append(saveButton);
		var cancelButton = $('<button/>', {"class": 'right-side cancel',
			                           text: 'cancel'});
		editButtons.append(cancelButton);
		editPane.append(editButtons);
		viewTab.append(editPane);
		tabs.append(viewTab);

		// dumy cite pane
		var dummyCite = $('<div/>', {id: 'dummyCitePane',
					     "class": 'typepane',
					     style: 'display: none'});
		var addRefNameRow = refNameRow.clone();
		//$('input', addRefNameRow).attr('id', 'addrefname');
		//$('label', addRefNameRow).attr('for', 'addrefname');
		dummyCite.append(addRefNameRow);
		dummyCite.append($('<div/>', {"class": 'paramlist'}));
		tabs.append(dummyCite);

		var preloadedparam = $('<div/>', {id: 'preloadedparamrow',
						  "class": 'preloadedrow input-row',
						  style: 'display: none'}).
			append($('<label/>', {"class": 'paramdesc'}));
		var paramvalue = $('<input/>', {"class": 'paramvalue',
				                tabindex: 0});
	        preloadedparam.append(paramvalue);
		var deleteButton = $('<button/>', {"class": 'delete-field',
						   tabindex: -1}).
			append('delete field');
		preloadedparam.append(deleteButton);
		tabs.append(preloadedparam);
		var addedparam = $('<div/>', {id: 'addedparamrow',
					      "class": 'addedrow input-row',
 					      style: 'display: none'}).
		        append($('<input/>', {"class": 'paramdesc',
					      tabindex: 0})).
			append(paramvalue.clone()).
			append(deleteButton.clone());
		tabs.append(addedparam);
		// Add tab
		var addTab = $('<div/>', {id: 'add-tab', css: {display: 'none'}});
		var addFields = $('<div/>', {id: 'add-fields',
					     "class": 'inputs scroll',
					     style: 'height: 170px',
					     tabindex: -1});
		var cite = $('<div/>', {style: 'display: none',
					id: 'cite',
				        "class": 'input-row'});
		var refCiteTypeLabel = $('<label/>', {'for': 'citemenu',
						  "class": 'paramdesc required',
						  text: 'Reference type'});
		cite.append(refCiteTypeLabel);
		var citemenu = $('<select/>', {id: 'citemenu',
					       change: function()
					       {
						       proveit.changeAddPane(citemenu.get(0));
					       }});
         	var citeTypes = this.CiteReference.getTypes();
		var descs = this.getDescriptions();
		for(var i = 0; i < citeTypes.length; i++)
		{
			citemenu.append($('<option/>', {value: citeTypes[i],
						        text: descs[citeTypes[i]]}));
		}
		cite.append(citemenu);
		addFields.append(cite);
		addFields.append($('<div/>', {"class": 'addpanes',
					      id: 'citepanes',
					      tabindex: -1}));
		var citation = $('<div/>', {style: 'display: none',
					    id: 'citation',
					    "class": 'input-row'});
		var refCitationTypeLabel = refCiteTypeLabel.clone().attr('for', 'citationmenu');
		citation.append(refCitationTypeLabel);
		var citationmenu = $('<select/>', {id: 'citemenu',
		                                   change: function()
						   {
							   proveit.changeAddPane(citationmenu.get(0));
						   }});
		var citationTypes = ['web', 'book', 'journal', 'encyclopedia', 'news', 'patent'];
		for(var j = 0; j < citationTypes.length; j++)
		{
			citationmenu.append($('<option/>', {value: citationTypes[i],
			                                    text: descs[citationTypes[i]]}));
		}
		citation.append(citationmenu);
		addFields.append(citation).
			append($('<div/>', {"class": 'addpanes',
					    id: 'citationpanes', style: 'display: none;'}));
		addTab.append(addFields);
		// Add buttons, part of add tab
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
						    proveit.changeAddPane(document.getElementById(proveit.togglestyle ? 'citemenu' : 'citationmenu'));
						break;

				      //	case 1: // edit
						// proveit.updateEditPane();
						//	$('tr.selected').dblclick();
						//break;

						default:
						// nothing
					}
				}
		});

		// handle clicking on tabs
		$(viewLink).click(function(){
				if($(viewTab).is(":hidden"))
					proveit.toggleViewAddVisibility();
				else
					cancelEdit();	// Edit and view are the same tab, so we handle this specially.
			});
		$(addLink).click(function(){
				if($(addTab).is(":hidden"))
					proveit.toggleViewAddVisibility();
			});

		// add panel buttons
		$("#add-buttons button:first").button({
			icons: {
				primary: 'ui-icon-circle-plus'
			}
		}).click(function()
			 {
				 proveit.addPaneRow(document.getElementById("add-tab"));
			 })
		.next().next().button({
			icons: {
				primary: 'ui-icon-circle-check',
				secondary: 'ui-icon-circle-arrow-e'
			}
		}).click(function()
			 {
				 proveit.addReference(proveit.getRefFromAddPane($('#add-tab .typepane').get(0)));
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
				 proveit.addPaneRow($("#edit-pane"));
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
		$(".delete-field").button({
			icons: {
				primary: 'ui-icon-close'
			},
			text: false
		});

		// create the minimize button
		showHideButton.button({
			icons: {
				primary: 'ui-icon-triangle-1-n'
			},
			text: false
		});

		var viewAndAdd = $("#view-tab, #add-tab");
		this.viewAndAddPanes = viewAndAdd;

		function minimize()
		{
			viewAndAdd.hide();
			showHideButton.button("option", "icons", { primary: 'ui-icon-triangle-1-n' } );
		}

		function maximize()
		{
			viewAndAdd.show();
			showHideButton.button("option", "icons", { primary: 'ui-icon-triangle-1-s' } );
		}

		// set up the minimize button
		showHideButton.toggle(
			maximize,
			minimize
		);

		this.toggleViewAddVisibility = function()
		{
			showHideButton.click();
		};

		this.scanForRefs();

		$("#refs tr").eq(0).click().click(); // select first item in list.  TODO: Why two .click?

		// alternate row colors
		$("#refs tr:even").addClass('light');
		$("#refs tr:odd").addClass('dark');
	},

	/**
	 * A reference to the set containing two items, the view and add tabs.  Will be initialized by createGUI, so it is non-null if ProveIt is visible
	 *
	 * @type {$NodeSet}
	 */
	viewAndAddPanes: null,

	/*
	 * Gets jQuery set for ProveIt GUI, which will be empty if ProveIt has not initialized
	 *
	 * @return {$Node} root of ProveIt
	 */
	getGUI: function()
	{
		return $('#' + this.GUI_ID);
	},

	/**
	 * Hides ProveIt completely
	 */
	hide: function()
	{
		this.getGUI().hide();
	},

	/**
	 * Show ProveIt
	 */
	show: function()
	{
		this.createGUI();
		this.getGUI().show();
	},

	/**
	 * Toggle overall visiblility.  If currently hidden, go to minimized.  If minimized, maximize.  If maximize, hide
	 */
	toggleVisibility: function()
	{
		if(this.getGUI().is(':visible'))
		{
			if(this.viewAndAddPanes.is(':visible')) // maximized
			{
				this.hide();
			}

			/*
			 * If previously maximized, we minimize after hiding, so when we show, it will already be minimized.
			 * If minimized, we maximize
			 */
			this.toggleViewAddVisibility();
		}
		else
		{
			this.show();
		}
	},

	/**
	 * Toggle visibility of view and add panes.  Initialized by createGUI
	 *
	 * @method toggleViewAddVisibility
	 */
         toggleViewAddVisibility: null,

	/**
	 * Generates refbox row and all children, to be used by addNewElement, and when updating
	 *
	 * @param {AbstractReference} ref reference to generate from
	 * @param {Boolean} isReplacement if true, this replaces another refbox item, so no number will be assigned, and the count will not be updated.
	 * @return {Node} new refbox row for refbox
	 */
	makeRefBoxRow: function(ref, isReplacement)
	{
		var refName = ref.name; //may be null or blank

		//var refbox = this.getRefBox();

		var newchild = $('<tr><td class="number"></td><td class="type"></td><td class="title"></td><td class="edit"></td></tr>').get(0);
		// removed <span class="pointers"></span>
		// removed <td class="details"></td>

		if(!ref.isValid())
		{
			// Flag as invalid.
			$(newchild).addClass('invalid');
		}
		// grab the nodes that need changed out of it
		var neweditimage = $('.edit button', newchild).get(0);
		var thisproveit = this;

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
		        var yearMatch = ref.params['date'].match(/^([12]\d{3})/);
			if(yearMatch)
			{
				formattedYear = yearMatch[1];
			}
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
		// var details = '';
		// if (formattedYear != '' && formattedAuthor != '')
			// details = '(' + formattedAuthor + ', ' + formattedYear + ')';
		// else if (formattedYear != '')
			// details = '(' + formattedYear + ')';
		// else if (formattedAuthor != '')
			// details = '(' + formattedAuthor + ')';
		// $('td.details', newchild).html(details);

		// generate a URL based on ref type
		var icon = ref.getIcon(), url = '', refType = ref.type;

		switch(refType)
		{
			case 'web':
				url = ref.params['url'];
				break;
			case 'book':
				if(ref.params['isbn'] != null)
					url = wgServer + '/w/index.php?title=Special%3ABookSources&isbn=' + ref.params['isbn'];
				break;
			case 'journal':
			case 'conference':
				if(ref.params['doi'] != null)
					url = 'http://dx.doi.org/' + ref.params['doi'];
				break;
			case 'news':
				url = ref.params['url'];
				break;
			case 'episode':
				url = 'http://www.imdb.com/find?s=ep&q=' + escape(ref.params['title']);
				break;
		}
		$('td.type', newchild).css('background-image','url('+icon+')');
		$('td.type', newchild).attr('title',ref.type);


		var authorByline = '', yearByline = '', refTypeByline = '';
		if(formattedAuthor != '')
			authorByline = 'By: <span class="author">' + formattedAuthor + '</span>';
		if(formattedYear != '')
			yearByline = 'Date: <span class="date">' + formattedYear + '</span>';
		if(refType != null)
		{
			if(url != '')
				refType = '<a href="' + url + '" target="_blank">' + refType + '</a>';
			refTypeByline = 'Type: <span class="type">' + refType + '</span>';
		}

		//alert("authorByline: " + authorByline + "\n yearByline: " + yearByline + "\n refTypeByline: " + refTypeByline);
		var byline = '', separator = ' | ';
		if(refType == 'raw')
		{
			byline = refTypeByline + separator + ref.toString();
		}
		else if(authorByline != '') // a??
		{
			if(yearByline != '') // ad?
			{
				if(refTypeByline != '') // adt
					byline = authorByline + separator + yearByline + separator + refTypeByline;
				else // ad-
					byline = authorByline + separator + yearByline;
			}
			else // a-?
			{
				if(refTypeByline != '') // a-t
					byline = authorByline + separator + refTypeByline;
				else // a--
					byline = authorByline;
			}
		}
		else // -??
		{
			if(yearByline != '') // -d?
			{
				if(refTypeByline != '') // -dt
					byline = yearByline + separator + refTypeByline;
				else // -d-
					byline = yearByline;
			}
			else // --?
			{
				if(refTypeByline != '') // --t
					byline = refTypeByline;
				// no need for ---
			}
		}
		byline = '<p>' + byline + '</p>';
		//alert(byline);


		// create expanded <div>
		var expanded = $('<div />',{
							"class": 'expanded'
						});

		// append the infobar to the expanded info box
		$(expanded).append(byline);

		// append the expanded info box to the title <td>
		$('td.title', newchild).append(expanded);

		if(!isReplacement)
		{
		    // get ref number by counting number of refs (this includes dummy ref, but not the one we're creating)
		    var numRefs = $('#refs tr').length;
		    $('td.number', newchild).text(numRefs);
		    $('#numRefs').text(numRefs); // update the number of refs in the view tab
		}
		// event handler for selecting a ref)
		$(newchild).click(function() {
				thisproveit.highlightTargetString(ref.orig);
				//thisproveit.highlightTargetString(ref.orig);
				$("#refs tr").removeClass('selected');
				$(newchild).addClass('selected');
			});



		var doEdit = function() {
			thisproveit.updateEditPane(ref);

			$("#view-pane").hide();
			$("#edit-pane").show();
		};

		var citationStrings = ref.getCitationStrings();

		//var pointers = $('.pointers', newchild);

		var allCitations = $('<span class="all-citations" />');

		for(var i = 0; i < citationStrings.length; i++)
		{
			var dividend = i + 1;
			var colName = "";

			while(dividend > 0)
			{
				var mod = --dividend % 26;
				colName = String.fromCharCode(97 + mod) + colName;  // a = 97
				dividend = Math.floor(dividend / 26);
			}
			var citationHolder = $('<a href="#">' + colName + '</a>');
			// Bind i
			var clickFunc = (function(i)
			{
				return function()
				{
					var last = 0, j = 0;
					var text = proveit.getMWEditValue();
					for(j = 0; j < i; j++)
					{
						last = text.indexOf(citationStrings[j], last);

						// Shouldn't happen.  Indicates citation strings are out of date.
						if(last == -1)
						{
							proveit.log("citationStrings[" + j + "]: " + citationStrings[j] + " not found.  Returning.");
							return false;
						}
						last += citationStrings[j].length;
					}
					var startInd = text.indexOf(citationStrings[i], last);
					if(startInd == -1)
					{
						proveit.log("citationStrings[" + i + "]: " + citationStrings[i] + " not found.");
					}
					else
					{
						proveit.highlightLengthAtIndex(startInd, citationStrings[i].length);
					}
					return false;
				};
			})(i);

			citationHolder.click(clickFunc);
			allCitations.append(citationHolder);
		}


		if(citationStrings.length > 1)
		{
			var newP = $('<p />');
			newP.append('This reference is cited in the article <span class="num-citations">' + citationStrings.length + ' times</span>: ').append(allCitations);
			expanded.append(newP);
		}

		// edit buttons
		if(ref.type != 'raw')
		{
		// SMALL EDIT BUTTON

			// create button
			var smallEditBtn = $('<button />',{
					text: 'edit'
				});

			// transform button
			$(smallEditBtn).button({
				icons: {
					primary: 'ui-icon-pencil'
				},
				text: false
			});

			// button click event handler
			smallEditBtn.click(doEdit);

			// append button
			$('.edit', newchild).append(smallEditBtn);

		// LARGE EDIT BUTTON

			// create button
			var editBtn = $('<button />',{
					"class": 'edit',
					text: 'edit this reference'
				});

			// transform button
			$(editBtn).button({
				icons: {
					primary: 'ui-icon-pencil'
				},
				text: true
			});

			// button click event handler
			editBtn.click(doEdit);

			// append button
			expanded.append(editBtn);

		// ROW EVENT HANDLER
			$(newchild).dblclick(doEdit);
		}
		else
		{
			// needed to keep all rows the same height
			$('.edit', newchild).append('&nbsp;');
		}

		// ibid button
		if(citationStrings.length > 0)
		{
			// create button
			var ibidBtn = $('<button />',{
					"class": 'insert',
					text: 'insert this reference at cursor'
				});

			// transform button
			$(ibidBtn).button({
				icons: {
					primary: 'ui-icon-arrowthick-1-e'
				},
				text: true
			});

			// button click event handler
			ibidBtn.click(function(){
					thisproveit.insertRefIntoMWEditBox(ref, false);
					return false;
				});

			// append button
			expanded.append(ibidBtn);
		}

		return newchild;
	},

	/**
	 * Truncates title to fit ProveIt refbox row.
	 * @param {String} title title to truncate
	 * @return {String} truncated title
	*/
	truncateTitle: function(title)
	{
		var MAX_LENGTH = 86;
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
	 * Formats date as Monthname DD, YYYY
	 * @param {Date} date1 date to format
	 * @return {String} formatted date as String
	 */
	formatDate: function(date1)
	{
		var year = date1.getFullYear();
		var month = this.getDescriptions().months[date1.getMonth()];
		var day = (date1.getDate() < 10 ? '0' : '') + date1.getDate();
		return month + ' ' + day + ', ' + year;
	},

	/**
	 * Only to be used internally to add the citations to the list
	 *
	 * @param {AbstractReference} ref the reference to add
	 */
	addNewElement: function(ref)
	{
		var refbox = this.getRefBox();
		$(refbox).append(this.makeRefBoxRow(ref, false));
	}
}, window.proveit);

/**
 * Static method.  Returns valid Cite reference types
 * @for CiteReference
 * @static
 * @return {Array} array of cite method types
 */
proveit.CiteReference.getTypes = function()
{
	return ["web", "book", "journal", "conference", "encyclopedia", "news", "newsgroup", "press release", "interview", "episode", "AV media"];
};

proveit.split._compliantExecNpcg = /()??/.exec("")[1] === undefined; // NPCG: nonparticipating capturing group
proveit.split._nativeSplit = String.prototype.split;

proveit.setup();

// Local Variables:
// js2-basic-offset: 8
// End: