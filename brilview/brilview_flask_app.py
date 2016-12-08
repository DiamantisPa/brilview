import os
import flask
import json
from handlers import cmmdhandler
from brilview import config


# static_url_path is hardcoded because it cannot be changed after creating app,
# but there should not be need to make it different than empty string
app = flask.Flask(__name__, static_url_path='')


def init_app(instance_path, config_dict, log):
    app.instance_path = instance_path
    if 'flask' in config_dict:
        app.config.update(config_dict['flask'])
        # workaround: static_folder is not picked from app.config
        if 'static_folder' in config_dict['flask']:
            app.static_folder = config_dict['flask']['static_folder']
        else:
            app.static_folder = '../web/'
    config.appconfig = {
        x: config_dict[x]
        for x in config_dict.keys()
        if x != 'flask'}
    log.debug('current app config {} '.format(str(config.appconfig)))
    return app


@app.route('/')
def root():
    return app.send_static_file('Default.htm')


@app.route('/api/query', methods=['GET', 'POST'])
@app.route('/query', methods=['GET', 'POST'])
def query():
    data = flask.request.json
    if data is None:
        return ('Bad request. Query body must be not empty.', 400)
    run_from = data['from']
    run_to = data['to']

    handlername = 'brilcommandhandler'

    command = os.path.abspath(
        os.path.join(
            os.path.dirname(__file__), '..', '..', '..', 'bin', 'brilcalc'))

    if handlername in config.appconfig:
        handler = config.appconfig[handlername]
        if 'command' in handler and handler['command']:
            command = handler['command']

    result = cmmdhandler.brilcalcLumiHandler(
        ['--begin', str(run_from), '--end', str(run_to)],
        cmmd=[command])
    return flask.Response(json.dumps(result), mimetype='application/json')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port='9001')
