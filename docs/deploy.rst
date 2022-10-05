Deploy
======

Central Brilview is hosted at CERN web services: https://webservices.web.cern.ch/webservices/Services/ManageSite/default.aspx?SiteName=brilview

All instructions bellow assume that you are inside ``openshift`` directory of
the Brilview project.

Log in to CERN Openshift
------------------------
Openshift 3:
.. highlight:: bash
::

  oc login https://openshift.cern.ch


Openshift 4:
.. highlight:: bash
::

  oc login https://api.paas.okd.cern.ch/ -u <username>

Openshift 4 - Playground:
.. highlight:: bash
::

  oc login https://api.paas-stg.okd.cern.ch/ -u <username>

First time setup for Openshift 3
----------------

Project Creation
^^^^^^^^^^^^^^^^

Go to https://webservices.web.cern.ch/webservices/ and "Create a new website" as "PaaS Web Application".

Go to "My websites" pick up the new site and "View quota usage", then change "flavor" to "Large".

Create CVMFS volume claim
^^^^^^^^^^^^^^^^^^^^^^^^^

Go to project web console https://openshift.cern.ch/console/project/brilview/

1. "Storage" -> "Create Storage"
2. Fill the form:

   a. "Storage Class": cvmfs-cms-bril.cern.ch
   b. "Name": cvmfs-bril
   c. "Access Mode": Read Only (ROX)
   d. "Size": 1 MiB

      See https://cern.service-now.com/service-portal?id=kb_article&n=KB0004390

3. Click "Create"

Deploy Brilview containers
^^^^^^^^^^^^^^^^^^^^^^^^^^

.. highlight:: bash
::

  oc create -f nginx/template.yaml
  oc start-build nginx-bc --from-dir=nginx
  oc create -f brilview/template.yaml
  oc start-build brilview-server-bc --from-dir=brilview
  oc create -f client-compiler/template.yaml
  oc start-build client-compiler-bc --from-dir=client-compiler
  oc create -f grafana-influxdb/template.yaml
  oc start-build grafana-influxdb-bc --from-dir=grafana-influxdb

Do not worry if nginx container is "crashing frequently" until client files are
compiled. Health check fails until nginx can serve index file.

Add CERN SSO
^^^^^^^^^^^^

Go to project web console https://openshift.cern.ch/console/project/brilview/
and add cern-sso-proxy:

1. Add "cern-sso-proxy" to project from "Catalog"
2. chose e-groups in AUTHORIZED_GROUPS (e.g. 'cern-users', 'cern-staff', 'CMS-BRIL-Project')
3. point to nginx-service in SERVICE_NAME
4. Click "Create"
5. Increase route timeout with command ``oc annotate route cern-sso-proxy --overwrite haproxy.router.openshift.io/timeout=600s``

https://cern.service-now.com/service-portal?id=kb_article&n=KB0005442

Note: cern-sso-proxy works with site globally unique in cern domain.
If the requested web site is already registered with other hosting service, e.g. AFS, EOS, the sso registration will fail.

First time setup for Openshift 4
----------------

Project Creation
^^^^^^^^^^^^^^^^

Go to https://webservices.web.cern.ch/webservices/ and "Create a new website" as "PaaS Project".

Select "Official", add "Project name" and "Project description".

Note: More information in the below link
https://paas.docs.cern.ch/1._Getting_Started/1-create-paas-project/

Create CVMFS volume claim
^^^^^^^^^^^^^^^^^^^^^^^^^

Go to project web console https://paas.cern.ch/k8s/cluster/projects/brilview/

1. Change profile "Developer" to "Administrator"
2. "Storage" -> "PersistentVolumeClaims" -> "Create PersistentVolumeClaims"
3. Fill the form:

   a. "Storage Class": cvmfs-cms-bril.cern.ch
   b. "Name": cvmfs-bril
   c. "Access Mode": Read Only (ROX) or Read Write Many (RWX)
   d. "Size": 1 MiB

      See https://paas.docs.cern.ch/3._Storage/cvmfs/

