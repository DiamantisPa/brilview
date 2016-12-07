import os
import flask
import json
from handlers import cmmdhandler
from brilview import config

app = flask.Flask(__name__)

def init_app(instance_path, config_dict,log):
    #consumes the flask config
    myapp = flask.Flask(__name__, instance_relative_config=True)
    if config_dict.has_key('flask'):
        app.config.update(config_dict['flask'])
    app.instance_path = instance_path
    #update global appconfig
    config.appconfig = { x:config_dict[x] for x in config_dict.keys() if x!='flask' }
    log.debug( 'current app config %s '%str(config.appconfig) )
    
    return app

@app.route('/')
def root():
    return 'welcome to brilview API'

@app.route('/query', methods=['GET', 'POST'])
def query():
    data = flask.request.json
    if data is None:
        return ('Bad request. Query body must be not empty.', 400)
    run_from = data['from']
    run_to = data['to']
    
    handlername = 'brilcommandhandler'
    
    command = os.path.abspath( os.path.join(os.path.dirname( __file__ ), '..', '..','..','bin','brilcalc') )
    condabase = None

    if config.appconfig.has_key(handlername):
        if config.appconfig.has_key('command') and config.appconfig['command']:
            command = config.appconfig[handlername]['command']
        if config.appconfig.has_key('condabase') and config.appconfig['condabase']:
            condabase = appconfig[handlername]['condabase']
    
    result = cmmdhandler.brilcalcLumiHandler(
        ['--begin', str(run_from), '--end', str(run_to)],
        cmmd=[cmdbase])
    return flask.Response(json.dumps(result), mimetype='application/json')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port='9000')
