FROM openshift/base-centos7
RUN yum install epel-release -y \
 && yum install npm -y \
 && yum clean all \
 && npm install -g yarn
COPY containerfiles .
RUN chmod 777 -R .
CMD ["/opt/app-root/src/build_brilview_client.sh"]
