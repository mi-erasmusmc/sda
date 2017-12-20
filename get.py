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
	
def handler(req):
	# print the header of the html page
	req.content_type = 'text/html'
	req.send_http_header()


	fields = util.FieldStorage(req).list
	
	url = "";
	for field in fields:
		if url <> "":
			url += "&"
		url += field.name + "=" + urllib.quote(field.value)
	f = urllib2.urlopen( url )
	result = f.read()
	req.write( result )

	return apache.OK