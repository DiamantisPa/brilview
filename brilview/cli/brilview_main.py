docstr="""Usage:
   brilview [options]

Options:
  -h, --help                       Show this screen
  --debug                         Debug mode
  --warn                           Show warnings
  --daemon                      Daemon mode
  --config                         Server config
  --sitelocalconfig            frontier config file location
  
"""
import sys
import os
sys.path.insert(0,os.path.dirname(sys.executable)+'/../lib/python2.7/site-packages/') #ignore other PYTHONPATH

import logging
import docopt
import flask
import threading
import time
import requests
import webbrowser
import brilview
from brilview import server
from datetime import datetime
log = logging.getLogger('brilview')
logformatter = logging.Formatter('%(levelname)s %(name)s %(message)s')
log.setLevel(logging.ERROR)
ch = logging.StreamHandler()
ch.setFormatter(logformatter)
log.addHandler(ch)

def brilview_main(progname=sys.argv[0]):    
    args = {}
    argv = sys.argv[1:]
    args = docopt.docopt(docstr,argv,help=True,version=brilview.__version__,options_first=True)

    if args['--debug']:
        log.setLevel(logging.DEBUG)
    elif args['--warn']:
        log.setLevel(logging.WARNING)
        
    log.debug('global arguments: %s',args)   
    parseresult = docopt.docopt(docstr,argv=argv)
    
    if not parseresult['--daemon']:
        flask_thread = threading.Thread(target=server.run)
        flask_thread.daemon = True
        flask_thread.start()
        try:
            time.sleep(2)
            webbrowser.open('http://localhost:5000/')
            while(True):
                time.sleep(10)                
        except KeyboardInterrupt:
            pass
    else:
        server.run()
    return

    
