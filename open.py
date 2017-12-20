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
    req.content_type = 'application/x-www-form-urlencoded'
    req.send_http_header()

    fields = util.FieldStorage(req).list
    annotator = "default"
    for field in fields:
        if field.name == "filename":
            filename = field.value
        elif field.name == "annotator":
            annotator = field.value
    try:
        fullFilename = os.path.dirname(__file__) + "/annotators/" + annotator + "/annotations/" + filename
        
        if os.path.exists( fullFilename ):
            fd = open( fullFilename, "r" )
            data = fd.read()
            fd.close()
            req.write( '{"status":"OK","data":' + data + '}' )
        else:
            req.write( '{"status":"NONEXISTING"}' )
    except:
        req.write( '{"status":"FAIL"}' )

    return apache.OK