3. Click "Create"

Deploy Brilview containers
^^^^^^^^^^^^^^^^^^^^^^^^^^

.. highlight:: bash
::

  oc create -f nginx/template.yaml
  oc start-build nginx-bc --from-dir=nginx
  oc create -f brilview/template.yaml
  oc start-build brilview-server-bc --from-dir=brilview
  oc create -f client-compiler/template.yaml
  oc start-build client-compiler-bc --from-dir=client-compiler
  oc create -f grafana-influxdb/template.yaml
  oc start-build grafana-influxdb-bc --from-dir=grafana-influxdb

Do not worry if nginx container is "crashing frequently" until client files are
compiled. Health check fails until nginx can serve index file.

Add CERN SSO
^^^^^^^^^^^^

Go to project web console https://paas.cern.ch/k8s/cluster/projects/brilview/
as a "Developer":

1. Click in "+Add"
2. Search for "sso" and click on "Install Helm Chart"
3. In "Upstream Application" -> "Service definition" point to 
  a. SERVICE_NAME: nginx-service 
  b. Port: 8000
4. In "Routing Configuration" add "Public Application Hostname": brilview
5. In "Authentication Options" -> "Allowed Role" choose e-groups in AUTHORIZED_GROUPS (e.g. 'cern-users', 'cern-staff', 'CMS-BRIL-Project')
6. Click "Create"

https://paas.docs.cern.ch/4._CERN_Authentication/2-deploy-sso-proxy/

Note: cern-sso-proxy works with a site globally unique in cern domain.
If the requested website is already registered with other hosting service, e.g. AFS, EOS, the sso registration will fail.



Build frontend client
^^^^^^^^^^^^^^^^^^^^^

After all builds and deployments are finished see section :ref:`update-client` to
fetch client side code from git repository, run build process and populate
shared volume for nginx to serve.

Make Brilview public
^^^^^^^^^^^^^^^^^^^^

Change website visibility from "Intranet" to "Internet": https://cern.service-now.com/service-portal/article.do?n=KB0004359

Go to "Web Services site" and click on "Manage my websites"

Select the site you want to expose from the list of "My websites"

Click on "Site access & Permissions"

Choose between Internet and Intranet

Please note that websites of type 'Test' cannot be exposed outside the CERN network.

.. _update-client:
Updating web client
--------------------

Temporarily scale down ``brilview-server`` pods from 2 to 1 to free some resources
for client building, then scale up client-compiler from 0 to 1, watch logs, when
finished, scale client-compiler back to 0 and scale brilview-server back to 2.

Updating server
---------------

For production deployment, the brilview code must have a version tag in the git repository, and the file /openshfit/brilview/Dockerfile should contain the new git tag. The tagging step is required in order to always trigger a docker image update.

Temporarily scale down ``brilview-server`` pods from 2 to 1 to free some resources for server building.

::

  oc start-build brilview-server-bc --from-dir=brilview

When finished, scale brilview-server back to 2.


Monitoring
----------

Find pod containing Grafana::

  oc get pods

Forward port 3000 to your machine::

  oc port-forward grafana-influxdb-dc-<some_identifiers_you_found_with_above_command> 3000

Visit ``localhost:3000``.

If it is the first time after a Grafana deployment, then login with user: ``admin`` and pass: ``admin`` and:

1. Add data source (name: ``my-influx``, type: ``InfluxDB``, url: ``http://localhost:8086``, access: ``proxy``, database: ``telegraf``)
2. Create whatever dashboard needed or import (copy/paste the text) from the file ``grafana-influxdb/dashboard.json``
3. Change host names for all graphs to match the ones returned by ``oc get pods`` by clicking Edit -> Metrics (Grafana queries influxdb and gives suggestions in dropdowns)

Tips
----

If there is no space (or you want more resources) for build/deploy containers -
scale down ``brilview-server`` to one pod, do stuff, then scale back to 2.
