var SELECT = 1;
var CLIPBOARD = 2;
var ownConcepts = 0;
var cm = null;
var menuShown = false;
var IEplugin = false;

function closeFileSelection(){
	linker.processDocument.getElementById("wikifier-fileselection-container").style.display = "none";
}

function openFileSelection(){
	closeFileSelection();
	var fileSelect = linker.processDocument.getElementById("wikifier-select");
	cm.open(fileSelect.options[fileSelect.selectedIndex].text );
}

function changeFileSelection(){
	var fileSelect = linker.processDocument.getElementById("wikifier-select");
	linker.processDocument.getElementById("wikifier-ok-button").disabled = (fileSelect.selectedIndex == -1);	
}

function showFileSelectionDialog(files){
	var container = null;
	
	container = linker.processDocument.getElementById("wikifier-fileselection-container");
	if ( container == null ){
		var container = linker.processDocument.createElement("div");
	    container.id = "wikifier-fileselection-container";
	    container.className = "wikifier-fileselection-container";
	    container.style.display = "none";
	    container.style.width = "400px";
	    container.style.position = "absolute";
	    container.style.backgroundColor = "#fff";  
	    linker.processDocument.body.appendChild(container);
	
	    var contents = linker.processDocument.createElement("div");
	    contents.id = "wikifier-fileselection-contents";
	    container.appendChild(contents);
		
	    var topmenu = linker.processDocument.createElement("div");
	    topmenu.className = "wikifier-button-menu-top";
	    contents.appendChild(topmenu);
	
	    var closebtn = linker.processDocument.createElement( "img" );
	    closebtn.popup = container;
	    linker.utils.addEvent(closebtn,'click',closeFileSelection);
	    closebtn.src = linker.wikifypath("img/close.gif");
	    closebtn.className = "wikifier-closemenu";
	    topmenu.appendChild( closebtn );	
	
	    var topspan = linker.processDocument.createElement( "div" );
	    topspan.className = "wikifier-close-span";
	    topspan.style.width = "180px";
	    topmenu.appendChild(topspan);
	
	    var h4 = linker.processDocument.createElement("div");
	    h4.id = "wikifier-title-definition";
	    h4.innerHTML = "Select annotation file:";
	    h4.className = "wikifier-turquoise";
	    h4.style.width = "175px";
	    topspan.appendChild(h4);
	
	    var middlemenu = linker.processDocument.createElement("div");
	    middlemenu.className = "wikifier-button-fileselection-middle";
	    contents.appendChild(middlemenu);
	
		var center = linker.processDocument.createElement("center");
		middlemenu.appendChild(center);
		
	    var fileSelect = linker.processDocument.createElement("select");
	    fileSelect.style.width = "360px";
	    fileSelect.className = "wikifier-select";
	    fileSelect.id = "wikifier-select";
	    fileSelect.size = 10;
	    linker.utils.addEvent(fileSelect,'change',changeFileSelection);
	    center.appendChild( fileSelect );
	    
	  	center.appendChild( linker.processDocument.createElement( "br" ) );
	  	  	
	    var bottommenu = linker.processDocument.createElement("div");
	    bottommenu.className = "wikifier-button-fileselection-bottom";
	    contents.appendChild(bottommenu);
	
	  	var okButton = linker.processDocument.createElement( "button" );
	  	okButton.id = "wikifier-ok-button";
	  	okButton.innerHTML = "OK";
	    linker.utils.addEvent(okButton,'click',openFileSelection);
	  	bottommenu.appendChild( okButton );
	
	  	var cancelButton = linker.processDocument.createElement( "button" );
	  	cancelButton.innerHTML = "Cancel";
	    linker.utils.addEvent(cancelButton,'click',closeFileSelection);
	  	bottommenu.appendChild( cancelButton );
	}
	else{
		var fileSelect = linker.processDocument.getElementById("wikifier-select");
		for ( var i = ( fileSelect.length - 1 ) ; i >= 0 ; i-- ){
			fileSelect.remove( i );
		}
	}

    for ( var i = 0 ; i < files.length ; i++ ){
    	var option =  linker.processDocument.createElement('option');
  		option.text = files[i];
  		try {
    		fileSelect.add(option,null); // standards compliant
    	}
  		catch(e){
    		fileSelect.add(option); // IE only
    	}
  	}
  	
  	linker.processDocument.getElementById("wikifier-ok-button").disabled = true;
	  	
    container.style.display = 'block';

    var containerWidth  = linker.ui.getWidth( linker.processDocument, container );
    var containerHeight = linker.ui.getHeight( linker.processDocument, container ); /* for the definition */
	
	var X = ( linker.ui.pageWidth(linker.processWindow,linker.processDocument) - containerWidth ) / 2;	
	var Y = ( linker.ui.pageHeight(linker.processWindow,linker.processDocument) - containerHeight ) / 2;

    container.style.display = 'none';
    container.style.left = X + 'px';
    container.style.top =  Y + 'px';
    container.style.display = 'block';
    container.style.zIndex = 100;
}

