import flask
import json
import logging
from brilview import config, queryrouter, bvlogging


# static_url_path is hardcoded because it cannot be changed after creating app,
# but there should not be need to make it different than empty string
app = flask.Flask(__name__, static_url_path='')


def init_app(instance_path):
    app.instance_path = instance_path
    app.logger.handlers = []
    app.logger.addHandler(bvlogging.get_handler())

    if 'flask' in config:
        app.config.update(config['flask'])
        # workaround: static_folder is not picked from app.config
        if 'static_folder' in config['flask']:
            app.static_folder = config['flask']['static_folder']
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


def main():
    main_handler = bvlogging.get_handler()
    app.logger.handlers = []
    app.logger.addHandler(main_handler)
    wzlog = logging.getLogger('werkzeug')
    wzlog.handlers = []
    wzlog.addHandler(main_handler)
    app.run(host=config.host, port=config.port)


if __name__ == '__main__':
    main()
