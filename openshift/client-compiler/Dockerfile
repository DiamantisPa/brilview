FROM openshift/base-centos7
RUN yum install epel-release -y \ \
 && yum install -y nodejs \
 && yum update openssl openssl-devel -y \
 && npm install -g yarn
RUN touch ~/.bashrc \
 && curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash \
 && source ~/.bashrc \
 && nvm install 12
COPY containerfiles .
RUN chmod 777 -R .
CMD ["/opt/app-root/src/build_brilview_client.sh"]
