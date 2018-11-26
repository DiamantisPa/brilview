FROM openshift/base-centos7
RUN curl -sL https://rpm.nodesource.com/setup_10.x | bash -
RUN yum install epel-release -y \
 && yum install nodejs -y \
 && yum update openssl openssl-devel -y \
 && npm install -g yarn
COPY containerfiles .
RUN chmod 777 -R .
CMD ["/opt/app-root/src/build_brilview_client.sh"]
