import flask
import urllib2
import json


BASE = '/api'
REMOTE_HOST = 'vocms063.cern.ch'
REMOT_API_PORT = '9000'
REMOTE_API = 'http://' + REMOTE_HOST + ':' + REMOT_API_PORT
app = flask.Flask(__name__)


@app.route(BASE)
def api():
    return 'welcome to brilview request forwarder'


@app.route(BASE + '/query', methods=['GET', 'POST'])
def forward_to_server():
    data = flask.request.json
    if data is None:
        return ('Bad request. Body is empty?', 400)
    req = urllib2.Request(
        REMOTE_API + '/query',
        json.dumps(data),
        {'Content-Type': 'application/json'})
    response = urllib2.urlopen(req)
    result = response.read()
    return flask.Response(result, mimetype='application/json')


@app.route(BASE + '/vocms-test')
def vocms_test():
    request = urllib2.urlopen('http://' + REMOTE_HOST)
    data = request.read()
    request.close()
    return data


if __name__ == '__main__':
    app.run(debug=True)
