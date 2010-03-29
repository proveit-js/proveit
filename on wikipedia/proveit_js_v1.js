$j(function() {

$j('head').append('<link type="text/css" href="http://jquery-ui.googlecode.com/svn/tags/latest/themes/base/jquery-ui.css" rel="stylesheet" />');
$j('head').append('<link type="text/css" href="http://www.cc.gatech.edu/~luther/proveit/styles.css" rel="stylesheet" />');

var proveit = $j('<div id="proveit"> <div id="tabs"> <ul> <li><a href="#tabs-1">Add</a></li> <li><a href="#tabs-2">View (24)</a></li> <li><a href="#tabs-3">Edit</a></li> </ul> <div id="tabs-1"> <fieldset class="inputs scroll" style="height: 430px;"> <div class="input-row"> <label class="required" for="">What kind of reference?</label> <select id="" name=""> <option selected="selected">Website</option> <option>Book</option> <option>Journal article</option> <option>Conference paper</option> <option>Encyclopedia article</option> <option>News article</option> <option>Newsgroup posting</option> <option>Press release</option> <option>TV or radio episode</option> </select> </div> <div class="input-row"> <label class="required" for="">Title</label> <input type="text" class="text" value="" /> </div> <div class="input-row"> <label class="required" for="">URL</label> <input type="text" class="text" value="" /> </div> <div class="input-row"> <label for="">Work</label> <input type="text" class="text" value="" /> <button>delete field</button> </div> <div class="input-row"> <label for="">Publisher</label> <input type="text" class="text" value="" /> <button>delete field</button> </div> <div class="input-row"> <label for="">Date</label> <input type="text" class="text" value="" /> <button>delete field</button> </div> <div class="input-row"> <label for="">Access Date</label> <input type="text" class="text" value="2010-03-23" /> <button>delete field</button> </div> </fieldset> <div id="add-buttons"> <button>add field</button> <button class="right-side">finish &amp; insert</button> <button class="right-side">cancel</button> </div><!-- end bottom-buttons --> </div><!-- end tabs-1 --> <div id="tabs-2"> <div class="scroll" style="height: 470px; border: 1px solid #dddddd;"> <table> <thead> <tr style="display: none;"> <th>Author</th> <th>Year</th> <th>Title</th> <th>Edit</th> <th>Ibid.</th> </tr> </thead> <tbody> <tr class="dark"> <td class="author">Benkler</td> <td class="year">2006</td> <td class="title" title="The Wealth of Networks: How Social Production Transforms Markets and Freedom">The Wealth of Networks: How Social Production Transforms Markets &hellip;</td> <td class="edit"><button>edit reference</button></td> <td class="ibid"><button>ibid.</button></td> </tr> <tr class="light"> <td class="author">Bryant et al.</td> <td class="year">2005</td> <td class="title" title="Becoming Wikipedian: transformation of participation in a collaborative online encyclopedia">Becoming Wikipedian: transformation of participation in a &hellip;</td> <td class="edit"><button>edit reference</button></td> <td class="ibid"><button>ibid.</button></td> </tr> <tr class="dark"> <td class="author">Luther &amp; Bruckman</td> <td class="year">2008</td> <td class="title" title="Leadership in online creative collaboration">Leadership in online creative collaboration</td> <td class="edit"><button>edit reference</button></td> <td class="ibid"><button>ibid.</button></td> </tr> <tr class="light"> <td class="author">Luther et al.</td> <td class="year">2009</td> <td class="title">ProveIt: a new tool for supporting citation in MediaWiki</td> <td class="edit"><button>edit reference</button></td> <td class="ibid"><button>ibid.</button></td> </tr> <tr class="dark selected"> <td class="author">Benkler</td> <td class="year">2006</td> <td class="title" title="The Wealth of Networks: How Social Production Transforms Markets and Freedom">The Wealth of Networks: How Social Production Transforms Markets &hellip;</td> <td class="edit"><button>edit reference</button></td> <td class="ibid"><button>ibid.</button></td> </tr> <tr class="light"> <td class="author">Bryant et al.</td> <td class="year">2005</td> <td class="title" title="Becoming Wikipedian: transformation of participation in a collaborative online encyclopedia">Becoming Wikipedian: transformation of participation in a &hellip;</td> <td class="edit"><button>edit reference</button></td> <td class="ibid"><button>ibid.</button></td> </tr> <tr class="dark"> <td class="author">Luther &amp; Bruckman</td> <td class="year">2008</td> <td class="title" title="Leadership in online creative collaboration">Leadership in online creative collaboration</td> <td class="edit"><button>edit reference</button></td> <td class="ibid"><button>ibid.</button></td> </tr> <tr class="light"> <td class="author">Luther et al.</td> <td class="year">2009</td> <td class="title">ProveIt: a new tool for supporting citation in MediaWiki</td> <td class="edit"><button>edit reference</button></td> <td class="ibid"><button>ibid.</button></td> </tr> <tr class="dark"> <td class="author">Benkler</td> <td class="year">2006</td> <td class="title" title="The Wealth of Networks: How Social Production Transforms Markets and Freedom">The Wealth of Networks: How Social Production Transforms Markets &hellip;</td> <td class="edit"><button>edit reference</button></td> <td class="ibid"><button>ibid.</button></td> </tr> <tr class="light"> <td class="author">Bryant et al.</td> <td class="year">2005</td> <td class="title" title="Becoming Wikipedian: transformation of participation in a collaborative online encyclopedia">Becoming Wikipedian: transformation of participation in a &hellip;</td> <td class="edit"><button>edit reference</button></td> <td class="ibid"><button>ibid.</button></td> </tr> <tr class="dark"> <td class="author">Luther &amp; Bruckman</td> <td class="year">2008</td> <td class="title" title="Leadership in online creative collaboration">Leadership in online creative collaboration</td> <td class="edit"><button>edit reference</button></td> <td class="ibid"><button>ibid.</button></td> </tr> <tr class="light"> <td class="author">Luther et al.</td> <td class="year">2009</td> <td class="title">ProveIt: a new tool for supporting citation in MediaWiki</td> <td class="edit"><button>edit reference</button></td> <td class="ibid"><button>ibid.</button></td> </tr> <tr class="dark"> <td class="author">Benkler</td> <td class="year">2006</td> <td class="title" title="The Wealth of Networks: How Social Production Transforms Markets and Freedom">The Wealth of Networks: How Social Production Transforms Markets &hellip;</td> <td class="edit"><button>edit reference</button></td> <td class="ibid"><button>ibid.</button></td> </tr> <tr class="light"> <td class="author">Bryant et al.</td> <td class="year">2005</td> <td class="title" title="Becoming Wikipedian: transformation of participation in a collaborative online encyclopedia">Becoming Wikipedian: transformation of participation in a &hellip;</td> <td class="edit"><button>edit reference</button></td> <td class="ibid"><button>ibid.</button></td> </tr> <tr class="dark"> <td class="author">Luther &amp; Bruckman</td> <td class="year">2008</td> <td class="title" title="Leadership in online creative collaboration">Leadership in online creative collaboration</td> <td class="edit"><button>edit reference</button></td> <td class="ibid"><button>ibid.</button></td> </tr> <tr class="light"> <td class="author">Luther et al.</td> <td class="year">2009</td> <td class="title">ProveIt: a new tool for supporting citation in MediaWiki</td> <td class="edit"><button>edit reference</button></td> <td class="ibid"><button>ibid.</button></td> </tr> <tr class="dark"> <td class="author">Benkler</td> <td class="year">2006</td> <td class="title" title="The Wealth of Networks: How Social Production Transforms Markets and Freedom">The Wealth of Networks: How Social Production Transforms Markets &hellip;</td> <td class="edit"><button>edit reference</button></td> <td class="ibid"><button>ibid.</button></td> </tr> <tr class="light"> <td class="author">Bryant et al.</td> <td class="year">2005</td> <td class="title" title="Becoming Wikipedian: transformation of participation in a collaborative online encyclopedia">Becoming Wikipedian: transformation of participation in a &hellip;</td> <td class="edit"><button>edit reference</button></td> <td class="ibid"><button>ibid.</button></td> </tr> <tr class="dark"> <td class="author">Luther &amp; Bruckman</td> <td class="year">2008</td> <td class="title" title="Leadership in online creative collaboration">Leadership in online creative collaboration</td> <td class="edit"><button>edit reference</button></td> <td class="ibid"><button>ibid.</button></td> </tr> <tr class="light"> <td class="author">Luther et al.</td> <td class="year">2009</td> <td class="title">ProveIt: a new tool for supporting citation in MediaWiki</td> <td class="edit"><button>edit reference</button></td> <td class="ibid"><button>ibid.</button></td> </tr> <tr class="dark"> <td class="author">Benkler</td> <td class="year">2006</td> <td class="title" title="The Wealth of Networks: How Social Production Transforms Markets and Freedom">The Wealth of Networks: How Social Production Transforms Markets &hellip;</td> <td class="edit"><button>edit reference</button></td> <td class="ibid"><button>ibid.</button></td> </tr> <tr class="light"> <td class="author">Bryant et al.</td> <td class="year">2005</td> <td class="title" title="Becoming Wikipedian: transformation of participation in a collaborative online encyclopedia">Becoming Wikipedian: transformation of participation in a &hellip;</td> <td class="edit"><button>edit reference</button></td> <td class="ibid"><button>ibid.</button></td> </tr> <tr class="dark"> <td class="author">Luther &amp; Bruckman</td> <td class="year">2008</td> <td class="title" title="Leadership in online creative collaboration">Leadership in online creative collaboration</td> <td class="edit"><button>edit reference</button></td> <td class="ibid"><button>ibid.</button></td> </tr> <tr class="light"> <td class="author">Luther et al.</td> <td class="year">2009</td> <td class="title">ProveIt: a new tool for supporting citation in MediaWiki</td> <td class="edit"><button>edit reference</button></td> <td class="ibid"><button>ibid.</button></td> </tr> </tbody> </table> </div> </div><!-- end tabs-2 --> <div id="tabs-3"> <fieldset class="inputs scroll" style="height: 430px;"> <div class="input-row"> <label class="required" for="">What kind of reference?</label> <select id="" name=""> <option>Website</option> <option selected="selected">Book</option> <option>Journal article</option> <option>Conference paper</option> <option>Encyclopedia article</option> <option>News article</option> <option>Newsgroup posting</option> <option>Press release</option> <option>TV or radio episode</option> </select> </div> <div class="input-row"> <label class="required" for="">Title</label> <input type="text" class="text" value="The Wealth of Networks: How Social Production Transforms Markets and Freedom" /> </div> <div class="input-row"> <label for="">Author</label> <input type="text" class="text" value="Yochai Benkler" /> <button>delete field</button> </div> <div class="input-row"> <label for="">Author link</label> <input type="text" class="text" /> <button>delete field</button> </div> <div class="input-row"> <label for="">Year</label> <input type="text" class="text" value="2006" /> <button>delete field</button> </div> <div class="input-row"> <label for="">ISBN</label> <input type="text" class="text" value="0300110561" /> <button>delete field</button> </div> </fieldset> <div id="edit-buttons"> <button>add field</button> <button class="right-side">finish</button> <button class="right-side">cancel</button> </div><!-- end bottom-buttons --> </div><!-- end tabs-3 --> </div><!-- end tabs --> </div><!-- end proveit --> ');

$j('div#content').append(proveit);

// set up tabs
$j("#tabs").tabs({
	selected: 1
});

// add buttons
$j("div#add-buttons button:first").button({
	icons: {
		primary: 'ui-icon-circle-plus'
	}
}).next().button({
	icons: {
		primary: 'ui-icon-circle-check',
		secondary: 'ui-icon-circle-arrow-e'
	}		
}).next().button({
	icons: {
		primary: 'ui-icon-circle-close'
	}
});

// edit buttons
$j("div#edit-buttons button:first").button({
	icons: {
		primary: 'ui-icon-circle-plus'
	}
}).next().button({
	icons: {
		primary: 'ui-icon-circle-check'
	}		
}).next().button({
	icons: {
		primary: 'ui-icon-circle-close'
	}
});	

// delete field button
$j("div.input-row button").button({
	icons: {
		primary: 'ui-icon-close',
	},
	text: false
});	

// view buttons
$j("td.edit button").button({
	icons: {
		primary: 'ui-icon-pencil'
	},
	text: false
});

$j("td.ibid button").button({
	icons: {
		primary: 'ui-icon-arrowthick-1-e',
	},
	text: false
});

});
