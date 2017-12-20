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
    html = ""
    
    req.content_type = 'text/html'
    req.send_http_header()

    for dir in os.listdir(os.path.dirname(__file__) + "/annotators/"):
        if not dir.startswith("."):
            if html != "":
                html += ","
            html += dir
            
    req.write( html )

    return apache.OK
