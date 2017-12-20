/*
 * This file contains the code to interact with the data structures maintained for the structured digital abstract.
 * (C) 2008, 2009 dept of Medical Informatics, Erasmus Medical Center Rotterdam / Knewco Inc
 * Erik M. van Mulligen
*/

/*
 * constructor
 */
var NEW      = 1;
var EXISTING = 2;

var NONE     = 0;
var NEXT     = 1;
var PREVIOUS = 2;
var SELECT   = 3;
var OPEN     = 4;

function ContentManager(){
	this.originalCache = null;
	this.cache = null;
	this.prevCache = null;
	this.ownConcepts = 0;
	this.modified = false;
	this.text = "";
	this.selectedText = "";
	this.concept = null;
	this.markerId = "";
	this.relationInfo = [];
	this.pmids = [];
	this.currentpmid = null;
	this.annotator = null;
	this.relation = "";
	this.loadedFromDisk = false;
	this.modus = 0;
	this.action = NONE;
	this.foundConcepts = null;
	this.clid = 2000;
}

ContentManager.prototype.printCache = function(){
	linker.log.WriteDebugLine( "printCache(): " + this.cache.fingerprints.length + " fingerprints" );
	for ( var f = 0 ; f < this.cache.fingerprints.length ; f++ ){
		for ( var c = 0 ; c < this.cache.fingerprints[f].concepts.length ; c++ ){
			for ( var w = 0 ; w <  this.cache.fingerprints[f].concepts[c].words.length ; w++ ){
				linker.log.WriteDebugLine( "fp = " + f + ", c = " + this.cache.fingerprints[f].concepts[c].id + ", " + this.cache.fingerprints[f].concepts[c].name() + ", w = " + this.cache.fingerprints[f].concepts[c].words[w].pos );
			}
		}
	}
}

ContentManager.prototype.setOriginalCache = function(){
	this.originalCache = this.stringify();
}

ContentManager.prototype.newConceptId = function(){
	this.ownConcepts = this.ownConcepts + 1;
	return this.ownConcepts;
}

// this method initializes the content manager
ContentManager.prototype.init = function(processWindow){
	if ( processWindow == null ){
		processWindow = window;
	}

    this.processWindow = processWindow;
	this.processDocument = this.processWindow.document;
	var page = this.processWindow.currentcacheelt.page;
	linker.url = page;
	linker.processDocument = this.processDocument;
	this.processWindow.currentcacheelt = new linker.subject.CacheElement(linker.url)
	this.cache = this.processWindow.currentcacheelt;
	this.texteditor = this.processDocument.getElementById("sentences");
	this.text = getTextValue(this.texteditor,false,0,false);
	this.annotationName = "";
	if ( this.processDocument.getElementById("pmids").value != "" ){
		this.pmids = this.processDocument.getElementById("pmids").value.split(",");
	}
	if ( this.processDocument.getElementById("relation").innerHTML != "" ){
		this.annotator = this.processDocument.getElementById("relation").innerHTML;
	}
	if ( this.processDocument.getElementById("annotator").innerHTML != "" ){
		this.annotator = this.processDocument.getElementById("annotator").innerHTML;
	}
	if ( this.processDocument.getElementById("selectedPmid").innerHTML != "" ){
		this.currentpmid = this.processDocument.getElementById("selectedPmid").innerHTML;
	}
	var textfields = getElementsByClassName( this.processDocument, "div", "indexable" );
	this.originalTexts = [];
	for ( var i = 0 ; i < textfields.length ; i++ ){
		this.originalTexts[i] = decode( textfields[i].innerHTML );
	}
	
	// override two functions
	linker.highlighting.IsSuppressed = isSuppressedConcept;
	linker.getNavigationDocument = function(){return document;};
}

function encode(string) {
	return string.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\'/g,'&apos;').replace(/"/g,'&quot;');
}

function decode(string) {
	return string.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&apos;/g,'\'').replace(/&quot;/g,'"');
}

ContentManager.prototype.resetTexts = function(){
	var textfields = getElementsByClassName( this.processDocument, "div", "indexable" );
	for ( var i = 0 ; i < textfields.length ; i++ ){
		textfields[i].innerHTML = encode( this.originalTexts[i] );
	}	
}

ContentManager.prototype.count_concepts = function(mycache){
	var count = 0;
	for ( var i = 0 ; i < mycache.fingerprints.length ; i++ ){
		for ( var j = 0 ; j < mycache.fingerprints[i].concepts.length ; j++ ){
			if ( ! isSuppressedConcept(mycache.fingerprints[i].concepts[j]) ){
				count++;
			}
		}
	}
	return count;
}

ContentManager.prototype.undo = function(){
	this.setCacheFromString(this.prevCache);
}

ContentManager.prototype.reset = function(){
	//this.setCacheFromString(this.originalCache);
	this.pmids = document.getElementById("pmids").value.split(",");
	this.currentpmid = document.getElementById("selectedPmid").innerHTML;
	this.annotator = document.getElementById("annotator").innerHTML;
	this.relation = document.getElementById("relation").value;
	for ( var i = 0 ; i < ( pmids.length - 1 ); i++ ){
			cm.processWindow.open( this.processDocument.location.href.split("?")[0] + 
					"&relation=" + this.relation + "&annotator=" + this.annotator + "&selected=" + this.currentpmid + "&pmids=" + this.pmids, "_self" );
	}
}

ContentManager.prototype.setCacheFromString = function(cacheString){
	this.cache = this.instantiate(cacheString);
	this.processWindow.currentcacheelt = this.cache;
    
    this.refresh();
	this.show();
}

ContentManager.prototype.initRelationCache = function(sentences){
	this.relationInfo = [];
	
	for ( var i = 0 ; i < sentences.length ; i++ ){
		for ( var j = 0 ; j < sentences[i].relations.length ; j++ ){
			var pieces  = sentences[i].relations[j].relation.split( "_" );
			var row     = pieces[0];
			var source  = pieces[1];
			var target  = pieces[2];
			var value   = sentences[i].relations[j].value;
			var checked = sentences[i].relations[j].checked;
			this.relationInfo[this.relationInfo.length] = { 'id': row + '_' + source + '_' + target, 'row': row, 'source': source, 'target': target, 'value' : value, 'checked': checked };
		}
	}
}

