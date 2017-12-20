function getXMLDOM(text) {
    var doc;

    if ("undefined" != typeof DOMParser) {
        var parser = new DOMParser();
        doc = parser.parseFromString(text, "text/xml");
    }

    if (!doc && ("undefined" != typeof ActiveXObject)) {
        var progIDs = ['Msxml2.DOMDocument.6.0', 'Msxml2.DOMDocument.3.0'];
        for (var i = 0; i < progIDs.length; i++) {
            try {
                doc = new ActiveXObject(progIDs[i]);
                break;
            }
            catch (e) {
            }
        }
        if (doc) {
            doc.async = "false";
            doc.loadXML(text);
        }
    }

    return doc;
}

function GetXMLHttpRequest(){
    var req = null;

    if ("undefined" != typeof XMLHttpRequest) {
        req = new XMLHttpRequest();
        if (req.overrideMimeType)
            req.overrideMimeType('text/xml');
    }

    if (!req && ("undefined" != typeof ActiveXObject)){
        var msxmls = new Array( 'Msxml2.XMLHTTP.6.0','Msxml2.XMLHTTP.3.0','Msxml2.XMLHTTP','Microsoft.XMLHTTP');
        for (var i = 0; i < msxmls.length; i++) {
          try {
            req = new ActiveXObject(msxmls[i]);
            break;
          } catch (e) {
          }
        }
    }

    return req;
}

function askFile() {
    var filename = prompt("Enter the filename (including path)","/users/mulligen/output.txt")
    if (filename != null && filename != "") {
        getFileText(filename);
    }
}

function validateInput(){
	document.getElementById('analyze-button').disabled = (document.getElementById('text-edit').value.length == 0);
}

function getFileText(filename){
	fh = fopen(filename, 0); // Open the file for reading
	if(fh!=-1) // If the file has been successfully opened
	{
    	var length = flength(fh);         // Get the length of the file    
    	var str = fread(fh, length);     // Read in the entire file
    	fclose(fh);                    // Close the file
    
		document.getElementById("text-edit").value = str;
	}
}

function askPubMedId() {
    var pmid = prompt("Enter the PubMed id:\n(for example: 18949331)","")
    if (pmid != null && pmid != "") {
        getPubMedText(pmid);
    }
}

function getText(nodelist){
    var rc = ""
    for ( var i = 0 ; i < nodelist.length ; i++ ){
        if ( nodelist[i].nodeType == 3 ){
            rc += nodelist[i].nodeValue;
        }
    }
    return rc;
}
    
function getPubMedText(pmid){
    var url = "get.py?http://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=" + pmid + "&report=abstract&mode=xml"
    var request = GetXMLHttpRequest();
    request.onreadystatechange = function(){
        if (request.readyState==4 && request.status == 200){
        	var xml = getXMLDOM( request.responseText );
        	var elts = xml.getElementsByTagName( "ArticleTitle" );
        	var result = "";
        	if ( elts.length > 0 ){
		        result += getText( elts[0].childNodes)
        	}
        	       
    		elts = xml.getElementsByTagName( "AbstractText" )
    		if ( elts.length > 0 ){
        		result += "\n\n"
        		result += getText(elts[0].childNodes)
    		}
        	document.getElementById("text-edit").value = result;
        	validateInput();
        }
    };
    request.open( "GET", url, true );
    request.send( null );
}

