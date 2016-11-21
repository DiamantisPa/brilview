# BRIL data inspector with web GUI

## Setup

1. Upload `web` directory contents to https://dfs.cern.ch/dfs/websites/b/brilview (DFS).
2. Start server on `vocms063`:

    ```
    cd brilview
    cherryd -c brilview.cherrypy.config -i brilview_flask_app.app -d
    ```