ContentManager.prototype.setCache = function(data){
	try{
		this.init(this.processWindow);
		this.cache = this.initCache( data.cache );
		this.initRelationCache( data.sentences );
		this.processWindow.currentcacheelt = this.cache;

	    linker.parsing.clearNodeQueue();
	    linker.indexing.clearTextQueue();
	    linker.parsing.init();  
	    linker.indexing.indexed = false;  
	    linker.parsing.parsed = true;
 
		this.refresh();
	} catch(e){
		linker.log.WriteDebugLine( "setCache(): failure" );
	}
}

function printConceptInfo( label, concept ){
	var str = concept.name();
	for ( var w = 0 ; w < concept.words.length ; w++ ){
		str += "(" + concept.words[w].pos + "," + concept.words[w].len + ")";
	}
	linker.log.WriteDebugLine( label + ": " + str );	
}

ContentManager.prototype.findConceptsByLocation = function( offset, position ){
	conceptLocations = [];
	begin = position.pos - offset;
	end = position.pos + position.len - offset;
	for ( var f = 0 ; f < this.cache.fingerprints.length ; f++ ){
		for ( var c = 0 ; c < this.cache.fingerprints[f].concepts.length ; c++ ){
			for ( var w = 0 ; w < this.cache.fingerprints[f].concepts[c].words.length ; ++w ){
				/* check if there is overlap between the selected text and a concept */
				var sel_start = position.pos;
				var sel_end   = position.pos + position.len;
				var con_start = this.cache.fingerprints[f].concepts[c].words[w].pos;
				var con_end   = this.cache.fingerprints[f].concepts[c].words[w].pos + this.cache.fingerprints[f].concepts[c].words[w].len;
				if ( intersect( sel_start, sel_end, con_start, con_end ) ){
				//if ( ( ( sel_start >= con_start ) && ( sel_start <= con_end ) ) || ( ( con_start >= sel_start ) && ( con_start <= sel_end ) ) ){
					conceptLocations[conceptLocations.length] = {'concept': this.cache.fingerprints[f].concepts[c], 'pos': sel_start, 'end': sel_end };
				}
			}
		}
	}
	return conceptLocations;
}

function printConcept( concept ){
	linker.log.WriteDebugLine( "printConcept(): #0" );
	for ( var i = 0 ; i < concept.words.length ; i++ ){
		linker.log.WriteDebugLine( "printConcept(): words " + i );
	}
	linker.log.WriteDebugLine( "printConcept(): #1" );
}

function escapeRegExpMetaChars( aString ){
	var metaChars = ["\\",".","+","*","?","(",")"];
	var res = aString;
	for ( var i = 0 ; i < metaChars.length ; i++ ){
		res = res.replace( metaChars[i], "\\" + metaChars[i] );
	}
	return res;
}

function alphaNumericCheck(theChar) {
	return linker.utils.isDigit(theChar) || linker.utils.isAlpha(theChar.toUpperCase() );
}

function trim(str) { 
    str.replace(/^\s*/, '').replace(/\s*$/, ''); 

   return str;
}

/*
 * This function is called upon the selection of a piece of text. The text is added prepared as new concept.
 * If the user indicates a semantic type for this concept in semTypeCallback, the concept will be added to 
 * a fingerprint and displayed.
 * This function also checks whether the new concept overlaps an existing concept. In that case the positions 
 * of the existing concept are removed from the fingerprint as soon as the concept is added.
 * A list of positions (PositionsToDelete) of concepts is maintained in the content manager to be effectuated when
 * a semantic type is selected.
 */
ContentManager.prototype.addConcept = function(text,editor){
	
	var textfields = getElementsByClassName( document, "div", "indexable" );
	cm.concept = new linker.subject.Concept();
	cm.concept.id = "sda/" + this.newConceptId();;
	cm.concept.info = {'id':cm.concept.id,'name':text,'mappedFromId':-1,'mappedFromName':'','semanticTypes':['None'],'definition':''};
	
	cm.foundConcepts = [];

	// if accidentally a surrounding space has been selected, strip this off
	text = trim( text );
	
	var searchText = text.toLowerCase();
	
	for ( var i = 0 ; i < textfields.length ; i++ ){
		
		var areaText = getTextValue(textfields[i],false,0,false).toLowerCase();
		var fromIndex = 0;
			
		while ( true ){
			var pos = areaText.substring(fromIndex).indexOf( searchText );
			
			if ( pos == -1 ){
				break;
			}
			
			var startPos = fromIndex + pos;
			var endPos   = fromIndex + pos + text.length;

			if ( ( ( pos == 0 ) || ( ! alphaNumericCheck( areaText[startPos-1] ) ) ) && ( ( endPos >= areaText.length ) || ( ! alphaNumericCheck( areaText[endPos] ) ) ) ){
				var concepts = this.findConceptsByLocation( startPositions[i] + fromIndex, { 'pos': startPositions[i] + fromIndex + pos, 'len': text.length } );
				for ( var c = 0 ; c < concepts.length ; c++ ){
					cm.foundConcepts[cm.foundConcepts.length] = concepts[c];
				}
				
				var wordObj = cm.concept.add();
				cm.clid += 1;
				wordObj.pos  = startPositions[i] + startPos;
				wordObj.len  = text.length;
				wordObj.clid = cm.clid;
				wordObj.text = text;
			}
			fromIndex = endPos;
		}
	}
	
	this.modus = NEW;
	this.selectedText = text;
}

ContentManager.prototype.updateMarkers = function(id){
	var allShown = true;
	for ( var f = 0 ; f < linker.processWindow.currentcacheelt.fingerprints.length ; f = f + 1 ){
		if ( linker.processWindow.currentcacheelt.fingerprints[f].shown == false ){
			allShown = false;
			self.setTimeout(function(){cm.updateMarkers(id);}, 0 );
		}
	}
	if ( allShown ){
	    var nodes = linker.processWindow.currentcacheelt.highlightnodes;
	    if ( nodes !== null ){
	    	for ( var j = 0; j < nodes.length; j = j + 1 ) {
	    		var node = linker.highlighting.getFontNode(nodes[j][0]);
	    		this.markerId = id;
	    		id2 = id.split( "_" )[1]
	    		if ( nodes[j][0].id.indexOf( id2 ) != -1 ){
				    node.style.backgroundColor = "yellow";
	    		}
	    	}
	    }
	}
}

ContentManager.prototype.redisplay = function(){
	data = "{'status':'OK','data':"+this.stringify()+"}";
	
	this.clearRelations();
	this.init();
	var responseObj = eval( '(' + data + ')' );
	this.fill( responseObj.data.sentences );
	this.setCache(responseObj.data);
	this.show();
}

