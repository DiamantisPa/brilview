# BRIL data inspector with web GUI

Documentation [http://brilview.readthedocs.io](http://brilview.readthedocs.io)

## Run

```
python brilview-run.py --config brilview/data/brilview_dev.yaml
```

## Configuration YAML file

Sample configuration files are committed in brilview/data

The server configuration used in production in OpenShift is in openshift/brilview/containerfiles/brilview_tmp/brilview_openshift_prod.yaml

## Types of queries to server

timelumi(cmmd), livebestlumi(db), atlaslumi(db), bxlumi(cmmd), iovtags(db), normtags(os)

#### timelumi

Input: begin(str), end(str), unit(str), beamstatus(str), normtag(str), datatag(str), hltpath(str) type(str), selectjson(str), byls(bool), without_correction(bool), pileup(bool), minbiasxsec(float) 

#### bxlumi

Input: runnum(int), lsnum(int), normtag(int), type(str), without_correction(bool), unit(str)

#### normtags

Input: None 

#### livebestlumi

Input: latest, since, 

#### atlaslumi

Input: fillnum or None

## Example server test

```
curl -XPOST localhost:9001/query -H 'Content-Type: application/json' --data '{"query_type": "timelumi", "begin": 6650, "end":6650}'
```
