FROM openshift/base-centos7

RUN yum install -y nc
RUN useradd brilview 
COPY server.sh /tmp/server.sh
RUN chmod 777 /tmp/server.sh
USER brilview
EXPOSE 1500
CMD /tmp/server.sh