ContentManager.prototype.removeMarkers = function(){
    var nodes = linker.processWindow.currentcacheelt.highlightnodes;
    if ( nodes !== null ){
    	for ( var j = 0; j < nodes.length; j = j + 1 ) {
    		var node = linker.highlighting.getFontNode(nodes[j][0]);
    		id2 = this.markerId.split( "_" )[1]
    		if ( nodes[j][0].id.indexOf( id2 ) != -1 ){
			    node.style.backgroundColor = "transparent";
    		}
    	}
    }
}

ContentManager.prototype.filelistCallback = function(data,status){
	var responseObj = eval( '(' + unescape(data) + ')' );
	if ( responseObj.status === "OK" ){
		showFileSelectionDialog(responseObj.files);
	}
	else if ( responseObj.status === "FAIL" ){
	}
}

ContentManager.prototype.fill = function( sentences ){
	var table = document.getElementById("sentences");
	var newHtml = "";
	for ( var s = 0 ; s < sentences.length ; s++ ){
		var cnt = s + 1;
	    newHtml += "<tr><td valign=\"top\"><div onmouseUp=\"popupOnTextSelection(event);\"  id=\"texteditor_" + cnt + "\" class=\"indexable\">" + encode( sentences[s].text ) + "</div></td><td>";
	    newHtml += "<table id=\"" + cnt + "\" class=\"pairs\"><COLGROUP><COL width=\"10%\"><COL width=\"30%\"><COL width=\"30%\"><COL width=\"30%\"></COLGROUP></table></td></tr>";
	}
    table.innerHTML = newHtml;
}

ContentManager.prototype.clear = function(){
	var table = document.getElementById("sentences");
	for ( var r = table.rows.length - 1 ; r >= 0 ; r-- ){
		table.deleteRow(r);
	}
}

ContentManager.prototype.openCallback = function(data,status){
	var responseObj = eval( '(' + unescape(data) + ')' );
	if ( responseObj.status === "OK" ){
		cm.loadedFromDisk = true;
		cm.init();
		cm.fill( responseObj.data.sentences );
		linker.indexing.indexed = false;
		cm.setCache(responseObj.data);
		cm.show();
	}
	else if ( responseObj.status == "NONEXISTING" ){
		cm.init();
		linker.indexing.indexed = false;
		linker.parsing.indexNode(cm.texteditor);
		for (var f=0; f<linker.processWindow.currentcacheelt.fingerprints.length; f++) {
	    	linker.processWindow.currentcacheelt.fingerprints[f].shown = false;
		}
	    waitForIndexer();
	}
}

ContentManager.prototype.open = function(filename){
	if ( this.modified ){
		this.save();
	}

	this.annotator = document.getElementById("annotator").innerHTML;

	if ( filename == null ){
	    linker.transport.callServer("listfiles.py", "GET", this.filelistCallback, "annotator=" + this.annotator );
	}
	else{
	    linker.transport.callServer("open.py", "POST", this.openCallback, "filename="+filename+"&annotator=" + this.annotator );
	}
}

ContentManager.prototype.edit = function(){
	this.processWindow.history.back();
}


function waitForIndexer(){
	if ( linker.indexing.indexed ){
		cm.collectRelations();
		waitForShown();
	}
	else{
		setTimeout(waitForIndexer, 500);
	}
}

ContentManager.prototype.redisplay = function(){
    linker.parsing.clearNodeQueue();
    linker.indexing.clearTextQueue();
    linker.parsing.init();  
    linker.indexing.indexed = false;  
    linker.parsing.parsed = true;
    linker.indexing.queryLength = this.text.length;
       
	for (var f=0; f<linker.processWindow.currentcacheelt.fingerprints.length; f++) {
    	linker.processWindow.currentcacheelt.fingerprints[f].positions = null;
    	linker.processWindow.currentcacheelt.fingerprints[f].shown = false;
    	linker.processWindow.currentcacheelt.fingerprints[f].setOffset(linker.processWindow.currentcacheelt.fingerprints[f].offset);
        linker.subject.FingerprintInit(linker.processWindow.currentcacheelt.fingerprints[f]);
    }
    linker.highlighting.ShowConcepts(0);
 
    waitForShown();
}

ContentManager.prototype.process = function(){
    /*
     * initialize the variables for wikifier_base upon initializing the content manager
     */
    linker.cache.ConceptCache = [];
    linker.cache.SemanticTypeCache = [];
    linker.processWindow.currentcacheelt = null;
    linker.processWindow.currentcacheelt = new linker.subject.CacheElement("");
    this.cache = linker.processWindow.currentcacheelt;
    linker.parsing.clearNodeQueue();
    linker.indexing.clearTextQueue();
    linker.parsing.init();  
    linker.indexing.indexed = false;  
    linker.parsing.parsed = true;
    linker.indexing.queryLength = this.text.length;

    if ( this.currentpmid != null ){
    	this.open( this.currentpmid );
    }
    else{
		cm.init();
		linker.indexing.indexed = false;
		linker.parsing.indexNode(cm.texteditor);
		for (var f=0; f<linker.processWindow.currentcacheelt.fingerprints.length; f++) {
	    	linker.processWindow.currentcacheelt.fingerprints[f].shown = false;
		}
	    waitForIndexer();
    }
}

ContentManager.prototype.openoriginal = function(){
    linker.cache.ConceptCache = [];
    linker.cache.SemanticTypeCache = [];
    linker.processWindow.currentcacheelt = null;
    linker.processWindow.currentcacheelt = new linker.subject.CacheElement("");
    this.cache = linker.processWindow.currentcacheelt;
    linker.parsing.clearNodeQueue();
    linker.indexing.clearTextQueue();
    linker.parsing.init();  
    linker.indexing.indexed = false;  
    linker.parsing.parsed = true;
    linker.indexing.queryLength = this.text.length;	
	this.resetTexts();
	linker.indexing.indexed = false;
	linker.parsing.indexNode(this.texteditor);
	for (var f=0; f<linker.processWindow.currentcacheelt.fingerprints.length; f++) {
    	linker.processWindow.currentcacheelt.fingerprints[f].shown = false;
	}
	this.clearRelations();
    waitForIndexer();
}

ContentManager.prototype.select = function(){
	if ( this.modified ){
		this.action = SELECT;
		if ( confirm( "Do you want to save changes?" ) ){
			this.save();
		}
		else{
			this.modified = false;
			this.executeAction();
		}
	}
	showPmidsDialog( this.pmids );	
}

