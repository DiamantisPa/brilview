FROM openshift/base-centos7
RUN yum install epel-release -y 
RUN yum install -y nodejs 
RUN yum update openssl openssl-devel -y 
RUN node --version
RUN touch ~/.bashrc \
 && curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash \
 && source ~/.bashrc \
 && nvm install 14.14.0 \
 && nvm alias default 14 \
 && npm install -g yarn \
 && yarn --version
COPY containerfiles .
RUN chmod 777 -R .
CMD ["/opt/app-root/src/build_brilview_client.sh"]

