#*********************************************************************************************************
# (C) 2006, KnewCo Inc, United States of America
# author: Erik M. van Mulligen
# date:   June 2006
#
# This script will retrieve a fingerprint for a text
#
#*********************************************************************************************************

import sys
import string
import cgi
import urllib2
import urllib
import socket
import xml.dom.minidom
from   mod_python import apache, Session, util
import os
import xmlrpclib
import unicodedata
from unicode import translateUnicode

# get settings
_STATUS='staging'
_REVISION='10314'
#_REVISION='10314'


def decode(string):
    return string.replace('&amp;','&').replace('&lt;','<').replace('&gt;','>').replace('&apos;','\'').replace('&quot;','"');

def getPubMedText(pmid):
    data = urllib2.urlopen("http://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id="+pmid+"&report=abstract&mode=xml").read()
    sPos = data.find( "<ArticleTitle>" ) + len( "<ArticleTitle>" )
    ePos = data.find( "</ArticleTitle>" )
    if sPos != -1 and ePos != -1:
        title = data[sPos:ePos]
    else:
        title = ""
    
    abstract = ""
    sPos = data.find( "<AbstractText>" ) + len( "<AbstractText>" )
    ePos = data.find( "</AbstractText>" )
    if sPos != -1 and ePos != -1:
        abstract += data[sPos:ePos]
        
    return {'title':title, 'abstract': abstract}

def getWord( text, pos ):
    word = ""
    while pos < len(text):
        if text[pos].isspace():
            break
        word += text[pos]
        pos += 1
    return word

def isCapital( word ):
    capital = 0
    
    if word[0] in string.ascii_uppercase:
        return True
    
    for i in range( 0, len(word) ):
        if word[i] in string.ascii_uppercase:
            capital += 1
    if (capital*2) >= len(word):
        return True
    return False

def mydecode(html):
    return html.replace( "\x9a", "" ).replace( "\xc3", "" ).replace( "\xb6", "oe" ).replace( "\x92", "i" ).replace( '\xed', 'i' ).replace( '\xfc', 'u' ).replace( '\xe9', 'e').replace( '\xa9', 'e' ).replace( '\xbc', 'e').replace( '\xad', 'i' )