function changePmidSelection(){
	var pmidSelect = linker.processDocument.getElementById("wikifier-pmidselect");
	linker.processDocument.getElementById("wikifier-pmid-ok-button").disabled = (pmidSelect.selectedIndex == -1);	
}

function openPmidSelection(){
	var pmidSelect = linker.processDocument.getElementById("wikifier-pmidselect");
	cm.currentpmid = pmidSelect.options[pmidSelect.selectedIndex].text;
	cm.relation    = document.getElementById("relation").value;
	cm.processWindow.open( cm.processDocument.location.href.split("?")[0] + "?relation=" + cm.relation + "&annotator=" + cm.annotator + "&selected=" + cm.currentpmid + "&pmids=" + cm.pmids, "_self" );			
}

ContentManager.prototype.next = function(){
	if ( this.modified ){
		this.action = NEXT;
		if ( confirm( "Do you want to save changes?" ) ){
			this.save();
		}
		else{
			this.modified = false;
			this.executeAction();
		}
	}
	else{
		this.pmids       = document.getElementById("pmids").value.split(",");
		this.currentpmid = document.getElementById("selectedPmid").innerHTML;
		this.annotator   = document.getElementById("annotator").innerHTML;
		this.relation    = document.getElementById("relation").value;
		for ( var i = 0 ; i < ( this.pmids.length - 1 ); i++ ){
			if ( this.pmids[i] === this.currentpmid ){
				this.processWindow.open( this.processDocument.location.href.split("?")[0] + 
						"?relation=" + this.relation + "&annotator=" + this.annotator + "&selected=" + this.pmids[i+1] + "&pmids=" + this.pmids, "_self" );			
			}
		}
	}
}

function backButton(){
	if ( cm.modified ){
		cm.action = NONE;		
		if ( confirm( "Do you want to save changes?" ) ){
			cm.save();
		}
	}
}

ContentManager.prototype.previous = function(){
	if ( this.modified ){
		this.action = PREVIOUS;		
		if ( confirm( "Do you want to save changes?" ) ){
			this.save();
		}
		else{
			this.modified = false;
			this.executeAction();
		}
	}
	else{
		this.pmids = document.getElementById("pmids").value.split(",");
		this.currentpmid = document.getElementById("selectedPmid").innerHTML;
		this.annotator = document.getElementById("annotator").innerHTML;
		this.relation = document.getElementById("relation").value;
		for ( var i = 1 ; i < ( this.pmids.length ); i++ ){
			if ( this.pmids[i] === this.currentpmid ){
				this.processWindow.open( this.processDocument.location.href.split("?")[0] + 
						"?relation=" + this.relation + "&annotator=" + this.annotator + "&selected=" + this.pmids[i-1] + "&pmids=" + this.pmids, "_self" );			
			}
		}
	}
}

ContentManager.prototype.executeAction = function(){
	if ( cm.action == NEXT ){
		cm.next();
	}
	else if ( cm.action == PREVIOUS ){
		cm.previous();
	}
	else if ( cm.action == SELECT ){
		cm.select();
	}
	cm.action = NONE;	
}

ContentManager.prototype.saveCallback = function(data,status){
	var response = unescape( data );
	var responseObj = eval( '(' + response + ')' );
	if ( responseObj.status === "FILEEXISTS" ){
		overwrite = confirm( "Overwrite existing file?" );
		this.save();
	}
	
	cm.executeAction();
}

ContentManager.prototype.save = function(){
	save( this.currentpmid, escape(this.stringify()), true, this.saveCallback );
	this.modified = false;
}

ContentManager.prototype.getSelectionText = function(){
	return this.getClipboard();
}

ContentManager.prototype.getClipboard = function(){
	var txt = (this.processWindow.getSelection) ? this.processWindow.getSelection() : ( (this.processDocument.selection) ? this.processDocument.selection.createRange() : "" );
    if ("undefined" !== typeof txt.text){
        txt = txt.text;
	}	
	return txt.toString();	
}

ContentManager.prototype.isValidName = function(text){
	for ( i = 0 ; i < text.length ; i++ ){
		if ( isalnum( text.charAt(i) ) ){
			return true;
		}
	}
	return false;
}

ContentManager.prototype.setSelectionText = function(node){
	var startPoint = 0;
	var endPoint   = this.text.length;

	/* first check if we are dealing with selection of an existing concept that is shown */
	if ( node != null ){
		this.selectedText = getText( node, null );
	}
	
	/* or with a click on something that has not yet been selected */
	else{
		/* check if the clipboard is set; this selects a field that is selected on a double click */
		this.selectedText = this.getClipboard();
		
		
		/* check if the clipboard was set; else expand the word around the current click */
		if ( this.selectedText == "" ){
			var range    = this.doGetCaretPosition();
			var absCaret = this.getAbsoluteCaret2(range.startContainer,range.startOffset);
			
			if ( ( absCaret >= 0 ) && ( absCaret < this.text.length ) ){
	
				for ( var i = absCaret ; i >= 0 ; i = i - 1 ){
					if ( ! isalnum( this.text.charAt(i) ) ){
						startPoint = i+1;
						break;
					}
				}
				for ( var i = absCaret ; i < cm.text.length ; i = i + 1 ){
					if ( ! isalnum(this.text.charAt(i) ) ){
						endPoint = i;
						break;
					}
				}
				
				this.selectedText = this.text.substring( startPoint, endPoint ); 
			}
			else{
				this.selectedText = "";
				return this.selectedText;
			}
		}
		else{
			this.selectedText = this.getClipboard();
		}
	}
	
	if ( this.isValidName( this.selectedText ) == false ){
		this.selectedText = "";
	}
	return this.selectedText;
}

ContentManager.prototype.setClipboard = function(s){
	Copied = this.texteditor.createTextRange();
	Copied.execCommand("Copy");

	if( window.clipboardData && clipboardData.setData ){
		clipboardData.setData("Text", s);
	}
	else{
		// You have to sign the code to enable this or allow the action in about:config by changing
		user_pref("signed.applets.codebase_principal_support", true);
		netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');

		var clip = Components.classes['@mozilla.org/widget/clipboard;[[[[1]]]]'].createInstance(Components.interfaces.nsIClipboard);
		
		if (!clip) return;

		// create a transferable
		var trans = Components.classes['@mozilla.org/widget/transferable;[[[[1]]]]'].createInstance(Components.interfaces.nsITransferable);
		if (!trans) return;

		// specify the data we wish to handle. Plaintext in this case.
		trans.addDataFlavor('text/unicode');

		// To get the data from the transferable we need two new objects
		var str = new Object();
		var len = new Object();

		var str = Components.classes["@mozilla.org/supports-string;[[[[1]]]]"].createInstance(Components.interfaces.nsISupportsString);

		var copytext=meintext;

		str.data=copytext;

		trans.setTransferData("text/unicode",str,copytext.length*[[[[2]]]]);

		var clipid=Components.interfaces.nsIClipboard;

		if (!clip) return false;

		clip.setData(trans,null,clipid.kGlobalClipboard);	   
	}
}


