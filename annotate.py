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
from   mod_python import apache, Session, util
import os

_STATUS='staging'
_REVISION='10314'

html = """
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">
<html>
<head>
<title>EU-ADR Annotation Tool</title>
<META HTTP-EQUIV="CACHE-CONTROL" CONTENT="NO-CACHE">
<META HTTP-EQUIV="EXPIRES" CONTENT="0">
<META HTTP-EQUIV="PRAGMA" CONTENT="NO-CACHE">
<META HTTP-EQUIV="PRAGMA" CONTENT="NO-STORE">
<LINK href="stylesheet.css" title="compact" rel="stylesheet" type="text/css">
<SCRIPT type="text/javascript" src="common_Default_""" + _STATUS + """_""" + _REVISION + """.js"></SCRIPT>

<script type="text/javascript">
    function selectAnnotator(elt){
        var annotator = document.getElementById( "annotatorsList" );
        var annotatorElt = document.getElementById( "annotator" );
        if ( annotator.selectedIndex != -1 ){
            clearList( "jobsList" );
            clearList( "pmidList" );
            annotatorElt.value = annotator.options[annotator.selectedIndex].text;
            linker.transport.makeCall("getjobs.py?annotator=" + annotator.options[annotator.selectedIndex].text, "GET", jobsCallback )
        }
    }
    
    function selectAnnotationJob(elt){
        var annotator = document.getElementById( "annotatorsList" );
        var job = document.getElementById( "jobsList" );
        if ( job.selectedIndex != -1 ){
            clearList( "pmidList" );
            linker.transport.makeCall("getpmids.py?annotator=" + annotator.options[annotator.selectedIndex].value + "&job=" + job.options[job.selectedIndex].value, "GET", pmidsCallback )            
        }
    }
    
    function getAnnotators(){
        linker.transport.makeCall("getannotators.py", "GET", annotatorsCallback )
    }
    
    function clearList(name){
        var elt = document.getElementById( name );
        for ( var i = elt.options.length - 1 ; i >= 0 ; i-- ){
            elt.remove(i);
        }
    }

    function addOption( select, text, value ){
        var y = document.createElement('option');
        y.text = text;
        y.value = value;
        try{
            select.add( y, null ); // standards compliant
        }
        catch(ex){
            select.add( y ); // IE only
        }
    }


    function pmidsCallback(text){
        pieces = text.split(",")
        pmid = document.getElementById( "pmidList" );

        for ( var i = 0 ; i < pieces.length ; i++ ){
            addOption( pmid, pieces[i], pieces[i] );
        }
        
        var job = document.getElementById( "jobsList" );
        if ( job.selectedIndex != -1 ){
            setCheckedValue( document.getElementsByName( "relationType" ),  job.options[job.selectedIndex].text );
        }
        
        document.getElementById( "jobs" ).value = text;
        if ( pieces.length > 0 ){
            document.getElementById( "selectedPmid" ).value = pieces[0];
        }
    }
    
    function jobsCallback(text){
        pieces = text.split(",")
        job = document.getElementById( "jobsList" );

        addOption( job, "", null );
        for ( var i = 0 ; i < pieces.length ; i++ ){
            addOption( job, pieces[i].substring( 0, pieces[i].indexOf('.txt') ), pieces[i] );
        }
    }
    
    function annotatorsCallback(text){
        pieces = text.split(",")
        annotator = document.getElementById( "annotatorsList" );

        addOption( annotator, "", null );
        for ( var i = 0 ; i < pieces.length ; i++ ){
            addOption( annotator, pieces[i], pieces[i] );
        }
    }
    
    function getCheckedValue(radioObj) {
        if(!radioObj)
            return "";
        var radioLength = radioObj.length;
        if(radioLength == undefined)
            if(radioObj.checked)
                return radioObj.value;
            else
                return "";
        for(var i = 0; i < radioLength; i++) {
            if(radioObj[i].checked) {
                return radioObj[i].value;
            }
        }
        return "";
    }

    function setCheckedValue(radioObj, id) {
        if(!radioObj)
            return "";
        var radioLength = radioObj.length;
        if(radioLength != undefined){
            for(var i = 0; i < radioLength; i++) {
                radioObj[i].checked = false;
                if(radioObj[i].id == id) {
                    radioObj[i].checked = true;
                }
            }
        }
        return "";
    }
    
    function submitJob(){
        var annotator = document.getElementById("annotator").value;
        var selectedPmid = document.getElementById( "selectedPmid" ).value;
        var pmids = document.getElementById( "jobs" ).value;
        var relationType = getCheckedValue( document.getElementsByName( "relationType" ) );
        window.open( "sda2.py?relation=" + relationType + "&annotator=" + annotator + "&pmids=" + pmids + "&selected=" + selectedPmid + "&pmids=" + pmids, "_self" );
    }
    
</script>
</head>
<body onload="getAnnotators();">
    <table id='annotation' align="center" width="800px">
        <tr>
            <td colspan=1 align="left">
                <img src="images/emc.jpg" width="200px"/>
            </td>
            <td colspan=1 align="right">
                <img src="images/knewco.png" width="300px"/>
            </td>
        </tr>    
    </table>
    <center>
    <table>
    <tr>
    <td>
    <label>Annotator:</label>
    </td>
    <td>
    <select id="annotatorsList" onchange="selectAnnotator(this);" style="width:200px"/>
    <input id="annotator" name="annotator" style="visibility: hidden"/>
    </td>
    </tr>
    <tr>
    <td>
    <label>Annotation Job:</label>
    </td>
    <td>
    <select id="jobsList" onchange="selectAnnotationJob(this);" style="width:200px"/>
    <input type="text" id="jobs" name="jobs" style="visibility: hidden"/>    
    </td>
    </tr>
    <tr>
    <td valign="top">
    <label>PubMed ids:</label>
    </td>
    <td>
    <select id="pmidList" name="pmidList" size="20" onclick="document.getElementById('selectedPmid').value = this.options[this.selectedIndex].value" style="width:200px"/>
    </td>
    </tr>
    <tr>
    <td>
        <label>Relations:</label>
    </td>
    <td>
        <input name=relationType id="All" type=radio checked value="">All</input><br/>
        <input name=relationType id="Target-Disorder" type=radio value="DT">Target-Disorder</input><br/>
        <input name=relationType id="Target-Drug" type=radio value="TD">Target-Drug</input><br/>
        <input name=relationType id="Drug-Disorder" type=radio value="DD">Drug-Disorder</input>
    </td>
    </tr>
    <tr>
    <td colspan="2">
    <!-- <input type="button" value="New annotator"/>-->            
    <input type="button" onclick="submitJob();" value="Annotate"/>
    <input type="text" id="selectedPmid" name="selectedPmid" style="visibility: hidden"/>
    </td>
    </tr>
    </table>
    </center>
</body>
</html>
"""

def readfile(filename):
    ids = []
    try:
        lines = open(filename,"r").readlines()
        for line in lines:
            pos = line.find( "PMID:" )
            if pos != -1:
                pubMedId = line[pos+5:].strip()
                ids.append( pubMedId)
        return string.join(ids, ",")
    except:
        return ""
        
def handler(req):
    global html
    
    req.content_type = 'text/html'
    req.send_http_header()
    req.write( html )

    return apache.OK