def handler(req):
    html = """
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">
<html>
<head>
<title>Structured Digital Abstract</title>
<META HTTP-EQUIV="CACHE-CONTROL" CONTENT="NO-CACHE">
<META HTTP-EQUIV="EXPIRES" CONTENT="0">
<META HTTP-EQUIV="PRAGMA" CONTENT="NO-CACHE">
<META HTTP-EQUIV="PRAGMA" CONTENT="NO-STORE">
<LINK href="stylesheet.css" title="compact" rel="stylesheet" type="text/css">
<!--<script type="text/javascript" src="../minedit/log4javascript.js"></script>-->
<SCRIPT type="text/javascript" src="log4javascript.js"></SCRIPT>
<SCRIPT type="text/javascript">
    var log                   = log4javascript.getLogger();
    var popUpAppender           = new log4javascript.PopUpAppender();
    var startPositions        = new Array();
    <fillin5>
    popUpAppender.setFocusPopUp(true);
    popUpAppender.setNewestMessageAtTop(false);
    log.addAppender(popUpAppender);
    
    function enrich(){
        if (!linker || !linker.ui || (linker.ui.mit_enrich() != 0)) {
            restart++;
            if ( restart <= 10 ){
                self.setTimeout(enrich, 10);
            }
        }
    }

</SCRIPT>
<script type="text/javascript" src="sda2.js"></script>
<script type="text/javascript" src="contentmanager.js"></script>
<SCRIPT type="text/javascript" src="settings.js"></SCRIPT>
<SCRIPT type="text/javascript" src="common_Default_""" + _STATUS + """_""" + _REVISION + """.js"></SCRIPT>

</head>
<body onload="formLoad();" onUnload="backButton();">
    <table id='annotation' align="center" width="800px">
        <tr>
            <td colspan=1 align="left">
                <img src="images/emc.jpg" width="200px"/>
            </td>
            <td colspan=1 align="right">
                <img src="images/knewco.png" width="300px"/>
            </td>
        </tr>    
        
        <tr>
            <td colspan=2 align="center">
                <label id="annotator"><annotatorTemplate></label><br/>
                <label id="selectedPmid"><pmidTemplate></label><br/>
                <input id="pmids" type="text" value="<pmidListTemplate>" style="visibility: hidden"/>
            </td>
        </tr>

        <tr><td id="selected-semtypes" colspan=2 align="center">
            <input type="checkbox" name="Behavior & Activity" id="wikifier-behavior" style="display:none"/>
            <input type="checkbox" name="Anatomy" id="wikifier-anatomy" style="display:none"/>
            <input type="checkbox" name="Chemicals & Drugs" id="wikifier-chemicals" style="display:none"/>
            <input type="checkbox" name="Diseases & Disorders" id="wikifier-diseases" style="display:none"/>
            <input type="checkbox" name="Genes & Molecular Sequences" id="wikifier-genes" style="display:none"/>
            <input type="checkbox" name="Living Beings" id="wikifier-living" style="display:none"/>
            <input type="checkbox" name="Physiology" id="wikifier-physiology" style="display:none"/>
            <input type="checkbox" name="SNP & Sequence variations" id="wikifier-snp" style="display:none"/>
            <input type="checkbox" name="New" id="wikifier-new" style="display:none"/>
            <input type="checkbox" name="Other" id="wikifier-other" style="display:none"/>
            <input type="checkbox" name="None" id="wikifier-none" style="display:none"/>
            <script type=text/javascript>
                document.getElementById("wikifier-behavior").checked = false;
                document.getElementById("wikifier-anatomy").checked = false;
                document.getElementById("wikifier-chemicals").checked =<chemicals>;
                document.getElementById("wikifier-diseases").checked =<diseases>;
                document.getElementById("wikifier-genes").checked =<genes>;
                document.getElementById("wikifier-living").checked = false;
                document.getElementById("wikifier-physiology").checked = false;
                document.getElementById("wikifier-snp").checked =<snps>;
                document.getElementById("wikifier-new").checked = true;
                document.getElementById("wikifier-other").checked = false;
                document.getElementById("wikifier-none").checked = true;
            </script>
        </td></tr>      
    </table>
    
    <table align="center" width="800px">
        <tr>
            <td colspan=2 align="center">
                <input type="submit" value="<-" onclick="cm.previous();"/>
                <!-- <input type=button value="Undo" onclick="cm.reset();"/>-->
                <!-- <input id="edit" type="submit" value="Edit" onclick="cm.edit();"/>-->
                <input id="open" type="submit" value="Reset" onclick="cm.openoriginal();"/>
                <input id="select" type="submit" value="Select" onclick="cm.select();"/>
                <input id="save" type="submit" value="Save" onclick="cm.save();"/>
                <input type="submit" value="->" onclick="cm.next();"/>
            </td>
        </tr>       
    </table>
    
    <table border="1" id="sentences"><fillin4></table>
    <table align="center" width="800px">
        <tr><td colspan=2 align="center">
            <input type="submit" value="<-" onclick="cm.previous();"/>
            <!-- <input type=button value="Undo" onclick="cm.reset();"/>-->
            <!-- <input id="edit" type="submit" value="Edit" onclick="cm.edit();"/>-->
            <input id="open" type="submit" value="Reset" onclick="cm.openoriginal();"/>
            <input id="select" type="submit" value="Select" onclick="cm.select();"/>
            <input id="save" type="submit" value="Save" onclick="cm.save();"/>
            <input type="submit" value="->" onclick="cm.next();"/>
        </td></tr>
        <tr><td colspan=2 align="center">
            <br/>
            <font size=-3>
            (C) 2010, University Medical Center Rotterdam, Knewco Inc
            </font>
        </tr></td>        
    </table>
    <input id="relation" type="text" value="<relation>" style="visibility: hidden"/>
</body>
</html>
"""
    # print the header of the html page
    req.content_type = 'text/html'
    req.send_http_header()

    text         = util.FieldStorage(req).getfirst("text-edit","")
    pmids        = util.FieldStorage(req).getfirst("pmids","")
    selectedPmid = util.FieldStorage(req).getfirst("selected","")
    annotator    = util.FieldStorage(req).getfirst("annotator", "")
    relation     = util.FieldStorage(req).getfirst("relation", "")
    
    if selectedPmid != "":
        obj = getPubMedText( selectedPmid )
        title = mydecode( obj['title'] ) + " "
        text  = mydecode( obj['abstract'] )
    else:
        title = ""
    
    prevPos = 0
    sentences = []
    sentences.append( title )
    for i in range( 0, len(text)-2 ):
        if text[i] in ['.','!','?']:
            next = i + 1
            found = False
            while ( next < len(text) ) and text[next].isspace():
                next += 1
                found = True
                
            if next >= (len(text)-1):
                break
                            
            if found:
                word = getWord( text, next )
                if isCapital( word ):
                    sentences.append( text[prevPos:next])
                    prevPos = next
    sentences.append( text[prevPos:])
    
    newHtml = ""
    cnt = 0
    startPositions = "";
    start = 0
    for sentence in sentences:
        cnt = cnt + 1
        if sentence != "":
            newHtml += "<tr onmouseUp=\"popupOnTextSelection(event);\"><td valign=\"top\"><div onmouseUp=\"popupOnTextSelection(event);\"  id=\"texteditor_" + str(cnt) + "\" class=\"indexable\">" + sentence + "</div></td><td>"
            newHtml += "<table id=\"" + str(cnt) + "\" class=\"pairs\"><COLGROUP><COL width=\"10%\"><COL width=\"30%\"><COL width=\"30%\"><COL width=\"30%\"></COLGROUP></table></td></tr>"
            startPositions = startPositions + "startPositions[" + str(cnt-1) + "]="+str( start )+";"
            start = start + len( decode( sentence ) )

    html = html.replace( "<fillin4>", newHtml )
    html = html.replace( "<fillin5>", startPositions )
    html = html.replace( "<annotatorTemplate>", annotator );
    html = html.replace( "<pmidTemplate>", selectedPmid );
    html = html.replace( "<pmidListTemplate>", pmids );
    
    chemicals = " true"
    diseases  = " true"
    genes     = " true"
    snps      = " true"
    
    if relation == "DT":
        chemicals = "false"
    elif relation == "TD":
        diseases = "false"
    elif relation == "DD":
        genes = "false"
        snps  = "false"

    html = html.replace( "<chemicals>", chemicals )
    html = html.replace( "<diseases>", diseases )
    html = html.replace( "<genes>", genes )
    html = html.replace( "<snps>", snps )
    html = html.replace( "<relation>", relation );
    
    try:    
        req.write( html.encode("utf-8") )
    except:
        #html = html.encode( 'utf-8', 'ignore' )
        html = html.replace( "\x9a", "" ).replace( "\xc3", "" ).replace( "\xb6", "oe" ).replace( "\x92", "i" ).replace( '\xed', 'i' ).replace( '\xfc', 'u' ).replace( '\xe9', 'e').replace( '\xa9', 'e' ).replace( '\xbc', 'e').replace( '\xad', 'i' )
        #a = html.decode("utf-8", "replace")
        html = html.encode('utf-8', "ignore")
        req.write( html )
        #req.write( html.encode("windows-1252" ) )

    return apache.OK