var text_pattern = /\r|\n/g;
var html_pattern = /<\/?[^>]*>/g;

function getBodyText(node,ref) {
    var s = "";

    for (var i=0; i < node.childNodes.length; ++i) {
    	if ( node.childNodes[i] == ref ){
    		break;
    	}
        s += getText(node.childNodes[i],ref);
    }

    return s;

}
function getText(node, ref) {
    if (null === node)
        return "";

    switch (node.nodeType) {
        case 2:
        case 3:
        case 4:
            return node.nodeValue || "";

        case 7:
        case 8:
            return "";

        case 9:
        case 10:
            return getBodyText(node.body,ref);

        default:
            if (node.ownerDocument && (node === node.ownerDocument.body))
                return getBodyText(node,ref);

            if ("undefined" != typeof node.textContent)
                return node.textContent;

            if ("undefined" != typeof node.innerText)
                return node.innerText.replace(text_pattern,"");

            if ("undefined" != typeof node.innerHTML)
                return node.innerHTML.replace(html_pattern,"").replace(text_pattern,"");

            return "";
    }
}

ContentManager.prototype.getAbsoluteCaret = function(widget,caret){
	this.texteditor.focus();
	var text = getBodyText(this.texteditor,widget)
	return text.length + caret;
}

ContentManager.prototype.getAbsoluteCaret2 = function(el,caret){
	var elOffset = GetIndexOffset(el);
	var teOffset = GetIndexOffset(this.texteditor);
	var pos = elOffset - teOffset + caret
	return pos;
}

// Test for letters and digits
function isAlnum(aChar){
   return (isDigit(aChar) || isAlpha(aChar));
}
// Test for digits
function isDigit(aChar){
   myCharCode = aChar.charCodeAt(0);
   return ((myCharCode > 47) && (myCharCode <  58));
}
// Test for letters (only good up to char 127)
function isAlpha(aChar){
   myCharCode = aChar.charCodeAt(0);

   return (((myCharCode > 64) && (myCharCode <  91)) || ((myCharCode > 96) && (myCharCode < 123)));
}

ContentManager.prototype.doGetCaretPosition = function() {
	range = getSelectionRange( this.processWindow );
	return range;
}

function getSelectionRange(oWin){
	var oSel = getSelectionObject(oWin);
	var oRng;
	if (_getWindow(oWin).document.all){
		if (oSel != null){
			oRng = oSel.createRange();
		}
	} else {
		if ( oSel != null ){
			oRng = oSel.getRangeAt(oSel.rangeCount - 1).cloneRange();
		}
	}
	return oRng;
}

function _getWindow(oWindow){
   if (!oWindow) return window;
   else return oWindow;
}

function getSelectionObject(oWin){
	if (oWin.getSelection){
		return oWin.getSelection();
	}
	else if (oWin.document.getSelection){
		return oWin.document.getSelection();
	}
	else if (oWin.document.selection){
		return oWin.document.selection;
	}
}


ContentManager.prototype.expandSelection = function(){
}

ContentManager.prototype.setPositionsTextArea = function(){
	if( this.processDocument.getSelection() ){
		// The current selection
		var range = this.processDocument.selection.createRange();
		// We'll use this as a 'dummy'
		var stored_range = range.duplicate();
		// Select all text
		stored_range.moveToElementText( this.texteditor );
		// Now move 'dummy' end point to end point of original range
		stored_range.setEndPoint( 'EndToEnd', range );
		// Now we can calculate start and end points
		this.texteditor.selectionStart = stored_range.text.length - range.text.length;
		this.texteditor.selectionEnd = this.texteditor.selectionStart + range.text.length;
	}
}

ContentManager.prototype.refresh = function(){
    linker.parsing.init();
    linker.processWindow.currentcacheelt.highlightnodesByFp = [];
    linker.processWindow.currentcacheelt.highlightnodes = [];
    linker.parsing.getIndexOffset(this.texteditor);
}

/*
 * 
 */
ContentManager.prototype.show = function(){
    linker.parsing.clearNodeQueue();
    linker.indexing.clearTextQueue();
    linker.parsing.init();  
    linker.indexing.indexed = false;  
    linker.parsing.parsed = true;
    
	this.refresh();
	var textfields = getElementsByClassName( this.processDocument, "div", "indexable" );
	for ( var i = 0 ; i < textfields.length ; i++ ){
		textfields[i].innerHTML = encode( this.originalTexts[i] );
	}
	
	for (var f=0; f<linker.processWindow.currentcacheelt.fingerprints.length; f++) {
    	linker.processWindow.currentcacheelt.fingerprints[f].positions = null;
    	linker.processWindow.currentcacheelt.fingerprints[f].shown = false;
    	linker.processWindow.currentcacheelt.fingerprints[f].setOffset(linker.processWindow.currentcacheelt.fingerprints[f].offset);
        linker.subject.FingerprintInit(linker.processWindow.currentcacheelt.fingerprints[f]);
    }
	
	if ( cm.loadedFromDisk == false ){
		this.collectRelations();
		this.clearRelations();
	}
	
	linker.highlighting.ShowConcepts(0);
 
	waitForShown();
}

/*
 * This method waits for the Knewco linker code to have all fingerprints shown. After that, the relations
 * will be shown and the coloring will be set.
 */
function waitForShown(){
	var allShown = true;
	for ( var f = 0 ; f < linker.processWindow.currentcacheelt.fingerprints.length ; f++ ){
		if ( linker.processWindow.currentcacheelt.fingerprints[f].shown == false ){
			allShown = false;
			break;
		}
	}
	if ( allShown ){
		cm.showRelations();
		linker.highlighting.setColoring();
		cm.loadedFromDisk = false;
	}
	else {
		setTimeout(waitForShown, 500);
	}
} 

ContentManager.prototype.clearRelations = function(){
	tables = getElementsByClassName( document, "table", "pairs" );
	
	for ( var i = 0 ; i < tables.length ; i++ ){
		this.clearRelation(tables[i]);
	}
}

