FROM openshift/base-centos7

RUN yum install -y epel-release\
 && yum install -y nginx\
 && wget https://dl.influxdata.com/telegraf/releases/telegraf-1.2.1.x86_64.rpm\
 && yum localinstall -y telegraf-1.2.1.x86_64.rpm\
 && rm telegraf-1.2.1.x86_64.rpm\
 && yum clean all


RUN chmod 777 -R /var/log/\
 && chmod 777 -R /var/lib/

EXPOSE 8080

CMD /start.sh

COPY containerfiles /

RUN chmod 777 /start.sh
