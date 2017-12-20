import sys
import os
from semgroups import semanticGroupTypeDict
from   mod_python import apache, Session, util
from   ws import indexText, translateUnicode
    
def handler(req):
    # obtain the posted data
    # print the header of the html page
    req.send_http_header()
    
    fields = util.FieldStorage(req).list
    cmd = ''
    text = ""
    for field in fields:
        if field.name == "cmd": cmd = field.value
        if field.name == "text": text = translateUnicode(field.value)

    if cmd == "terms":
        result = ws.getTerms(text)
        content = RemoveHeader(result['response'])
        content =  content.replace("'","\\'" )
    # indexing request
    else:
        content = "<response>" + indexText(text) + "</response>"

    req.content_type = 'text/xml'
    req.write( content )
    return apache.OK

    