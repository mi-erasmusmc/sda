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

def handler(req):
    req.content_type = 'text/html'
    req.send_http_header()

    annotator = "default"
    fields = util.FieldStorage(req).list

    for field in fields:
        if field.name == "annotator":
            annotator = field.value
            
    try:
        path = os.path.dirname(__file__) + "/annotators/" + annotator + "/annotations/"
        dirs = os.listdir(path)
        
        res = ""
        for dir in dirs:
            if res != "" :
                res += ","
            res += '"' + dir + '"'
        
        req.write( '{"status":"OK","files":[' + res + ']}')    
            
    except:
        req.write( '{"status":"FAIL"}' )
    
    return apache.OK
