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

def handler(req):
    overwrite = False
    annotator = "default"
    
    fields = util.FieldStorage(req).list
    for field in fields:
        if field.name == "filename":
            filename = field.value
        elif field.name == "data":
            data = field.value
        elif field.name == "overwrite":
            overwrite = ( field.value == "true" )
        elif field.name == "annotator":
            annotator = field.value
                      
    req.content_type = 'text/html'
    req.send_http_header()

    try:
        fullFilename = os.path.dirname(__file__) + "/annotators/" + annotator + "/annotations/" + filename
        
        if os.path.exists( fullFilename ) and ( overwrite == False ):
            req.write( '{"status":"FILEEXISTS"}' )
        else:
            fd = open( fullFilename, "w" )
            fd.write( data )
            fd.close()
            req.write( '{"status":"OK"}' )
    except:
        req.write( '{"status":"FAIL"}' )
   
    return apache.OK