function formLoad(){
	alert( "formLoad()" );
	processText(); 
}

function changeDisplayStyle(elt){
	if ( elt.style.display === "none" )
		elt.style.display = "";
	else
		elt.style.display = "none";
}

function menuIsVisible(){
	try{
		return processDocument.getElementById('wikifier-menu-container').style.display !== 'none';
	} catch(e){
		return false;
	}
}

function clearShown(){
	menuShown = false;
}

function isalnum(ch){ 
	var re = /^[a-zA-Z_0-9]$/;
	return re.test(ch); 
}

function popdown(){
	linker.ui.truepopdown();
	if ( cm.concept != null ){
		cm.removeMarkers();
		cm.concept = null;
	}
	if ( menuShown ){
		self.setTimeout( clearShown, 200 );
	}
}

/*
 * This function will start form a caret and include the heading and trailing font tag and
 * return it as a position struct
 */
function expandSelection( text, pos ){
	startPoint = -1;
	endPoint   = -1;
	for ( var i = pos ; i >= 0 ; i = i - 1 ){
		if ( text.charAt(i) == '<' ){
			startPoint = i;
			break;
		}
	}
	for ( var i = pos ; i < text.length ; i = i + 1 ){
		if ( text.charAt(i)== '>' ){
			endPoint = i+1;
			break;
		}
	}
	position = new Object();
	position.start = startPoint;
	position.end = endPoint;
	return position;
}

function validateInput(){
	var w = document.getElementById("text-edit");
	var a = document.getElementById("analyze-button");
	if ( w != null ){
		if ( w.value.length > 0  ){
			a.disabled = false;
		}
	}
}

function processText(){
	linker.log.WriteDebugLine( "processText()" );
    linker.ui.addMenu = addSDAMenu;
    linker.ui.popupShow = popupOnConcept;
    linker.ui.ContextShow = ContextShowSDA;
    linker.ui.getContentWindow = function(){return window;};
    linker.highlighting.removeColoring = function(){};
	linker.init( window );
	linker.is_wikify = true;
    linker.is_wikifyplugin = false;
    linker.ui.addMenu();
    linker.ui.insertStyle();
    window.initialized = true;	    
	initContext();
}

function initContext(){
    cm = new ContentManager();
	cm.init(window);
	cm.process();
}

function Contains(a,b){
	for ( var i = 0 ; i < b.length ; i = i + 1 ){
		if ( a == b[i] ){
			return true;
		}
	}
	return false;
}

/*
 * override of function to determine which semantic types should be shown
 */
function IsSuppressedSemType( semtype ){    
	var suppressed = true;
	if ( semtype == "Behavior & Activity" || semtype == "Behavior &amp; Activity" ){
        suppressed = ! linker.processDocument.getElementById('wikifier-behavior').checked;
    }
    else if ( semtype == "Anatomy" ){
        suppressed = ! linker.processDocument.getElementById('wikifier-anatomy').checked;
    }
    else if ( semtype == "Chemicals & Drugs" || semtype == "Chemicals &amp; Drugs" ){
        suppressed = ! linker.processDocument.getElementById('wikifier-chemicals').checked;
    }
    else if ( semtype == "Diseases & Disorders" || semtype == "Diseases &amp; Disorders" ){
        suppressed = ! linker.processDocument.getElementById('wikifier-diseases').checked;
    }
    else if ( semtype == "Genes & Molecular Sequences" || semtype == "Genes &amp; Molecular Sequences" ){
        suppressed = ! linker.processDocument.getElementById('wikifier-genes').checked;
    }
    else if ( semtype == "Living Beings" ){
        suppressed = ! linker.processDocument.getElementById('wikifier-living').checked;
    }
    else if ( semtype == "Physiology" ){
        suppressed = ! linker.processDocument.getElementById('wikifier-physiology').checked;
    }
    else if ( semtype == "New" ){
        suppressed = ! linker.processDocument.getElementById('wikifier-new').checked;
    }
    else if ( semtype == "Others" ){
        suppressed = ! linker.processDocument.getElementById('wikifier-other').checked;
    }
    else if ( semtype == "None" ){
        suppressed = false;
    }
    else if ( semtype == "null" ){
        suppressed = ! linker.processDocument.getElementById('wikifier-other').checked;
    }
	//linker.log.WriteDebugLine( "IsSuppressedSemType(): semtype = " + semtype + " is suppressed = " + suppressed );    
	return suppressed;	
}

