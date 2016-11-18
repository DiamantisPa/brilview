import flask
import json
#from handlers import brilcalc
from brilview import cmmdhandler

app = flask.Flask(__name__)


@app.route('/')
def root():
    return 'welcome to brilview API'


@app.route('/query', methods=['GET', 'POST'])
def forward_to_server():
    data = flask.request.json
    if data is None:
        return ('Bad request. Query body must be not empty.', 400)
    run_from = data['from']
    run_to = data['to']
    result = brilcalcLumiHandler(['--begin',str(run_from),'--end',str(run_to)] , cmmd=['/afs/cern.ch/cms/lumi/brilconda-1.1.7/bin/python','/home/data/brilws/brilcalc-run.py'])
    return flask.Response(json.dumps(result), mimetype='application/json')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port='6000')