ContentManager.prototype.clearRelation = function(table){
	if ( table == null ){
		table = this.processDocument.getElementById("pairs");
	}
	
	for ( var i = (table.rows.length-1) ; i >= 0 ; i-- ){
		table.deleteRow(i);
	}
}

ContentManager.prototype.stringifyWord = function( word ){
	return '{"pos":'+word.pos+',"len":'+word.len+',"clid":'+word.clid+'}';
};

ContentManager.prototype.getSemanticTypeId = function( semanticTypeName ){
	for ( var i = 0 ; i < SemanticTypeCache.length ; i++ ){
		if ( SemanticTypeCache[i] === semanticTypeName ){
			return i;
		}
	}	
	return -1;
}

ContentManager.prototype.stringifySemanticTypes = function( semanticTypes ){
	var res = "";
	for ( var i = 0 ; i < semanticTypes.length ; i++ ){
		if ( i > 0 ){
			res += ",";
		}
		//res += '{"semTypeId":' + this.getSemanticTypeId(semanticTypes[i]) + ',"semTypeName":"' + semanticTypes[i] + '"}'
		res += '"' + semanticTypes[i] + '"';
	}
	return '[' + res + ']';
}

ContentManager.prototype.stringifyInfo = function( info, conceptname ){
	return '{' + 
				'"name":"'           + conceptname.replace( '"', '\"' ) + '",' +
				'"definition":"'     + info.definition + '",' +
				'"mappedFromName":"' + info.mappedFromName.replace( '"', '\"' ) + '",' +
				'"mappedFromId":"'   + info.mappedFromId + '",' +
				'"semanticTypes":'   + this.stringifySemanticTypes( info.semanticTypes ) +
			'}';
}

ContentManager.prototype.stringifyConcept = function( concept ){
	var res = "";
	var info = "";
	var preferred = 'false';
	
	for ( var i = 0 ; i < concept.words.length ; i++ ){
		if ( i > 0 ){
			res += ",";
		}
		res += this.stringifyWord( concept.words[i] );
	}
	
	info = this.stringifyInfo( concept.info, concept.name() );
	
	try{
		if ( concept.preferred ){
			preferred = 'true';
		}
	}
	catch(e){}
	
	return '{' + '"id":"'       + concept.id + '",' +
		         '"rank":'      + concept.rank + ',' +
		         '"info":'      + info + ',' +
		         '"preferred":' + preferred + ',' +
		         '"words":'     + '[' + res + ']' +
		   '}';
}

ContentManager.prototype.stringifyFingerprint = function( fp ){
	var res = "";
	
	for ( var i = 0 ; i < fp.concepts.length ; i++ ){
		if ( i > 0 ){
			res += ",";
		}
		res += this.stringifyConcept( fp.concepts[i] );
	}
	return '"concepts":[' + res + '],"offset":' + fp.offset;
}

ContentManager.prototype.stringify = function(){
	var table = document.getElementById( "sentences" );
	var res = "";
	for ( var r = 0 ; r < table.rows.length ; r++ ){
		text = decode( linker.parsing.getText( table.rows[r].cells[0].childNodes[0] ) );
		relations = ""; 
		for ( var t = 0 ; t < table.rows[r].cells[1].childNodes[0].rows.length ; t++ ){
			if ( t > 0 ){
				relations += ",";
			}
			var w = table.rows[r].cells[1].childNodes[0].rows[t].cells[0].childNodes[0];
			var rel = table.rows[r].cells[1].childNodes[0].rows[t].cells[2].childNodes[0];
			var type = rel.options[rel.selectedIndex].value;
			relations += '{"relation":"' + w.id + '","value":"' + type + '","checked":' + w.checked.toString() + '}'; 
		}
		if ( res.length > 0 ){
			res += ",";
		}
		res += '{"text":' + JSON.stringify( text ) + ',"relations":[' + relations + ']}';
	}
	//this.stringifyRelations();
	var result = '{"cache":' + this.stringifyCache() + ',"sentences":[' + res + ']}';
	return result;
}

ContentManager.prototype.stringifyCache = function(){
	var res = "";
	for ( var i = 0 ; i < this.cache.fingerprints.length ; i++ ){
		if ( i > 0 ){
			res += ",";
		}
		res += "{" + this.stringifyFingerprint( this.cache.fingerprints[i] ) + "}";
	}
	return '{"fingerprints":' + '[' + res + '],"page":"' + this.cache.page + '","offset":' + this.cache.offset + '}';
}

ContentManager.prototype.initCache = function(cache){
	var cacheElt = new linker.subject.CacheElement( cache.page );
	try{
		cacheElt.fingerprints = cache.fingerprints;

		for ( var i = 0 ; i < cacheElt.fingerprints.length ; i++ ){
			linker.subject.FingerprintInit( cacheElt.fingerprints[i] );
			
			/* correct the concept index */
			var tmpConcepts = cacheElt.fingerprints[i].concepts;
			for ( var c = 0 ; c < tmpConcepts.length ; c++ ){
				cache.fingerprints[i].concepts[tmpConcepts[c].id] = tmpConcepts[c];
			}
		}
	}
	catch(e){
		WriteDebugLine( "cache structure error: " + e );
	}
	
	return cacheElt;
}

ContentManager.prototype.instantiate = function(jsonString){
	try{
		var cacheObj = eval( '(' + jsonString + ')' );
	}
	catch(e){
		WriteDebugLine( "JSON error: " + e );
	}
	
	return this.initCache(cacheObj.cache);
}

function isSuppressedConcept(concept){
	var semanticgroups = concept.semanticgroups();
	for ( var i = 0 ; i < semanticgroups.length ; i++ ){
		if ( IsSuppressedSemType(semanticgroups[i]) || ( semanticgroups[i] === "None" ) ){
			return true;
		}
	}
	return false;
}

function sortOnId(a,b){
	if ( a.id === b.id ){
		return 0;
	}
	else if ( a.id > b.id ){
		return 1
	}
	else{
		return -1;
	}
}

function IsValidCombination( semtypes1, semtypes2 ){
	try{
		for ( var i = 0 ; i < semtypes1.length ; i++ ){
			for ( var j = 0 ; j < semtypes2.length ; j++ ){
				if ( ( ( semtypes1[i] == "Chemicals & Drugs"    && semtypes2[j] == "Diseases & Disorders" ) ) ||
					 ( ( semtypes1[i] == "Chemicals & Drugs"    && semtypes2[j] == "Genes & Molecular Sequences" ) ) ||
					 ( ( semtypes1[i] == "Genes & Molecular Sequences" && semtypes2[j] == "Diseases & Disorders" ) ) ||
					 ( ( semtypes1[i] == "SNP & Sequence variations" && semtypes2[j] == "Diseases & Disorders" ) ) ||
					 ( ( semtypes1[i] == "SNP & Sequence variations" && semtypes2[j] == "Chemicals & Drugs" ) ) ){
					 	return true
			    }
			}
		}
	} catch(e){
		linker.log.WriteDebugLine( "IsValidCombination(): problem combining " + i + " and " + j );
	}
	return false;
}

