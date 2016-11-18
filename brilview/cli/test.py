import flask
import threading
import requests
import webbrowser
import time
app = flask.Flask(__name__)
@app.route('/')
def hello_world():
    return 'hello world'
def run():
    app.run(debug=False, threaded=True)

if __name__=='__main__':
    flask_thread = threading.Thread(target=run)
    flask_thread.daemon = True
    flask_thread.start()
    try:
        while(requests.get('http://localhost:5000/').text != 'hello world'):
            time.sleep(1)
        webbrowser.open('http://localhost:5000/')
        while(True):
            time.sleep(10)
    except KeyboardInterrupt:
        pass        
