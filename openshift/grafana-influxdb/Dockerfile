FROM openshift/base-centos7

RUN wget https://dl.influxdata.com/telegraf/releases/telegraf-1.2.1.x86_64.rpm\
 && yum localinstall -y telegraf-1.2.1.x86_64.rpm\
 && rm telegraf-1.2.1.x86_64.rpm\
 && wget https://dl.influxdata.com/influxdb/releases/influxdb-1.2.2.x86_64.rpm\
 && yum localinstall -y influxdb-1.2.2.x86_64.rpm\
 && rm influxdb-1.2.2.x86_64.rpm\
 && yum install -y https://s3-us-west-2.amazonaws.com/grafana-releases/release/grafana-4.2.0-1.x86_64.rpm\
 && yum clean all

COPY containerfiles /

RUN chmod 777 /var/lib/influxdb/\
 && chmod 777 -R /usr/share/grafana/\
 && chmod 777 -R /etc/grafana/\
 && chmod 777 -R /var/lib/grafana/\
 && chmod 777 -R /var/log/grafana/\
 && chmod 777 /run_influxdb.sh\
 && chmod 777 /run_grafana.sh\
 && chmod 777 /start.sh

CMD /start.sh