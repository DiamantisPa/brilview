FROM openshift/base-centos7
RUN yum install epel-release -y \
 && yum install nginx -y \
 && yum install net-tools -y \
 && yum install npm -y \
 && yum clean all \
 && chmod 777 /var/log/nginx \
 && chmod 777 -R /var/lib/nginx
EXPOSE 8080
COPY containerfiles /
CMD ["nginx"]
