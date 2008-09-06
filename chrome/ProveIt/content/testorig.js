// Constants for a progress listener.
const NOTIFY_STATE_DOCUMENT = Components.interfaces.nsIWebProgress.NOTIFY_STATE_DOCUMENT;
const STATE_START = Components.interfaces.nsIWebProgressListener.STATE_START;
const STATE_STOP = Components.interfaces.nsIWebProgressListener.STATE_STOP;
const STATE_IS_DOCUMENT = Components.interfaces.nsIWebProgressListener.STATE_IS_DOCUMENT;

/*
 * This is a global to hold the list of citations, As it needs to be seen by all
 * methods for this page, globality is necessary.
 */
var currentScan;

/*
 * onload and onunload event handlers tied to the sidebar.
 * These tie the event handler into the browser and remove it when finished.
 */
function proveitonload() {
	top.getBrowser().addProgressListener(sendalert, NOTIFY_STATE_DOCUMENT);
}

function proveitonunload() {
	top.getBrowser().removeProgressListener(sendalert);
}
/**
 * A progress listener that catches events to drive the reloading of the citation list.
 * @type {}
 */
var sendalert = {
	onLocationChange : function(aProgress, aRequest, aURI) {
		if (!aProgress.isLoadingDocument) {
			// this checks to see if the tab is changed, the isloading check is
			// to keep us from double firing in the event the page is still
			// loading, we will then use the state_stop in statechange.
			alert("Location");
		};
	},
	onStateChange : function(aProgress, aRequest, aFlag, aStatus) {
		if ((aFlag & STATE_STOP) && (aRequest.URI) 
			&& (aRequest.URI.host == top.getBrowser().currentURI.host) 
			&& (aRequest.URI.path == top.getBrowser().currentURI.path)) {
			// LoadWikiPage(aRequest.URI.spec,
			// aProgress.DOMWindow.top._content.document.title,
			// aProgress.DOMWindow.top._content.document.referrer);
			// ^for figuring out what the inputs are
			// this is called when a page finishes loading, call the scan/add
			// function from here
			alert("Stop: " + aRequest.URI.scheme + "://"+aRequest.URI.host+aRequest.URI.path);
		}
		if (aFlag & STATE_START) {
			// do nothing here, this is just deprecated or possibly a call to
			// wipe the current list.
		}
	},
	onSecurityChange : function(aWebProgress, aRequest, aState) {},
	onStatusChange : function(aWebProgress, aRequest, aStatus, aMessage) {},
	onProgressChange : function(aWebProgress, aRequest, aCurSelfProgress,
			aMaxSelfProgress, aCurTotalProgress, aMaxTotalProgress) {},
	onLinkIconAvailable : function(a, b) {}
}

/**
 * This Function accesses the wiki edit box and scans the contained text for
 * citation tags. It then puts them into the global currentScan and setsup the
 * display chooser.
 */
function scanRef() {
	// text is the text from the edit box
	var text;
	// just a var to point to the number text box for choosing which to display.
	var selecter = document.getElementById("displayinput");
	// zero out the old scan, just in case
	currentScan = null;
	// check to see if the edit box exists, basically a boilerplate for using it
	// on the wrong page.
	if (top.window._content.document.getElementById('wpTextbox1')) {
		// grab the text from the box, wpTextbox1 is the standard boxx name.
		text = top.window._content.document.getElementById('wpTextbox1').value;
		// scan it for citation tags...
		currentScan = text.match(/{{[\s]*cite[^}]*}}/g);
		// if there are results,
		if (currentScan) {
			// just for me and testing, make them easier to read by replacing
			// all | with newlines and a tab
			for (var i = 0; i < currentScan.length; i++) {
				currentScan[i] = currentScan[i].replace(/\|/g, "\r\n\t|");
			}
			// set up the selector textbox
			selecter.removeAttribute("disabled");
			selecter.setAttribute("min", 1);
			selecter.setAttribute("max", currentScan.length);
			selecter.value = "1";
			// display the initial citation tag
			document.getElementById('display').value = currentScan[0];
		} else {
			// if the scan is empty, kill all the selector and display
			selecter.setAttribute("disabled", true);
			selecter.setAttribute("min", 0);
			selecter.setAttribute("max", 0);
			selecter.value = 0;
			document.getElementById('display').value = "";
		}
	}
}

/**
 * Changes the display in the display area according to which entry is selected.
 */
function dispRef() {
	var thisnum = document.getElementById("displayinput").value;
	thisnum--;
	if (-1 < thisnum < currentScan.length) {
		document.getElementById('display').value = currentScan[thisnum];
	}
}