function waitForIndexer(){
	if ( IndexingReady == false ){
		self.setTimeout( waitForIndexer, 200 );
	}
	else{
		cm.setOriginalCache();	
		cm.showRelations();
	}
}

function toggleMode(){
	analyzeElt  = document.getElementById("analyze");
	editElt     = document.getElementById("edit");
	textEditElt = document.getElementById("text-edit");
	textViewElt = document.getElementById("text-view");
		
	analyzeElt.disabled = ! analyzeElt.disabled;
	editElt.disabled    = ! editElt.disabled;
	changeDisplayStyle( textEditElt );
	changeDisplayStyle( textViewElt );
	
	if ( textViewElt.style.display != "none" ){
		processText();
	}
}

function resetFields(){
	analyzeElt  = document.getElementById("analyze");
	editElt     = document.getElementById("edit");
	pmidElt     = document.getElementById("pmid");
	textEditElt = document.getElementById("text-edit");
	textViewElt = document.getElementById("text-view");
	
	pmidElt.value             = "";
	textEditElt.innerHTML     = "";
	textViewElt.innerHTML     = "";
	analyzeElt.disabled       = false;
	editElt.disabled          = true;
	textEditElt.style.display = "default";
	textViewElt.style.display = "none";
}

function tableFocus(){
    try {
        processDocument.body.className = processDocument.body.className.replace(new RegExp("(^|\\s)wikifier-coloring-show($|\\b)", "g"), "");
    } catch(e) {}
	blockedColoring = false;
}

function mouseOverTextArea(){
	linker.highlighting.setColoring();
}

/*
 * function that is called when a semantic type is selected in the popup balloon
 */
function semtypeCallback(event){
	cm.prevCache = cm.stringify();
	linker.highlighting.partHighlight(0,false,false);	
	cm.concept.info.semanticTypes = [this.value];

	var node = null;
	if (!event) var event = window.event;
	event.cancelBubble = true;

    if (event.target){
        var node = event.target;
    }
    else if (event.srcElement){
        var node = event.srcElement;
    }
    if (node.nodeType == 3){ // defeat Safari bug
        node = node.parentNode;
    }

	cm.show();
	cm.setModified(true);
	popdown();
}

/*
 * routine to add menu to the window
 */
function addSDAMenu(){
	linker.log.WriteDebugLine( "addSDAMenu()" );
    if ( linker.processDocument.getElementById( 'wikifier-menu-container' ) === null ){
        var container = linker.processDocument.createElement("div");
        container.id = "wikifier-menu-container";
        container.className = "wikifier-menu-container";
        container.style.display = "none";
        container.style.width = "400px";
        linker.processDocument.body.appendChild(container);

        var contents = linker.processDocument.createElement("div");
        contents.id = "wikifier-menu-contents";
        container.appendChild(contents);

        var addbuttonmenu = linker.processDocument.createElement("div");
        addbuttonmenu.className = "wikifier-button-menu";
        addbuttonmenu.id = "wikifier-add-menu";
        addbuttonmenu.style.display = "none";
        contents.appendChild(addbuttonmenu);

		var selectedSemTypes = linker.processDocument.getElementById("selected-semtypes").childNodes;
		var height = 0;
		for ( var i = 0 ; i < selectedSemTypes.length ; i++ ){
			if ( selectedSemTypes[i].checked ){
				/* don't show the New semantic type in the popup */
				if ( selectedSemTypes[i].name == "New" ){
					continue;
				}

				var buttonmenu = linker.processDocument.createElement("div");
				if ( selectedSemTypes[i].name == "None" ){
		        	buttonmenu.className = "wikifier-button-menu-bottom";
		        }
		        else{
		        	buttonmenu.className = "wikifier-button-menu";
		        }
		        
		        contents.appendChild( buttonmenu );
		        
				var optionSemType   = linker.processDocument.createElement("input");
				optionSemType.type  = "radio";
				optionSemType.name  = "semantic-type";
				optionSemType.id    = selectedSemTypes[i].id + "_radio";
				optionSemType.className  = "semantic-type";
				optionSemType.value = selectedSemTypes[i].name;
				buttonmenu.appendChild( optionSemType );
				linker.utils.addEvent(optionSemType,"click",semtypeCallback);
				var text = linker.processDocument.createElement( "label" );
				text.id = "wikifier-button-menu-text";
				text.style.position = "relative";
				text.style.top = "-4px";
				text.style.cursor = "hand";
				text.id    = selectedSemTypes[i].id + "_label";
				text.value = selectedSemTypes[i].name;				
				buttonmenu.appendChild( text );
				linker.utils.addEvent(text,"click",semtypeCallback);
				text.appendChild( linker.processDocument.createTextNode( selectedSemTypes[i].name ) );
			}
		}
		
		container.style.width = buttonmenu.style.width;
    }
}

