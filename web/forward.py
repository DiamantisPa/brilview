import flask
import urllib
import urllib2

BASE = '/api'
REMOTE_HOST = 'vocms063.cern.ch'
REMOT_API_PORT = '6000'
REMOTE_API = 'http://' + REMOTE_HOST + REMOT_API_PORT
app = flask.Flask(__name__)


@app.route(BASE)
def api():
    return 'welcome to brilview request forwarder'


@app.route(BASE + '/query', methods=['GET', 'POST'])
def forward_to_server():
    data = flask.request.json
    if data is None:
        return ('Bad request', 400)
    data = urllib.ulencode(data)
    req = urllib2.Request(REMOTE_API + '/query', data)
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
    app.run()