function SemTypesToString( semtypes ){
	var result = "";
	try{
		for ( var i = 0 ; i < semtypes.length ; i++ ){
			if ( i > 0 ){
				result += ","
			}
			result += semtypes[i];
		}
	}
	catch (e){
		linker.log.WriteDebugLine( "SemTypesToString(): problem generating string" );
	}
	return result;
}


ContentManager.prototype.printRelations = function(){
	linker.log.WriteDebugLine( "printRelations():");
	for ( var i = 0 ; i < cm.relationInfo.length ; i++ ){
		linker.log.WriteDebugLine( "	id      = " + cm.relationInfo[i].id );
		linker.log.WriteDebugLine( "		source  = " + cm.relationInfo[i].source );
		linker.log.WriteDebugLine( "		target  = " + cm.relationInfo[i].target  );
		linker.log.WriteDebugLine( "		value   = " + cm.relationInfo[i].value );
		linker.log.WriteDebugLine( "		checked = " + cm.relationInfo[i].checked );
	}
	linker.log.WriteDebugLine( "end printRelations()");
}

/*
 * This method collects all the potential relations and retrieves from the window the information
 * set by the user. 
 */
ContentManager.prototype.collectRelations = function(){
	/*
	 * construct all the possible co-occurrence pairs of concepts per sentence
	 */
	var tables = getElementsByClassName( document, "table", "pairs" );
	
	var sentenceConcepts = new Array(tables.length);
	for ( var i = 0 ; i < sentenceConcepts.length ; i++ ){
		sentenceConcepts[i] = new Array();
	}

	for ( var f = 0 ; f < this.cache.fingerprints.length ; f++ ){
		for ( var c = 0 ; c < this.cache.fingerprints[f].concepts.length ; c++ ){
			for ( var w = 0 ; w < this.cache.fingerprints[f].concepts[c].words.length ; w++ ){
				for ( var s = startPositions.length - 1 ; s >= 0 ; s-- ){
					if ( startPositions[s] <= this.cache.fingerprints[f].concepts[c].words[w].pos ){
						found = false;
						for ( var l = sentenceConcepts[s].length ; l > 0 ; l-- ){
							for ( var ww = 0 ; ww < sentenceConcepts[s][l-1].words.length ; ww++ ){
								if ( sentenceConcepts[s][l-1].words[ww].pos == this.cache.fingerprints[f].concepts[c].words[w].pos ){
									found = true;
									break;
								}
							}
						}
						if ( ! found ){
							sentenceConcepts[s][sentenceConcepts[s].length] = this.cache.fingerprints[f].concepts[c];						}
						break;
					}
				}
			}
		}
	}
	
	this.relationInfo = [];

	for ( var s = 0 ; s < sentenceConcepts.length ; s++ ){	
		for ( var p = 0 ; p < sentenceConcepts[s].length ; p++ ){
			var concept1 = sentenceConcepts[s][p];
			var semtypes1 = concept1.semanticgroups()

			if ( ! isSuppressedConcept(concept1) ){
	
				for ( var c2 = 0 ; c2 < sentenceConcepts[s].length ; c2++ ){
					
					var concept2 = sentenceConcepts[s][c2];
					
					/*
					 * Check if concept1 and concept2 form a pair that fits:
					 * drug-disease, 
					 * drug-gene, 
					 * gene-disease
					 */
	
					var semtypes2 = concept2.semanticgroups();
					if ( IsValidCombination( semtypes1, semtypes2 ) ){ 
						if ( ! isSuppressedConcept(concept2) ){
							if ( concept1.id == concept2.id ){
								continue;
							}
							
							var found = false;
							for ( var i = 0 ; i < this.relationInfo.length ; i++ ){
								found = ( this.relationInfo[i].row == s ) && ( this.relationInfo[i].source == concept1.id ) && ( this.relationInfo[i].target == concept2.id );
								if ( found ){
									break;
								}
							}
							
							if ( ! found ){
								this.relationInfo[this.relationInfo.length] = { 'id': s + '_' + concept1.id + '_' + concept2.id, 'row': s, 'source': concept1.id, 'target': concept2.id, 'value' : 'PA', 'checked': true };
							}
						}
					}
				}
			}
		}

		/*
		 * collect information from the screen and adjust the internal data structure for this
		 */
		var relations = getElementsByClassName( document, "*", "relation" );

		for ( var i = 0 ; i < relations.length ; i++ ){
			var pieces = relations[i].id.split("_");
			var relationType = this.processDocument.getElementById( relations[i].id.replace( "_tr", "_type" ) );
			var relationCheck = this.processDocument.getElementById( relations[i].id.replace( "_tr", "_cb" ) );
			for ( var j = 0 ; j < this.relationInfo.length ; j++ ){
				if ( this.relationInfo[j].source == pieces[1] && this.relationInfo[j].target == pieces[2] ){
					this.relationInfo[j].value   = relationType.options[relationType.selectedIndex].value;
					this.relationInfo[j].checked = relationCheck.checked;
				}
			}
		}

	}
	
}

ContentManager.prototype.getConceptById = function( id )
{
	for ( var f = 0 ; f < this.cache.fingerprints.length ; f++ )
	{
		for ( var c = 0 ; c < this.cache.fingerprints[f].concepts.length ; c++ )
		{
			if ( this.cache.fingerprints[f].concepts[c].id == id )
			{
				return this.cache.fingerprints[f].concepts[c];
			}
		}
	}
	return None;
}

function setSave(){
	cm.modified = true;
}

