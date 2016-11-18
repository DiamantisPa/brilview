import flask
from flask import request

app = flask.Flask(__name__)

@app.route('/')
def hello_world():
    return 'hello world'

def run():
    app.run(debug=False, threaded=True)

