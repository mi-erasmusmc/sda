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
from   mod_python import apache, Session, util
import os

def handler(req):
    html = ""
    
    req.content_type = 'text/html'
    req.send_http_header()

    annotator  = util.FieldStorage(req).getfirst("annotator","").strip()
    
    if annotator != "":
        for file in os.listdir(os.path.dirname(__file__) + "/annotators/" + annotator ):
            if not os.path.isdir( os.path.dirname(__file__) + "/annotators/" + annotator + "/" + file ):
                if html != "":
                    html += ","
                html += file
    req.write( html )
    return apache.OK
