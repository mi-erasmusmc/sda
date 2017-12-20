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
import urllib2
import urllib
import httplib2
import cgi
from   mod_python import apache, Session, util
import unicodedata
import codecs
import xmlrpclib
import traceback
from urlparse import urlparse
from ConfigParser import SafeConfigParser
import os

# get settings
config = SafeConfigParser()
config.read(os.path.dirname(__file__) + '/settings.ini')

#load api connection parameters
host = config.get('API', 'host')
path = config.get('API', 'path')

prot="http" #default

u = urlparse(host)
if u[0]:
    prot = u[0]

if u[1]:
    host = u[1]
else:
    host = u[2].rstrip("/")
url = prot+"://%(username)s:%(password)s@" + host + path

username = config.get('API', 'username')
password = config.get('API', 'password')
ws = xmlrpclib.Server( url % { 'username': username, 'password': password } )

weird_chars = {u'\u0141': 'L', u'\u0142': 'l', u'\u00d8': 'O', u'\u00f8': 'o'}

def translateUnicodeCharByChar(text, encoding = 'ascii', joinChar = ' '): 
    """
    Translates/maps Unicode input to ascii or latin output
    deleting funny chars while retaining the base letters
    doing it char by char
    Length of return string is equal to input string
    
    """
    output = []
    for char in text:
        newchar = u''
        if weird_chars.has_key(char):
            newchar = weird_chars[char]
        else:
            try:
                newchar = char.encode(encoding)
            except UnicodeEncodeError:
                newchar = unicodedata.normalize('NFKD', char).encode(encoding, 'ignore')
        # check for length
        if len(char) != len(newchar):
            if joinChar != None:
                newchar = joinChar * len(char)       
        output.append(newchar)

    return u"".join(output)

def translateUnicode(text, encoding = 'ascii', joinChar = ' '):
    """
    Translates/maps Unicode input to ascii or latin output
    deleting funny chars while retaining the base letters
    Length of return string is equal to input string
    """
    if u''.__class__ == text.__class__:        
        decodedText = text
    else:
        decodedText = text.decode('utf-8', 'replace')
    newtext = u''
    try:
        newtext = decodedText.encode(encoding)
        if len(decodedText) != len(newtext):
            newtext = translateUnicodeCharByChar(decodedText, encoding, joinChar)
            print newtext
    except UnicodeEncodeError:
        newtext = translateUnicodeCharByChar(decodedText, encoding, joinChar)
    return newtext

def RemoveHeader( Str ):
    try:
        Offset = Str.index( "?>" );
        if Offset != -1:
            Offset += 2
            return Str[Offset:]
        return Str
    except:
        return Str

def handler(req):
    # obtain the posted data
    # print the header of the html page
    req.send_http_header()
    id = ""
    text = translateUnicode(req.read())
    cmd = "index" # the default action
    id="" #default id

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
	text = translateUnicode(text)
    result = ws.index(text,2)
    response = result['response']
    req.content_type = 'text/xml'
    req.write( "<response>"+id+RemoveHeader(response)+ "</response>" )
    return apache.OK
