/**
 * This file contains a minimal replacement of the mw object
 * so that the demo can run without MediaWiki
 */
mw = {
	config: {
		get: function ( key ) {
			if ( key === 'wgCanonicalNamespace' ) {
				return '';
			}
			if ( key === 'wgUserLanguage' ) {
				return 'en'; // Manually change this if you want to test another language
			}
			if ( key === 'wgAction' ) {
				return 'edit';
			}
		}
	},
	messages: {
		set: function ( value ) {
			this.messages = value; 
		}
	},
	message: function ( key ) {
		return this.messages.messages[ key ];
	},
	loader: {
		using: function ( dependencies, callback ) {
			callback();
		}
	}
};