function UniquePush( list, elt ){
	for ( var i = 0 ; i < list.length ; i++ ){
		if ( elt == list[i] ){
			return list;
		}
	}
	list.push(elt);
	return list;
}

function getSemanticTypeCheckboxes( concept ){
    var res = new Array();
	if ( concept ){
    	var semanticgroups = concept.semanticgroups();
	}
	else{
		return res;
	}
    for ( var i = 0 ; i < semanticgroups.length ; i++ ){
        switch ( semanticgroups[i] ){
            case "Behavior & Activity": res = UniquePush( res, 'wikifier-behavior_radio' ); break;
            case "Behavior &amp; Activity": res = UniquePush( res, 'wikifier-behavior_radio' ); break;
            case "Anatomy": res = UniquePush( res, 'wikifier-anatomy_radio' ); break;
            case "Chemicals & Drugs": res = UniquePush( res, 'wikifier-chemicals_radio' ); break;
            case "Chemicals &amp; Drugs": res = UniquePush( res, 'wikifier-chemicals_radio' ); break;
            case "Diseases & Disorders": res = UniquePush( res, 'wikifier-diseases_radio' ); break;
            case "Diseases &amp; Disorders": res = UniquePush( res, 'wikifier-diseases_radio' ); break;
            case "Genes & Molecular Sequences": res = UniquePush( res, 'wikifier-genes_radio' ); break;
            case "Genes &amp; Molecular Sequences": res = UniquePush( res, 'wikifier-genes_radio' ); break;
            case "Living Beings": res = UniquePush( res, 'wikifier-living_radio' ); break;
            case "Physiology": res = UniquePush( res, 'wikifier-physiology_radio' ); break;
            case "New": res = UniquePush( res, 'wikifier-new_radio' ); break;
            case "Others": res = UniquePush( res, 'wikifier-other_radio' ); break;
            default: res = UniquePush( res, 'wikifier-none_radio' ); break;
        }        
    }
    return res;
}

function popupOnConcept(event){
	
	linker.log.WriteDebugLine( "popupOnConcept(): start" );
	popdown();

	if (linker.browser.is_ie) {
        event = cm.processWindow.event;
    }
	event.cancelBubble = true;
   	target = event.target;

    rec     = linker.utils.splitIds( target.id );
    fpId    = rec[0];
    cuiList = rec[1];

    cm.concept = null;
    try{
        for ( i = 0 ; i < cuiList.length ; i = i + 1 ){
            cm.concept = cm.cache.fingerprints[fpId].find(cuiList[i]);
            if ( cm.concept.preferred === true ){
                break;
            }
        }
    }catch(e) {
        cm.concept = cm.cache.fingerprints[fpId].find(cuiList[0]);
    }
    
	var elts = getElementsByClassName( linker.processDocument, "input", "semantic-type" );
    for ( var i = 0 ; i < elts.length ; i++ ){
    	elts[i].checked = false;
    }
	var semanticTypeCheckBoxes = getSemanticTypeCheckboxes(cm.concept);
    for ( var i = 0 ; i < elts.length ; i = i + 1 ){
    	for ( var j = 0 ; j < semanticTypeCheckBoxes.length ; j = j + 1 ){
    		if ( semanticTypeCheckBoxes[j] === elts[i].id ){
    			elts[i].checked = true;
    			break;
    		}
    	}
    }
	
	cm.updateMarkers(fpId + "_" + cm.concept.id);
		    
	linker.ui.SetCuiList(cuiList);

	for ( var i = 0 ; i < elts.length ; i = i + 1 ){
		elts[i].concept = cm.concept;
	}

	linker.ui.ContextShow(event,target,"wikifier-menu-container");
}

