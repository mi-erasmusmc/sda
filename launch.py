import os.path
from mod_python import apache, Session, util


def handler(req):

	request = os.path.splitext(os.path.basename( req.uri ))[0]
	req.content_type = 'text/plain'
	req.send_http_header()

	status = apache.OK
	if request != None:
		mod = __import__(request)
		if request == "index":
			status = mod.handler(req)
		elif request == "index2":
			status = mod.handler(req)
		elif request == "index_ws":
			status = mod.handler(req)
		elif request == "index2_ws":
			status = mod.handler(req)
		elif request == "index2_nonws":
			status = mod.handler(req)		
		elif request == "sda":
			status = mod.handler(req)
		elif request == "sda2":
			status = mod.handler(req)
		elif request == "hl":
			status = mod.handler(req)
		elif request == "save":
			status = mod.handler(req)
		elif request == "open":
			status = mod.handler(req)
		elif request == "listfiles":
			status = mod.handler(req)
		elif request == "get":
			status = mod.handler(req)
		elif request == "annotate":
			status = mod.handler(req)
		elif request == "getannotators":
			status = mod.handler(req)
		elif request == "getjobs":
			status = mod.handler(req)
		elif request == "getpmids":
			status = mod.handler(req)
		return status
	
		
