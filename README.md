# BRIL data inspector with web GUI

Documentation [http://brilview.readthedocs.io](http://brilview.readthedocs.io)

## Run

```
python brilview-run.py --config brilview/data/brilview_dev.yaml
```

## Configuration YAML file

Sample configuration files are committed in brilview/data

The server configuration used in production in OpenShift is in openshift/brilview/containerfiles/brilview_tmp/brilview_openshift_prod.yaml

## Example server test

```
curl -XPOST localhost:9001/query -H 'Content-Type: application/json' --data '{"query_type": "timelumi", "begin": 6650, "end":6650}'
```