function popupOnTextSelection(event){
	linker.log.WriteDebugLine( "popupOnTextSelection(): start " );
   	popdown();
	var text = cm.setSelectionText(null);
	
	linker.log.WriteDebugLine( "popupOnTextSelection(): text = " + text );
   	if ( menuShown && ( text.length() == 0 ) ){
		return;
	}
	if (linker.browser.is_ie) {
        event = cm.processWindow.event;
    }
   	target = event.target;

	if ( text.length > 0 ){
		var conceptNameButton = linker.processDocument.getElementById( 'wikifier-title-definition' );
		var elts = getElementsByClassName( linker.processDocument, "input", "semantic-type" );
	    for ( var i = 0 ; i < elts.length ; i++ ){
	    	elts[i].checked = false;
	    }
	
		cm.concept = cm.addConcept( cm.selectedText );
		var f = linker.processWindow.currentcacheelt.fingerprints.length - 1;
		cm.updateMarkers( f + "_" + cm.concept.id );
			
		for ( var i = 0 ; i < elts.length ; i = i + 1 ){
			elts[i].concept = cm.concept;
		}
		
		linker.ui.ContextShow(event,target,"wikifier-menu-container");
	}
}

function ContextShowSDA(event, target, popupName) {
	linker.log.WriteDebugLine( "ContextShowSDA()" );
    // call from the onContextMenu event, passing the event
    // if this function returns false, the browser's context menu will not show up
    // IE is evil and doesn't pass the event object
    try {
        linker.processDocument.getElementById('wikifier-search-container').style.display = 'none';
    } catch(e) {}

    var scrollTop = 0;
    var scrollLeft = 0;
    if (linker.ui.getContentWindow().pageYOffset){ // all except Explorer
        scrollLeft = linker.ui.getContentWindow().pageXOffset;
        scrollTop  = linker.ui.getContentWindow().pageYOffset;
    }
    else if (linker.processDocument.documentElement && linker.processDocument.documentElement.scrollTop){ // Explorer 6 Strict
        scrollLeft = linker.processDocument.documentElement.scrollLeft;
        scrollTop  = linker.processDocument.documentElement.scrollTop;
    }
    else if (linker.processDocument.body){ // all other Explorers
        scrollLeft = linker.processDocument.body.scrollLeft;
        scrollTop = linker.processDocument.body.scrollTop;
    }

    /* position the popup menu in such a way that is shows right */
    var menu = linker.processDocument.getElementById( popupName );
    menu.style.display = 'block';

    var menuWidth  = linker.ui.getWidth( linker.processDocument, menu );
    var menuHeight = linker.ui.getHeight( linker.processDocument, menu ); /* for the definition */

    if ( event.clientX === 0 ){
        var pos = linker.ui.getAbsolutePosition(target);
        var clientX = pos.x + 2 + (target.offsetWidth*0.75) - scrollLeft;
        var clientY = pos.y + (target.offsetHeight*0.5) - scrollTop;
    }
    else{
        var clientX = event.clientX;
        var clientY = event.clientY;
    }

    if ( ( clientX + menuWidth ) > linker.ui.pageWidth(linker.processWindow, linker.processDocument) ){
        var X = clientX - menuWidth;
    }
    else{
        var X = clientX;
    }

    if ( ( clientY + menuHeight ) > linker.ui.pageHeight(linker.processWindow, linker.processDocument) ){
        var Y = linker.ui.pageHeight(linker.processWindow, linker.processDocument) - menuHeight - 28; /* 28 is the size of the topbar */
        if ( Y < 0 ){
            Y = 0;
        }
    }
    else{
        var Y = clientY;
    }

    if ( event !== null ){
        X += scrollLeft;
        Y += scrollTop;
    }

    menu.style.display = 'none';
    menu.style.left = X + 'px';
    menu.style.top =  Y + 'px';
    menu.style.display = 'block';
    menu.style.zIndex = 100;
    menuShown = true;
    return true;
}

