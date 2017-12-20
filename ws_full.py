import sys
import string
import os
import unicodedata
import codecs
import traceback
import re
from   semgroups import semanticGroupTypeDict
from   SOAPpy import SOAPProxy


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
    
def xml_str_encoder(s):
    s = s.replace("&", "&amp;")
    s = s.replace("<", "&lt;")
    s = s.replace(">", "&gt;")
    return s

def is_sort_of_a_list(l):
    for method in ['__getitem__', '__setitem__']:
        if method not in dir(l):
            return False
    return True

def outputLine(line):
    return "<line startpos=\"" + line.startPosition + "\" length=\"" + line.length + "\"/>" 

def outputWord(word,clusterId):
    return "<word clid=\""+clusterId+"\" pos=\"" + word.startPosition + "\" len=\"" + word.length + "\">" + word.text + "</word>"

def outputWords(words,clusterId):
    res = ""
    if is_sort_of_a_list(words):
        for word in words:
            res += outputWord(word,clusterId)
    else:
        res += outputWord(words,clusterId)
    return res

def outputTerm(term):
    return outputWords(term.word,term.termId)    
    
def outputTerms(terms):
    res = ""
    if is_sort_of_a_list(terms):
        for term in terms:
            res += outputTerm(term)
    else:    
        res += outputTerm(terms)
    return res   
    
def outputLines(lines):
    count = 0
    res = ""
    if is_sort_of_a_list(lines):
        for line in lines:
            res += outputLine(line)
            count += 1
    else:    
        res += outputLine(lines)
        count += 1    
    res = "<lineslist count=\"" + str(count) + "\">" + res + "</lineslist>"
    return res

def outputSemanticTypes( semanticTypes ):
    res = "<semantictypes>"
    if is_sort_of_a_list(semanticTypes):
        for semanticType in semanticTypes:
            res += outputSemanticType( semanticType )
    else:
        res += outputSemanticType( semanticTypes )
    res += "</semantictypes>"
    return res

def outputSemanticType( semanticType ):
    try:
        semanticGroup = semanticType.group
        semanticTypeName = semanticType.name
    except:
        try:
            semanticGroup = xml_str_encoder(semanticGroupTypeDict[int(semanticType.id)]['group'])
            semanticTypeName = xml_str_encoder(semanticGroupTypeDict[int(semanticType.id)]['name'])
        except:
            semanticGroup = "unknown"
            semanticTypeName = "unknown"
    return "<semantictype id=\"" + semanticType.id + "\" group=\"" + semanticGroup + "\">" + semanticTypeName + "</semantictype>" 

def outputConcept(concept):
    conceptId = int(concept.conceptId)
    if conceptId >= 2000000:
        conceptStr = "uniprot/" + str(conceptId)
    else:
        conceptStr = "umls/C%(id)07d" % { 'id': conceptId }

    res = "<concept id=\"" + conceptStr + "\" rank=\"" + concept.rank + "\" freq=\"" + concept.frequency + "\">"
    res += "<name>" + xml_str_encoder(concept.conceptName) + "</name>"
    res += outputSemanticTypes(concept.semanticType)
    res += outputTerms(concept.term)
    res += "</concept>"
    return res

def outputConcepts(concepts):
    res = ""
    if is_sort_of_a_list(concepts):
        for concept in concepts:
            res += outputConcept(concept)
    else:    
        res += outputConcept(concepts)    
    return res
 
def indexText(text):
    url       = 'http://mi-biosemantiek1.erasmusmc.nl:8080/PeregrineWebservice/PeregrineWebserviceImplPort'
    #url       = 'http://aneurist.erasmusmc.nl/PeregrineWebservice/PeregrineWebserviceImplPort'
    namespace = 'http://service.app.biosemantics.org/'
    server    = SOAPProxy(url)    
    
    server._ns(namespace).index(arg0 = text) 
    XML = server._ns(namespace).XML(arg0 = 1)

    output = "<fingerprint>"
    clusterCount = XML.conceptCount
    output += "<concepts count=\"" + XML.conceptCount + "\" clusters=\"" + str(clusterCount) + "\"/>"
    output += outputLines(XML.sentences)
    try:
        output += outputConcepts(XML.resultConcept)
    except:
        output += ""

    output += "</fingerprint>"
    return output
