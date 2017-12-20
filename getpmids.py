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
import re

def readfile(filename):
    f = open( filename, 'r' )
    multiline = ''
    ids = ''
    for line in f:
        line = line.replace( '\n', '' ).replace( '\r', '' )
        e = re.match( "^([0-9]+):", line )
        if e != None and len(multiline) > 0:
            m = re.search( "PMID:[ ]*([0-9]+)", multiline )
            if m != None:
                pmid = m.group(1)
                if ids != "":
                    ids += ","
                ids += pmid                
            multiline = ''
        multiline += line
    
    m = re.search( "PMID:[ ]*([0-9]+)", multiline )
    if m != None:
        pmid = m.group(1)
        if ids != "":
            ids += ","
        ids += pmid                
        multiline = ''
    
    return ids

def handler(req):
    req.content_type = 'text/html'
    req.send_http_header()

    annotator  = util.FieldStorage(req).getfirst("annotator","").strip()
    job        = util.FieldStorage(req).getfirst("job","").strip()
    
    req.write( readfile( os.path.dirname(__file__) + "/annotators/" + annotator + "/" + job  ) )
    return apache.OK
