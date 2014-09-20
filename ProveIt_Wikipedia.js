/**
 * ProveIt is a powerful GUI tool for viewing, editing and creating references in Wikipedia
 *
 * Copyright 2008-2011 Georgia Tech Research Corporation, Atlanta, GA 30332-0415
 * Copyright 2011-? Matthew Flaschen
 * Rewritten and internationalized by Luis Felipe Schenone in 2014
 *
 * ProveIt is available under the GNU Free Documentation License (http://www.gnu.org/copyleft/fdl.html),
 * the Creative Commons Attribution/Share-Alike License 3.0 (http://creativecommons.org/licenses/by-sa/3.0/),
 * and the GNU General Public License 2 (http://www.gnu.org/licenses/gpl-2.0.html)
 */

var proveit = {

	LOGO: '//proveit-js.googlecode.com/hg/static/logo.png',

	ICON: '//upload.wikimedia.org/wikipedia/commons/thumb/1/19/ProveIt_logo_for_user_boxes.svg/22px-ProveIt_logo_for_user_boxes.svg.png',

	RAW_REFERENCE_ICON: '//upload.wikimedia.org/wikipedia/commons/d/db/Silk-Page_white_code_red.png',

	TEMPLATE_REFERENCE_ICON: '//upload.wikimedia.org/wikipedia/commons/d/dd/Silk-Page_white.png',

	/**
	 * Convenience function that returns the message for the given key.
	 *
	 * @param {string} message key
	 * @return {string} message
	 */
	getMessage: function ( key ) {
		return proveit.messages[ key ];
	},

	/**
	 * Convenience function that returns an object with all the registered templates.
	 *
	 * @return {object}
	 */
	getRegisteredTemplates: function () {
		return proveit.templates;
	},

	/**
	 * Convenience function that returns a jQuery object for the edit textbox.
	 *
	 * @return {object} jQuery object
	 */
	getTextbox: function () {
		return jQuery( '#wpTextbox1' );
	},

	/**
	 * Initializes ProveIt.
	 *
	 * @return {void}
	 */
	init: function () {

		// Initialize only when editing
		if ( wgAction != 'edit' && wgAction != 'submit' ) {
			return;
		}

		var dependencies = [
			'jquery.textSelection',
			'jquery.effects.highlight'
		];
		mw.loader.using( dependencies, function () {

			// Replace the references button for the ProveIt button
			var textbox = proveit.getTextbox();
			textbox.bind( 'wikiEditor-toolbar-buildSection-main', function ( event, section ) {
				delete section.groups.insert.tools.reference;
				section.groups.insert.tools.proveit = {
					label: 'ProveIt',
					type: 'button',
					icon: proveit.ICON,
					action: {
						type: 'callback',
						execute: function () {
							jQuery( '#proveit' ).toggle();
						}
					}
				};
			});

			proveit.makeGUI();
			proveit.scanForReferences();

			// Only initialize visible in the mainspace and user pages
			if ( wgCanonicalNamespace !== '' && wgCanonicalNamespace !== 'User' ) {
				jQuery( '#proveit' ).hide();
			}
		});
	},

	/**
	 * Generates the interface and inserts it into the DOM.
	 *
	 * @return {void}
	 */
	makeGUI: function () {

		// First define the elements
		var gui = jQuery( '<div/>', { 'id': 'proveit' } );

		// Tabs
		var tabs = jQuery( '<div/>', { 'id': 'proveit-tabs' } );
		var editTab = jQuery( '<span/>', { 'id': 'proveit-edit-tab', 'class': 'active', 'text': proveit.getMessage( 'edit-tab' ) } );
		var addTab = jQuery( '<span/>', { 'id': 'proveit-add-tab', 'text': proveit.getMessage( 'add-tab' ) } );
		var logo = jQuery( '<img/>', { 'id': 'proveit-logo', 'src': proveit.LOGO, 'alt': 'ProveIt' } );

		// Content
		var content = jQuery( '<div/>', { 'id': 'proveit-content' } );
		var referenceList = jQuery( '<ul/>', { 'id': 'proveit-reference-list' } );
		var referenceFormContainer = jQuery( '<div/>', { 'id': 'proveit-reference-form-container' } );

		// Buttons
		var buttons = jQuery( '<div/>', { 'id': 'proveit-buttons' } );
		var addCustomParamButton = jQuery( '<button/>', { 'id': 'proveit-add-custom-param-button', 'text': proveit.getMessage( 'add-custom-param-button' ) } );
		var showAllParamsButton = jQuery( '<button/>', { 'id': 'proveit-show-all-params-button', 'text': proveit.getMessage( 'show-all-params-button' ) } );
		var updateButton = jQuery( '<button/>', { 'id': 'proveit-update-button', 'text': proveit.getMessage( 'update-button' ) } );
		var insertButton = jQuery( '<button/>', { 'id': 'proveit-insert-button', 'text': proveit.getMessage( 'insert-button' ) } );

		// Then put everything together and add it to the DOM
		tabs.append( logo ).append( editTab ).append( addTab );
		buttons.append( addCustomParamButton ).append( showAllParamsButton ).append( updateButton ).append( insertButton );
		content.append( referenceList ).append( referenceFormContainer ).append( buttons );
		gui.append( tabs ).append( content );
		jQuery( document.body ).prepend( gui );

		// Lastly, bind events
		logo.click( function () {
			content.toggle();
		});

		editTab.click( function () {
			jQuery( this ).addClass( 'active' ).siblings().removeClass( 'active' );
			content.show();
			referenceList.show();
			referenceFormContainer.hide();
			buttons.hide();
		});

		addTab.click( function () {
			jQuery( this ).addClass( 'active' ).siblings().removeClass( 'active' );
			content.show();
			referenceList.hide();
			buttons.show();
			showAllParamsButton.show();
			updateButton.hide();
			insertButton.show();

			// Create an empty reference and an empty form out of it
			var registeredTemplates = proveit.getRegisteredTemplates();
			var firstTemplate = Object.keys( registeredTemplates )[0]; // The first template defined will be the default one
			var emptyReference = new proveit.TemplateReference({ 'template': firstTemplate });
			var emptyForm = emptyReference.toForm();
			referenceFormContainer.html( emptyForm ).show();
		});

		addCustomParamButton.click( function () {
			var label = jQuery( '<label/>' );
			var nameInput = jQuery( '<input/>', { 'type': 'text', 'class': 'param-name' } );
			var valueInput = jQuery( '<input/>', { 'type': 'text',  'class': 'param-value' } );
			label.append( valueInput ).append( nameInput );
			jQuery( '#proveit-reference-form' ).append( label );
		});

		showAllParamsButton.click( function () {
			jQuery( this ).hide();
			jQuery( '#proveit-reference-form label' ).css({ 'display': 'block' });
		});

		proveit.getTextbox().change( function () {
			proveit.scanForReferences(); // Always keep the reference list up to date
		});
	},

	/**
	 * Scans for references in the textbox, makes a list item for each and fills the reference list with them.
	 *
	 * @return {void}
	 */
	scanForReferences: function () {

		// First empty the previous list
		jQuery( '#proveit-reference-list' ).children().remove();

		// Second, look for all the citations and store them in an array for later
		var	text = proveit.getTextbox().val();
		var citations = [];
		// Three possibilities: <ref name="foo" />, <ref name='foo' /> and <ref name=foo />
		var citationsRegExp = /<\s*ref\s+name\s*=\s*["|']?\s*([^"'\s]+)\s*["|']?\s*\/\s*>/gi;
		var match, citation;
		while ( match = citationsRegExp.exec( text ) ) {
			citation = new proveit.Citation({ 'name': match[1], 'index': match.index, 'string': match[0] });
			citations.push( citation );
		}

		// Third, look for all the raw and template references
		var matches = text.match( /<\s*ref.*?<\s*\/\s*ref\s*>/gi );

		if ( !matches ) {
			var noReferencesMessage = jQuery( '<div/>', { 'id': 'proveit-no-references-message', 'text': proveit.getMessage( 'no-references' ) } );
			jQuery( '#proveit-reference-list' ).append( noReferencesMessage );
			return false;
		}

		var i, j, reference, referenceItem;
		for ( i = 0; i < matches.length; i++ ) {
			// Turn all the matches into reference objects
			reference = proveit.makeReference( matches[ i ] );

			// For each reference, check the citations array for citations to it
			for ( j = 0; j < citations.length; j++ ) {
				citation = citations[ j ];
				if ( reference.name === citation.name ) {
					reference.citations.push( citation );
				}
			}

			// Finally, turn all the references into list items and insert them into the reference list
			referenceItem = reference.toListItem();
			jQuery( '#proveit-reference-list' ).append( referenceItem );
		}
		return true;
	},

	/**
	 * Takes a reference string and returns a reference object.
	 *
	 * @param {string} wikitext that generates the reference
	 * @return {object} reference object
	 */
	makeReference: function ( referenceString ) {

		// First we need to determine what kind of reference is it
		// For this we need to get all the template names and search for a match
		var registeredTemplates = proveit.getRegisteredTemplates();
		var registeredTemplatesArray = [];
		var registeredTemplate;
		for ( registeredTemplate in registeredTemplates ) {
			registeredTemplatesArray.push( registeredTemplate );
		}
		var registeredTemplatesDisjunction = registeredTemplatesArray.join( '|' );
		var regExp = new RegExp( '{{(' + registeredTemplatesDisjunction + ').*}}', 'i' );
		var match = referenceString.match( regExp );

		var reference;
		if ( match ) {
			reference = new this.TemplateReference( { 'string': referenceString } );

			// Extract the name of the template
			var templateString = match[0];
			regExp = new RegExp( registeredTemplatesDisjunction, 'i' );
			var template = templateString.match( regExp )[0];

			// Normalize it
			for ( registeredTemplate in registeredTemplates ) {
				if ( template.toLowerCase() === registeredTemplate.toLowerCase() ) {
					template = registeredTemplate;
				}
			}
			reference.template = template;

			// Next, extract the parameters	
			var paramsString = templateString.substring( templateString.indexOf( '|' ) + 1, templateString.length - 2 ); // From after the first pipe to before the closing "}}"
			var paramsArray = paramsString.split( '|' );
			var paramString, nameAndValue, paramName, paramValue;
			for ( paramString in paramsArray ) {

				nameAndValue = paramsArray[ paramString ].split( '=' );
				paramName = jQuery.trim( nameAndValue[0] );
				paramValue = jQuery.trim( nameAndValue[1] );

				if ( !paramName || !paramValue ) {
					continue;
				}

				reference.params[ paramName ] = paramValue;
			}
		} else {
			reference = new this.RawReference( { 'string': referenceString } );
		}

		// Now set the starting index of the reference
		var text = proveit.getTextbox().val();
		reference.index = text.indexOf( referenceString );

		// Lastly, extract the name of the reference, if any
		// Three possibilities: <ref name="foo" />, <ref name='foo' /> and <ref name=foo />
		regExp = /<[\s]*ref[\s]*name[\s]*=[\s]*(?:(?:\"(.*?)\")|(?:\'(.*?)\')|(?:(.*?)))[\s]*\/?[\s]*>/i;
		match = referenceString.match( regExp );
		if ( match ) {
			reference.name = match[1] || match[2] || match[3];
		}

		return reference;
	},

	/**
	 * Adds the ProveIt edit summary to the edit summary field.
	 *
	 * @return {void}
	 */
	addSummary: function () {
		var summary = jQuery( '#wpSummary' ).val();
		if ( summary ) {
			return; // If there is already a summary, don't screw it up
		}
		summary = proveit.getMessage( 'summary' );
		jQuery( '#wpSummary' ).val( summary );
	},

	/**
	 * Class for citations: <ref name="some-reference" />
	 *
	 * The citation class is the base class. It has the properties and methods common to all references.
	 *
	 * @param {object} data for constructing the object
	 */
	Citation: function ( argObj ) {

		/**
		 * Name of the class.
		 */
		this.type = 'Citation';

		/**
		 * Name of the reference.
		 *
		 * This is the value of the "name" parameter of the <ref> tag: <ref name="abc" />
		 */
		this.name = argObj.name;

		/**
		 * The location of this reference in the edit textbox.
		 */
		this.index = argObj.index;

		/**
		 * The wikitext for this reference.
		 */
		this.string = argObj.string;

		/**
		 * Highlights the string in the textbox and scrolls it to view.
		 *
		 * @return {void}
		 */
		this.highlight = function () {
			var textbox = proveit.getTextbox()[0];
			var text = textbox.value;

			// Scroll to the string
			textbox.value = text.substring( 0, this.index );
			textbox.focus();
			textbox.scrollTop = 99999999; // Larger than any real textarea (hopefully)
			var currentScrollTop = textbox.scrollTop;
			textbox.value += text.substring( this.index );
			if ( currentScrollTop > 0 ) {
				textbox.scrollTop = currentScrollTop + 300;
			}

			// Highlight the string
			var start = this.index;
			var end = this.index + this.string.length;
			jQuery( textbox ).focus().textSelection( 'setSelection', { 'start': start, 'end': end } );
		};
	},

	/**
	 * Class for raw references: <ref>This is a raw reference, it uses no templates.</ref>
	 *
	 * @extends Citation
	 * @param {object} data for constructing the object
	 */
	RawReference: function ( argObj ) {

		/**
		 * Command for extending the Citation class.
		 */
		proveit.Citation.call( this, argObj );

		/**
		 * Name of the class.
		 *
		 * Overrides the value inherited from the Citation class.
		 */
		this.type = 'RawReference';

		/**
		 * Array of citations for this reference.
		 */
		this.citations = [];

		/**
		 * Returns the icon URL for raw references.
		 *
		 * @return {string} icon URL
		 */
		this.getIcon = function () {
			return proveit.RAW_REFERENCE_ICON;
		};

		/**
		 * Converts this reference to wikitext.
		 *
		 * This method is trivial, but it needs to exist because it isn't trivial in the TemplateReference class,
		 * and sometimes we call it on a reference object without knowing if it's a raw reference or a template reference.
		 *
		 * @return {string} wikitext for this reference
		 */
		this.toString = function () {
			return this.string;
		};

		/**
		 * Converts this reference to a list item ready to be inserted into the reference list.
		 *
		 * @return {string} HTML <li>
		 */
		this.toListItem = function () {

			var item = jQuery( '<li/>', { 'class': 'reference-item', 'text': this.string } );

			var icon = jQuery( '<img/>', { 'class': 'icon', 'src': this.getIcon() } );

			var citations = jQuery( '<span/>', { 'class': 'citations' } );

			for ( var i = 0; i < this.citations.length; i++ ) {
				citations.append( jQuery( '<a/>', { 'href': '#', 'class': 'citation', 'text': i + 1 } ) );
			}

			item.prepend( icon ).append( citations );

			// Bind events
			var reference = this;
			item.click( function () {
				event.stopPropagation();
				reference.highlight();
				return false;
			});

			jQuery( 'a.citation', item ).click( function ( event ) {
				event.stopPropagation();
				var i = jQuery( this ).text() - 1;
				var citation = reference.citations[ i ];
				citation.highlight();
				return false;
			});

			return item;
		};
	},

	/**
	 * Class for template references: <ref>{{Cite book |first=Charles |last=Darwin |title=The Origin of Species}}</ref>
	 *
	 * @extends RawReference
	 * @param {object} data for constructing the object
	 */
	TemplateReference: function ( argObj ) {

		/**
		 * Command for extending the RawReference class.
		 */
		proveit.RawReference.call( this, argObj );

		/**
		 * Name of the class.
		 *
		 * Overrides the value inherited from the RawReference class.
		 */
		this.type = 'TemplateReference';

		/**
		 * Object mapping the parameter names of this reference to their values.
		 *
		 * This object is constructed directly out of the wikitext, so it doesn't include
		 * any information about the parameters other than their names and values,
		 * and it contains both registered parameters and custom parameters.
		 */
		this.params = {};

		/**
		 * Name of the template used by this reference.
		 */
		this.template = argObj.template;

		/**
		 * Returns the icon URL for this reference.
		 *
		 * Overrides the getIcon() method of the RawReference class.
		 *
		 * @return {string} icon URL
		 */
		this.getIcon = function () {
			if ( this.template in proveit.icons ) {
				return proveit.icons[ this.template ];
			}
			return proveit.TEMPLATE_REFERENCE_ICON;
		};

		/**
		 * Returns an object with the registered parameters for this reference.
		 *
		 * @return {object}
		 */
		this.getRegisteredParams = function () {
			var registeredTemplates = proveit.getRegisteredTemplates();
			return registeredTemplates[ this.template ];
		};

		/**
		 * Returns an object that maps aliases to registered parameters.
		 *
		 * @return {object}
		 */
		this.getRegisteredAliases = function () {
			var registeredAliases = {};
			var registeredParams = this.getRegisteredParams();
			var registeredParam, aliases, alias;
			for ( registeredParam in registeredParams ) {
				aliases = registeredParams[ registeredParam.alias ];
				if ( jQuery.type( aliases ) === 'array' ) {
					for ( alias in aliases ) {
						registeredAliases[ alias ] = registeredParam;
					}
				}
				if ( jQuery.type( aliases ) === 'string' ) {
					registeredAliases[ aliases ] = registeredParam;
				}
			}
			return registeredAliases;
		};

		/**
		 * Returns an object with the custom parameters of this reference.
		 *
		 * @return {object}
		 */
		this.getCustomParams = function () {
			var customParams = {};
			var registeredParams = this.getRegisteredParams();
			for ( var paramName in this.params ) {
				if ( !( paramName in registeredParams ) ) {
					customParams[ paramName ] = this.params[ paramName ];
				}
			}
			return customParams;
		};

		/**
		 * Returns an object with the required parameters for this reference.
		 *
		 * @return {object}
		 */
		this.getRequiredParams = function () {
			var requiredParams = {};
			var registeredParams = this.getRegisteredParams();
			for ( var registeredParam in registeredParams ) {
				if ( registeredParams[ registeredParam ].required === true ) {
					requiredParams[ registeredParam ] = registeredParams[ registeredParam ];
				}
			}
			return requiredParams;
		};

		/**
		 * Returns an object with the hidden parameters for this reference.
		 *
		 * @return {object}
		 */
		this.getHiddenParams = function () {
			var hiddenParams = {};
			var registeredParams = this.getRegisteredParams();
			for ( var registeredParam in registeredParams ) {
				if ( registeredParams[ registeredParam ].hidden === true ) {
					hiddenParams[ registeredParam ] = registeredParams[ registeredParam ];
				}
			}
			return hiddenParams;
		};

		/**
		 * Converts this reference to wikitext.
		 *
		 * Overrides the toString() method of the RawReference class.
		 *
		 * @return {string} wikitext for this reference
		 */
		this.toString = function () {
			var string;

			if ( this.name ) {
				string = '<ref name="' + this.name + '">';
			} else {
				string = '<ref>';
			}

			string += '{{' + this.template;

			for ( var name in this.params ) {
				string += ' |' + name + '=' + this.params[ name ];
			}

			string += '}}</ref>';

			return string;
		};

		/**
		 * Converts this reference to a list item ready to be inserted into the reference list.
		 *
		 * Overrides the toListItem() method of the RawReference class
		 *
		 * @return {string} HTML <li>
		 */
		this.toListItem = function () {

			var item = jQuery( '<li/>', { 'class': 'reference-item' } );

			var icon = jQuery( '<img/>', { 'class': 'icon', 'src': this.getIcon() } );

			var content = '<span class="template">' + this.template + '</span>';
			var requiredParams = this.getRequiredParams();
			var requiredParam, label, value;
			for ( requiredParam in requiredParams ) {
				label = requiredParams[ requiredParam ].label;
				value = this.params[ requiredParam ];
				content += '<span class="label">' + label + '</span>: <span class="value">' + value + '</span>';
			}

			var citations = jQuery( '<span/>', { 'class': 'citations' } );

			var i;
			for ( i = 0; i < this.citations.length; i++ ) {
				citations.append( jQuery( '<a/>', { 'href': '#', 'class': 'citation', 'text': i + 1 } ) );
			}

			item.html( content ).prepend( icon ).append( citations );

			// Bind events
			var reference = this;
			item.click( function () {
				reference.highlight();
				var form = reference.toForm();
				jQuery( '#proveit-reference-form-container' ).html( form ).show();
				jQuery( '#proveit-reference-list' ).hide();
				jQuery( '#proveit-buttons' ).show();
				jQuery( '#proveit-show-all-params-button' ).show();
				jQuery( '#proveit-update-button' ).show();
				jQuery( '#proveit-insert-button' ).hide();
			});

			jQuery( 'a.citation', item ).click( function ( event ) {
				event.stopPropagation();
				var i = jQuery( this ).text() - 1;
				var citation = reference.citations[ i ];
				citation.highlight();
				return false;
			});

			return item;
		};

		/**
		 * Converts this reference into a HTML form filled with its data.
		 *
		 * @return {string} HTML <form>
		 */
		this.toForm = function () {

			var form = jQuery( '<form/>', { 'id': 'proveit-reference-form' } );

			// Insert the <ref> name field
			var refNameLabel = jQuery( '<label/>', { 'text': proveit.getMessage( 'ref-name-label' ) } );
			var refNameInput = jQuery( '<input/>', { 'name': 'ref-name', 'value': this.name } );
			refNameLabel.append( refNameInput );
			form.append( refNameLabel );

			// Insert the dropdown menu
			var templateLabel = jQuery( '<label/>', { 'text': proveit.getMessage( 'template-label' ) } );
			var templateSelect = jQuery( '<select/>', { 'name': 'template' } );
			var registeredTemplates = proveit.getRegisteredTemplates();
			var templateName, templateOption;
			for ( templateName in registeredTemplates ) {
				templateOption = jQuery( '<option/>', { 'text': templateName, 'value': templateName } );
				if ( this.template === templateName ) {
					templateOption.attr( 'selected', 'selected' );
				}
				templateSelect.append( templateOption );
			}
			templateLabel.append( templateSelect );
			form.append( templateLabel );

			// The insert all the other fields
			var paramName, registeredParam, paramLabel, paramType, paramPlaceholder, paramValue, label, paramNameInput, paramValueInput;
			var registeredParams = this.getRegisteredParams();
			var hiddenParams = this.getHiddenParams();

			for ( paramName in registeredParams ) {
	
				registeredParam = registeredParams[ paramName ];

				// Defaults
				paramLabel = paramName;
				paramType = 'text';
				paramPlaceholder = '';
				paramValue = '';

				// Override with content
				if ( 'label' in registeredParam ) {
					paramLabel = registeredParam.label;
				}
				if ( 'type' in registeredParam ) {
					paramType = registeredParam.type;
				}
				if ( 'placeholder' in registeredParam ) {
					paramPlaceholder = registeredParam.placeholder;
				}
				if ( paramName in this.params ) {
					paramValue = this.params[ paramName ];
				}

				label = jQuery( '<label/>', { 'text': paramLabel } );
				paramNameInput = jQuery( '<input/>', { 'type': 'hidden', 'class': 'param-name', 'value': paramName } );
				paramValueInput = jQuery( '<input/>', { 'type': paramType, 'class': 'param-value', 'value': paramValue, 'placeholder': paramPlaceholder } );

				// Hide the hidden parameters, unless they are filled
				if ( ( paramName in hiddenParams ) && !paramValue ) {
					label.addClass( 'hidden' );
				}

				label.append( paramNameInput ).append( paramValueInput );
				form.append( label );
			}

			// Next, do the same with the custom parameters
			var customParams = this.getCustomParams();
			for ( paramName in customParams ) {

				paramValue = '';
				if ( paramName in this.params ) {
					paramValue = this.params[ paramName ];
				}

				label = jQuery( '<label/>' );
				paramNameInput = jQuery( '<input/>', { 'type': 'text', 'class': 'param-name', 'value': paramName } );
				paramValueInput = jQuery( '<input/>', { 'type': paramType, 'class': 'param-value', 'value': paramValue } );

				label.append( paramNameInput ).append( paramValueInput );
				form.append( label );
			}

			// Bind events
			var reference = this;
			templateSelect.change( function ( event ) {
				reference.template = jQuery( event.currentTarget ).val();
				var form = reference.toForm();
				jQuery( '#proveit-reference-form-container' ).html( form );
				jQuery( '#proveit-show-all-params-button' ).show();

			});

			jQuery( '#proveit-update-button' ).unbind( 'click' ).click( function () {
				reference.update();
			});

			jQuery( '#proveit-insert-button' ).unbind( 'click' ).click( function () {
				reference.insert();
			});

			return form;
		};

		/**
		 * Updates the data of this reference with the content of the reference form.
		 *
		 * @return {void}
		 */
		this.loadFromForm = function () {
			this.name = jQuery( '#proveit-reference-form input[name="ref-name"]' ).val();
			this.template = jQuery( '#proveit-reference-form select[name="template"]' ).val();

			// Load the parameters
			this.params = {};
			var labels = jQuery( '#proveit-reference-form label' ).splice(2); // All except the reference name and template
			var label, paramName, paramValue;
			for ( var i = 0; i < labels.length; i++ ) {
				label =  labels[ i ];
				paramName = jQuery( 'input.param-name', label ).val();
				paramValue = jQuery( 'input.param-value', label ).val();
				if ( paramName !== '' && paramValue !== '' ) {
					this.params[ paramName ] = paramValue;
				}
			}
			this.string = this.toString();
		};

		/**
		 * Updates the wikitext in the textbox with the current data of this reference
		 *
		 * @return {void}
		 */
		this.update = function () {
			var oldString = this.string;
			this.loadFromForm();
			var newString = this.string;

			// Replace the old reference
			var textbox = proveit.getTextbox();
			var text = textbox.val();
			text = text.replace( oldString, newString );
			textbox.val( text );

			// Update the index and highlight the reference
			text = textbox.val();
			this.index = text.indexOf( newString );
			this.highlight();

			// Add the summary and rescan
			proveit.addSummary();
			proveit.scanForReferences();
		};

		/**
		 * Inserts this reference into the textbox
		 *
		 * @return {void}
		 */
		this.insert = function () {
			this.loadFromForm();

			// Replace the existing selection (if any)
			var string = this.string;
			var textbox = proveit.getTextbox();
			textbox.textSelection( 'encapsulateSelection', {
				'peri': string,
				'replace': true
			});

			// Update the index and highlight the reference
			var text = textbox.val();
			this.index = text.indexOf( this.string );
			this.highlight();

			// Add the summary and rescan
			proveit.addSummary();
			proveit.scanForReferences();
		};
	}
};

jQuery( function () {
	proveit.init();
});