function getConceptName( row, concept ){
	var startPos = startPositions[row];
	var endPos   = Number.MAX_VALUE;

	if ( (row + 1) < startPositions.length ){
		endPos = startPositions[row+1];
	}
	
	/* collect all clids */
	var clids = [];
	for ( var w = 0 ; w < concept.words.length ; w++ ){
		var found = false;
		for ( var i = 0 ; i < clids.length ; i++ ){
			if ( clids[i] == concept.words[w].clid ){
				found = true;
				break;
			}
		}
		if ( ! found ){
			clids[clids.length] = concept.words[w].clid;
		}
	}
	
	var res = "";
	var terms = [];
	for ( var i = 0 ; i < clids.length ; i++ ){
		var bpos     = Number.MAX_VALUE;
		var epos     = Number.MIN_VALUE;
		
		for ( var w = 0 ; w < concept.words.length ; w++ ){
			if ( clids[i] == concept.words[w].clid ){
				bpos = Math.min( concept.words[w].pos, bpos );
				epos = Math.max( concept.words[w].pos + concept.words[w].len, epos );
			}
		}
		var term = cm.originalTexts[row].substring(bpos-startPositions[row],epos-startPositions[row]);
		var found = false;
		if ( term.length > 0 ){
			for ( var t = 0 ; t < terms.length ; t++ ){
				if ( terms[t] == term ){
					found = true;
					break;
				}
			}
			if ( ! found ){
				terms[terms.length] = term;
			}
		}
	}
	return terms.join( " / ");
}

/*
 * This routine displays the information contained in the internal 'relationInfo' data structure
 * in the tables on screen.
 */
ContentManager.prototype.showRelations = function(){
	
	var relationTypes = [
	                 	{'short':'PA',    'description':'Positive association'},
	                 	//{'short':'PAG',   'description':'Agonist'},
	                 	//{'short':'PAPG',  'description':'Partial Agonist'},
	                 	//{'short':'PAAG',  'description':'Antagonist'},
	                 	//{'short':'PAPAG', 'description':'Partial Antagonist'},
	                 	//{'short':'PAIG',  'description':'Inverse agonist'},
	                 	//{'short':'PAPAM', 'description':'Positive allosteric modulator'},
	                 	//{'short':'PANAM', 'description':'Negative allosteric modulator'},
	                 	//{'short':'PAAAM', 'description':'Ago-allosteric modulator'},
	                 	//{'short':'PAGEI', 'description':'Gene expression inhibitor'},
	                 	//{'short':'PAGEIN','description':'Gene expression inducer'},
	                 	{'short':'NA',    'description':'Negative association'},
	                 	{'short':'SA',    'description':'Speculative association'},
	                 	//{'short':'UA','description':'Under-specified association'},
	                 	];

	var tables = getElementsByClassName( document, "table", "pairs" );

	for ( var i = 0 ; i < this.relationInfo.length ; i++ ){	
		var concept1    = this.getConceptById( this.relationInfo[i].source );
		var concept2    = this.getConceptById( this.relationInfo[i].target );

		var row         = tables[this.relationInfo[i].row].insertRow(-1);
		row.id          = this.relationInfo[i].id + "_tr";
		row.className   = "relation"

		var check       = row.insertCell(0);
		check.width     = "10%";
		check.id        = this.relationInfo[i].id;
		
		var selectValue = this.relationInfo[i].value;
			
		if ( this.relationInfo[i].checked ){
			check.innerHTML = "<input id='" + this.relationInfo[i].id + "_cb' type='checkbox' checked='true' onclick='setSave();'/>";
		}
		else{
			check.innerHTML = "<input id='" + this.relationInfo[i].id + "_cb' type='checkbox' onclick='setSave();'/>";
		}

		var left = row.insertCell(1);
		left.width = "30%";
		left.innerHTML = "<font title='" + concept1.name() + "' class='" + linker.highlighting.getSemanticTypeClassName(concept1) + "-node'>" + 
						 getConceptName(this.relationInfo[i].row, concept1 ) + "</font>";
		var middle = row.insertCell(2);
		middle.width = "30%";
		
		var selectHtml = '';
		for ( var j = 0 ; j < relationTypes.length ; j++ ){
			if ( relationTypes[j].short == selectValue ){
				selectHtml += '<option value="' + relationTypes[j].short + '" selected="selected">' + relationTypes[j].description + '</option>';
			}
			else{
				selectHtml += '<option value="' + relationTypes[j].short + '">' + relationTypes[j].description + '</option>';
			}
		}
		
		middle.innerHTML = '<select id="' + this.relationInfo[i].id + '_type" name="relation" onchange="setSave();">' + selectHtml + '</select>';

		var right = row.insertCell(3);
		right.width = "30%";
		right.innerHTML = "<font title='" + concept2.name() + "' class='" + linker.highlighting.getSemanticTypeClassName(concept2) + "-node'>" + 
						  getConceptName( this.relationInfo[i].row,concept2 ) + "</font>";
	}	
}	

ContentManager.prototype.stringifyRelations = function(){
	var tables = getElementsByClassName( this.processDocument, "table", "pairs" );
	var res = "";

	for ( var t = 0 ; t < tables.length ; t++ ){
		for ( var r = 0 ; r < tables[t].rows.length ; r++ ){
			if ( r > 0 ){
				res += ",";
			}
			var w = tables[t].rows[r].cells[0].childNodes[0];
			res += '{"relation":"' + w.id + '","checked":' + w.checked.toString() + '}'; 
		}
	}
	
	return res;
}

function save( filename, data, overwrite, callback ){
	var request = GetXMLHttpRequest();
	var url = HOST + "/save.py";
	
	request.onreadystatechange = function(){
		if (request.readyState==4 ){
			if ( request.status == 200){
				var text = request.responseText;
				callback( request.responseText, request.status );
			}
			else{
				linker.log.WriteDebugLine( "response = " + request.responseText );
				alert( "Communication failure with server");
			}
		}
	};

	request.open( "POST", url, true );
	request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");      
	
	var annotator = document.getElementById("annotator").innerHTML;
	postdata = "filename=" + filename + "&data=" + data + "&overwrite=" + overwrite + "&annotator=" + annotator;
 	request.send( postdata );
}

function GetXMLHttpRequest(){
	var req = null;
    if (window.ActiveXObject){
	    var msxmls = new Array( 'Msxml2.XMLHTTP.5.0','Msxml2.XMLHTTP.4.0','Msxml2.XMLHTTP.3.0','Msxml2.XMLHTTP','Microsoft.XMLHTTP');
	    for (var i = 0; i < msxmls.length; i++) {
	      try {
	        req = new ActiveXObject(msxmls[i]);
	        return req;
	      } catch (e) {
	      }
    	}
	}
	else if (window.XMLHttpRequest) {
    	try {
			req = new XMLHttpRequest();
			if (req.overrideMimeType) {
				req.overrideMimeType('text/xml');
			}
        } catch(e) {
			req = null;
        }
    } 
    
    return req;
}

