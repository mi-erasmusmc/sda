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

# get settings
_STATUS='staging'
_REVISION='10314'
#_REVISION='10314'

html = """
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">
<html>
<head>
<title>Structured Digital Abstract</title>
<LINK href="stylesheet.css" title="compact" rel="stylesheet" type="text/css">
<!--<script type="text/javascript" src="../minedit/log4javascript.js"></script>-->
<SCRIPT type="text/javascript" src="log4javascript.js"></SCRIPT>
<SCRIPT type="text/javascript">
    var log                   = log4javascript.getLogger();
    var popUpAppender           = new log4javascript.PopUpAppender();
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
<script type="text/javascript" src="sda.js"></script>
<script type="text/javascript" src="contentmanager.js"></script>
<SCRIPT type="text/javascript" src="settings.js"></SCRIPT>
<SCRIPT type="text/javascript" src="common_Default_""" + _STATUS + """_""" + _REVISION + """.js"></SCRIPT>

<!-- <script type="text/javascript" src="../minedit/log4javascript.js"></script> -->
<!-- <script type="text/javascript" src="../minedit/wikifier.js"></script> -->
<!-- <script type="text/javascript" src="../minedit/wikifier_base.js"></script> -->
<!-- <script type="text/javascript" src="../minedit/sourcesCore.js"></script> -->
<!-- <script type="text/javascript" src="../minedit/fpcache.js"></script> -->
<!-- <script type="text/javascript" src="../minedit/json.js"></script> -->
<!-- <script type="text/javascript" src="../minedit/xml2json.js"></script> -->
<!-- <script type="text/javascript" src="../minedit/knewcoapi.js"></script> -->
<!-- <script type="text/javascript" src="../minedit/jt_ProgressBar.js"></script> -->
<!-- <script type="text/javascript" src="../minedit/hint.js"></script> -->
<!-- <script type="text/javascript" src="../minedit/xhr.js"></script> -->
<!-- <script type="text/javascript" src="../minedit/jquery.js"></script> -->
<!-- <script type="text/javascript" src="../minedit/sources.js"></script> -->
<!-- <script type="text/javascript" src="../minedit/wikifier_transport.js"></script> -->
<!-- <script type="text/javascript" src="../minedit/wikifier_browser.js"></script> -->
<!-- <script type="text/javascript" src="../minedit/wikifier_utils.js"></script> -->
<!-- <script type="text/javascript" src="../minedit/wikifier_log.js"></script> -->
<!-- <script type="text/javascript" src="../minedit/wikifier_cache.js"></script> -->
<!-- <script type="text/javascript" src="../minedit/wikifier_parsing.js"></script> -->
<!-- <script type="text/javascript" src="../minedit/wikifier_indexing.js"></script> -->
<!-- <script type="text/javascript" src="../minedit/wikifier_highlighting.js"></script> -->
<!-- <script type="text/javascript" src="../minedit/wikifier_subject.js"></script> -->
<!-- <script type="text/javascript" src="../minedit/wikifier_ui.js"></script> -->
<!-- <script type="text/javascript" src="../minedit/books.js"></script> -->

</head>
<body onload="formLoad();">
    <table align="center" width="800px">
        <tr>
            <td colspan=1 align="left">
                <img src="images/emc.jpg" width="200px"/>
            </td>
            <td colspan=1 align="right">
                <img src="images/knewco.png" width="300px"/>
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
            <input type="checkbox" name="New" id="wikifier-new" style="display:none"/>
            <input type="checkbox" name="Others" id="wikifier-other" style="display:none"/>
            <input type="checkbox" name="None" id="wikifier-none" style="display:none"/>
            <script type=text/javascript>
                document.getElementById("wikifier-behavior").checked = true;
                document.getElementById("wikifier-anatomy").checked = true;
                document.getElementById("wikifier-chemicals").checked = true;
                document.getElementById("wikifier-diseases").checked = true;
                document.getElementById("wikifier-genes").checked = true;
                document.getElementById("wikifier-living").checked = true;
                document.getElementById("wikifier-physiology").checked = true;
                document.getElementById("wikifier-new").checked = true;
                document.getElementById("wikifier-other").checked = true;
                document.getElementById("wikifier-none").checked = true;
            </script>
        <tr><td colspan=2>
            <div id="text-view" onmouseUp="popupOnTextSelection(event);" style="align:left; overflow:auto; border: .1em solid grey; width:800px; height:400px;" onmouseover="mouseOverTextArea();" name="text-view"><fillin4></div>
        </td></tr>
        <tr><td colspan=1 align="left">
            <!-- <input type=button value="New"/> -->
            <input type=button value="Reset" onclick="cm.reset();"/>
            <!-- <input type=button value="Add" onclick="addConcept('Anophelines');"/> -->
            <!-- <input type=button value="Remove" onclick="removeConcept(1063,48,2);"/> -->
            <!-- <input type=button value="Refresh" onclick="cm.process();"/> -->
            <!-- <input type=button value="Write table" onclick="cm.stringifyRelations();"/> -->
            <input type=button value="Undo" onclick="cm.undo();"/>
        </td>
        <td colspan=1 align="right">
            <input id="edit" type="submit" value="Edit" onclick="cm.edit();"/>
            <input id="open" type="submit" value="Open" onclick="cm.open();"/>
            <input id="save" disabled="true" type="submit" value="Save" onclick="cm.save();"/>
            <input type="submit" value="Next" onclick="cm.next();"/>
        </td></tr>
        <tr><td colspan=2>
            <b>Relations:</b>
            <table id="pairs">
            </table>
        </td></tr>
        <tr><td colspan=2 align="center">
            <br/>
            <font size=-3>
            (C) 2009, University Medical Center Rotterdam, Knewco Inc
            </font>
        </tr></td>        
    </table>
</body>
</html>
"""

def handler(req):
    # print the header of the html page
    req.content_type = 'text/html'
    req.send_http_header()

    text        = util.FieldStorage(req).getfirst("text-edit","")
    result = html.replace( "<fillin4>", text );#text.replace( "\n", "<br/>" ) );
        
    req.write( result.encode("utf-8") )

    return apache.OK
