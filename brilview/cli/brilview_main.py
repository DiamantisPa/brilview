docstr="""Usage: brilview [options]

Options:
     -h, --help                                 Show this screen
     --debug                                   Debug mode
     --daemon                                Daemon mode 
     --without-browser                   Run application server only
     --config CONFIG                      Server config file
     --host HOST                            host name [default: localhost]
     --port PORT                             port [default: 8765]  
     --pidfile PIDFILE                      pidfile[default: ]
     --user USER                            user
     --group GROUP                       group
     
"""
import sys
import os
import yaml
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

thispath = os.path.abspath( os.path.dirname( __file__ ) )

def run_in_cp_tree(app,  instance_path , host=None, port=None, daemonize=None,  pidfile=None, user=None, group=None, config=None):            
    cp.engine.signals.subscribe()    
    if config:                   
        cp.config.update(config)
        for fkey in ['log.error_file']:
            if config.has_key(fkey) and not os.path.isabs( config[fkey] ):
                cp.config.update( { fkey: os.path.join(instance_path,fkey) } )
            
    if  daemonize:
        cp.config.update( { 'log.screen': False} )
        plugins.Daemonizer(cp.engine).subscribe()
        
    if host:
        cp.config.update( {'server.socket_host': host } )
    if port:
        cp.config.update( {'server.socket_port': port } )
          
    if user or group:
        plugins.DropPrivileges(cp.engine, uid=user, gid=group).subscribe()            

    if pidfile: #if it is daemon, the caller ensures pidfile is supplied
        if not os.path.isabs(pidfile):
            pidfile = os.path.join( instance_path , pidfile )
        plugins.PIDFile(cp.engine, pidfile).subscribe()    
    log.debug( 'host: %s, port: %s, pidfile: %s, user: %s, group: %s'%(host,port,pidfile,user,group) )
    cp.tree.graft(app, script_name='/')         
    try:
        cp.engine.start()        
    except:
        sys.exit(1)
    else:
        cp.engine.block()
    
def brilview_main(progname=sys.argv[0]):    
    argv = sys.argv[1:]
    parseresult = docopt.docopt(docstr,argv,help=True,version=brilview.__version__,options_first=True)
    log.debug('global arguments: %s',parseresult)
    
    if parseresult['--debug']:
        log.setLevel(logging.DEBUG)
        
    pidfile = parseresult['--pidfile']
    
    if not parseresult['--config']: #if no config file is specified, use the default one in directory ../data
        configfile = os.path.abspath(os.path.join(thispath, '..', 'data','brilview_default.yaml'))
    else:
        configfile = os.path.abspath(parseresult['--config'])
        
    config_dict = {}
    with open(configfile,'r') as f:
        try:
            config_dict = yaml.load(f)
        except yaml.YAMLError as exc:
            print (exc)
    
    cherrypyconfig = None
    if config_dict.has_key('cherrypy'):
        cherrypyconfig = config_dict['cherrypy']
    
    host = parseresult['--host']
    if not host:
        host = 'localhost'
    port = int(parseresult['--port'])

    appconfig =  {x:config_dict[x] for x in  config_dict.keys() if x!='cherrypy'}
    instance_path = os.path.join( thispath,'..')
    print 'appconfig ',appconfig
    if appconfig.has_key('instance_path') and appconfig['instance_path'] :
        if not  os.path.isabs( appconfig['instance_path'] ):
            raise ValueError('instance_path attribute must be absolute path')
        instance_path = appconfig['instance_path'] 
    log.info('instance_path: %s'%instance_path)
    
    app = brilview_flask_app.init_app(instance_path,appconfig,log)    
    if not parseresult['--daemon']:
        if not parseresult['--without-browser']:
            url = 'http://'+host+':'+str(port)+'/'
            log.debug( 'Opening default browser at %s'%url )
            webbrowser.open(url)        
        run_in_cp_tree(app, instance_path, host=host, port=port, daemonize=False,  pidfile=pidfile, config=cherrypyconfig)
    else:
        run_in_cp_tree(app, instance_path, host=host, port=port, daemonize=True,  pidfile=pidfile, config=cherrypyconfig)
    return


    
