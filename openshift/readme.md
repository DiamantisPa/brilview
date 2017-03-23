## First time setup
```
oc create -f templates/full.yaml
oc start-build client-compiler-bc --from-dir=client_compiler_docker/
oc start-build nginx-bc --from-dir=nginx_docker/
oc start-build brilview-server-bc --from-dir=brilview_docker/
```

Go to project web console https://openshift.cern.ch/console/project/brilview/ and add cern-sso-proxy:

1. "Add to project"
2. "Uncategorized"
3. "cern-sso-proxy"
4. chose e-groups and point to nginx-service

After all builds and deployments are finished see section _Updating client_ to fetch client side code from git repository, run build process and populate shared volume for nginx to serve.

## Updating server

```
oc start-build brilview-server-bc --from-dir=brilview_docker/
```

## Updating client

Temporarily scale down brilview-server pods from 2 to 1 to free some resources for client building, then scale up client-compiler from 0 to 1, watch logs, when finished, scale client-compiler back to 0 and scale brilview-server back to 2.
