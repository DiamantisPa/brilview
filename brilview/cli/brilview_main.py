docstr="""Usage: brilview [options]

Options:
     -h, --help                                 Show this screen
     --debug                                   Debug mode
     --daemon                                Daemon mode 
     --without-browser                   Run application server only
     --config CONFIG                     Server config
     --pidfile PIDFILE                      pid file name [default: brilview.pid]
     --host HOST                            host name [default: localhost]
     --port PORT                             port [default: 8765]  
     --user USER                            user
     --group GROUP                       group
     
"""
import sys
import os
sys.path.insert(0,os.path.dirname(sys.executable)+'/../lib/python2.7/site-packages/') #ignore other PYTHONPATH

import logging
import docopt
import requests
import webbrowser
import brilview
from datetime import datetime
import cherrypy as cp
from cherrypy.process import plugins
from brilview import brilview_flask_app 

log = logging.getLogger('brilview')
logformatter = logging.Formatter('%(levelname)s %(name)s %(message)s')
log.setLevel(logging.ERROR)
ch = logging.StreamHandler()
ch.setFormatter(logformatter)
log.addHandler(ch)

def run_in_cp_tree(app, host='localhost', port=8765, daemonize=None, pidfile=None, user=None, group=None, config=None):        
    cp.engine.signals.subscribe()
    cp.tree.graft(app, '')
    cp.config.update({
         'engine.autoreload.on': True,
        'log.screen': True,
         'server.socket_port': port,
         'server.socket_host': host
     })
    if daemonize:
        cp.config.update({'log.screen': False})
        plugins.Daemonizer(cp.engine).subscribe()
    if pidfile:
        plugins.PIDFile(cp.engine, pidfile).subscribe()
    if user or group:
        plugins.DropPrivileges(cp.engine, uid=user, gid=group).subscribe()
    if config:
        cp.config.update(config)
    cp.engine.start()
    cp.engine.block()
    
def brilview_main(progname=sys.argv[0]):    
    argv = sys.argv[1:]
    parseresult = docopt.docopt(docstr,argv,help=True,version=brilview.__version__,options_first=True)

    if parseresult['--debug']:
        log.setLevel(logging.DEBUG)
    
    log.debug('global arguments: %s',parseresult)   
    host =  parseresult['--host']
    port= int(parseresult['--port'])
    if not parseresult['--daemon']:
        if not parseresult['--without-browser']:
            webbrowser.open('http://'+host+':'+str(port)+'/')
        run_in_cp_tree(brilview_flask_app .app, host=host, port=port, daemonize=False )
    else:
        #if not parseresult['--config']:
        #  print '--config option is required for daemon mode'
        #  sys.exit(0)
        run_in_cp_tree(brilview_flask_app.app , host=host, port=port, daemonize=True, config=parseresult['--config'])
        pid = os.getpid()
        print 'Process started at pid ',pid
    return

    
