import flask
import json
from brilview import config, queryrouter


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
    result = queryrouter.query(data)
    return flask.Response(json.dumps(result), mimetype='application/json')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port='9001')
