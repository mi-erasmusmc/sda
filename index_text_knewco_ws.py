import sys
import string
import os
import traceback
import re
from   semgroups import semanticGroupTypeDict
from   SOAPpy import SOAPProxy

def is_sort_of_a_list(l):
    for method in ['__getitem__', '__setitem__']:
        if method not in dir(l):
            return False
    return True

def outputWords(words):
    if is_sort_of_a_list(words):
        startPosition = -1
        endPosition = -1
        for word in words:
            if startPosition != -1:
                startPosition = min( startPosition, int(word.startPosition) - 1 )
            else:
                startPosition = int(word.startPosition) - 1
            if endPosition != -1:
                endPosition = max( endPosition, int(word.startPosition) + int(word.length) - 1 )
            else:
                endPosition = int(word.startPosition) + int(word.length) - 1
    else:
        startPosition = int(words.startPosition)-1
        endPosition = int(words.startPosition) + int(words.length) - 1
    return { 'begin': startPosition, 'end': endPosition }
    
def outputTerms(terms):
    res = []
    if is_sort_of_a_list(terms):
        for term in terms:
            res.append( outputWords(term.word) )
    else:    
        res.append( outputWords(terms.word) )
    return res   
    
def outputSemanticTypes( semanticTypes ):
    res = []
    if is_sort_of_a_list(semanticTypes):
        for semanticType in semanticTypes:
            res.append( outputSemanticType( semanticType ) )
    else:
        res.append( outputSemanticType( semanticTypes ) )
    return res

def outputSemanticType( semanticType ):
    try:
        semanticGroup = semanticType.group
        semanticTypeName = semanticType.name
    except:
        try:
            semanticGroup = semanticGroupTypeDict[int(semanticType.id)]['group']
            semanticTypeName = semanticGroupTypeDict[int(semanticType.id)]['name']
        except:
            semanticGroup = "unknown"
            semanticTypeName = "unknown"
    return {'group': semanticGroup, 'type': semanticTypeName }

def outputConcept(concept):
    print "outputConcept(): #1"
    conceptId = int(concept.conceptId)
    if conceptId >= 2000000:
        conceptStr = "uniprot/" + str(conceptId)
    else:
        conceptStr = "umls/C%(id)07d" % { 'id': conceptId }
    
    semTypes = outputSemanticTypes(concept.semanticType)
    terms    = outputTerms(concept.term)
    return { 'id': conceptStr, 'terms': terms, 'semtypes': semTypes }

def indexText(text):
    url       = 'http://mi-biosemantiek1.erasmusmc.nl:8080/PeregrineWebservice/PeregrineWebserviceImplPort'
    #url       = 'http://aneurist.erasmusmc.nl/PeregrineWebservice/PeregrineWebserviceImplPort'
    namespace = 'http://service.app.biosemantics.org/'
    server    = SOAPProxy(url)    
    
    server._ns(namespace).index(arg0 = text) 
    XML = server._ns(namespace).XML(arg0 = 1)
    print XML
    result = []
    try:
        if is_sort_of_a_list(XML.resultConcept):
            print "outputConcept #2"
            for concept in concepts:
                result.append( outputConcept(concept) )
        else:    
            result.append( outputConcept(XML.resultConcept) )
        return result 
    except:    
        return result


#fdIn = open("/Users/mulligen/Documents/data/consumer health sites/3gram.frq")
fdIn = open("/Users/mulligen/Documents/data/consumer health sites/data.txt")
#fdOut = open( "/Users/mulligen/Documents/data/consumer health sites/3gram.out", "w" )
fdOut = open( "/Users/mulligen/Documents/data/consumer health sites/data.out", "w" )
linenr = 0
while True:
    line = fdIn.readline().replace("\n","").replace("\r","")
    if ( line == "" ):
        break
    linenr += 1
    print linenr
    sys.stdout.flush()
    pieces = line.split("\t")
    try:
        conceptTokenSemTypes = indexText(pieces[1][0:40])
        print pieces[1]
        print conceptTokenSemTypes
        
        for elt in conceptTokenSemTypes:
            conceptStr = ""
            if conceptStr != "":
                conceptStr + ", "
            termStr = ""
            for term in elt['terms']:
                if termStr != "":
                    termStr + "/"
                termStr += pieces[1][term['begin']:term['end']]
            conceptStr += elt['id'] + "[" + termStr + "]"
            fdOut.write( pieces[0] + "\t" + conceptStr + "\n" )
            fdOut.flush()
    except:
        conceptStr = "[error indexing]"
        


fdIn.close()
fdOut.close()

    
