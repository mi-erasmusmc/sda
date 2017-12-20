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
import os
import traceback
import re
from   mod_python import apache, Session, util
from   ws import indexText, translateUnicode

def strip_accents(string):
  import unicodedata
  return unicodedata.normalize('NFKD', unicode(string)).encode('ASCII', 'ignore')

def handler(req):
    req.send_http_header()
    id   = ""
    text = req.read().strip()
    cmd  = "index" # the default action

    if ( text != "" ):
        if ( text[0:5] == "<cmd>" ):
            pos = text.find( "</cmd>" )
            cmd = text[5:pos+6]
            text = text[pos+6:]
        if ( text[0:4] == "<id>" ):
            pos = text.find( "</id>" )
            id = text[0:pos+5]
            #req.write(text[0:pos+5])
            text = text[pos+5:]

    req.content_type = 'text/xml'
    
    response = indexText(text)
    req.write( "<response>"+id+response+ "</response>" )

    return apache.OK