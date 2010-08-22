/*
 Extract from Wikipedia's version of MediaWiki's wikibits.js (http://bits.wikimedia.org/skins-1.5/common/wikibits.js)

 This program is free software; you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation; either version 2 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along
 with this program; if not, write to the Free Software Foundation, Inc.,
 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 http://www.gnu.org/copyleft/gpl.html
*/

// add any onload functions in this hook (please don't hard-code any events in the xhtml source)
var doneOnloadHook;

if (!window.onloadFuncts) {
	var onloadFuncts = [];
}

function addOnloadHook( hookFunct ) {
	// Allows add-on scripts to add onload functions
	if( !doneOnloadHook ) {
		onloadFuncts[onloadFuncts.length] = hookFunct;
	} else {
		hookFunct();  // bug in MSIE script loading
	}
}

function hookEvent( hookName, hookFunct ) {
	addHandler( window, hookName, hookFunct );
}

function importScript( page ) {
	// TODO: might want to introduce a utility function to match wfUrlencode() in PHP
	var uri = wgScript + '?title=' +
		encodeURIComponent(page.replace(/ /g,'_')).replace(/%2F/ig,'/').replace(/%3A/ig,':') +
		'&action=raw&ctype=text/javascript';
	return importScriptURI( uri );
}

var loadedScripts = {}; // included-scripts tracker
function importScriptURI( url ) {
	if ( loadedScripts[url] ) {
		return null;
	}
	loadedScripts[url] = true;
	var s = document.createElement( 'script' );
	s.setAttribute( 'src', url );
	s.setAttribute( 'type', 'text/javascript' );
	document.getElementsByTagName('head')[0].appendChild( s );
	return s;
}

function importStylesheet( page ) {
	return importStylesheetURI( wgScript + '?action=raw&ctype=text/css&title=' + encodeURIComponent( page.replace(/ /g,'_') ) );
}

function importStylesheetURI( url, media ) {
	var l = document.createElement( 'link' );
	l.type = 'text/css';
	l.rel = 'stylesheet';
	l.href = url;
	if( media ) {
		l.media = media;
	}
	document.getElementsByTagName('head')[0].appendChild( l );
	return l;
}
