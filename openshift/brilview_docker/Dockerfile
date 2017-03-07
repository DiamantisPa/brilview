FROM openshift/base-centos7

RUN yum install -y libaio && \
  wget -q https://cern.ch/cmslumisw/installers/linux-64/Brilconda-1.1.7-Linux-x86_64.sh && \
  mkdir -p /opt && \
  bash ./Brilconda-1.1.7-Linux-x86_64.sh -b -p /opt/brilconda && \
  rm ./Brilconda-1.1.7-Linux-x86_64.sh && \
  /opt/brilconda/bin/pip install brilws
RUN git clone https://github.com/jonasdaugalas/brilview.git &> /dev/null && \
  cd brilview && \
  /opt/brilconda/bin/python ./setup.py install && \
  cd .. && \
  mkdir -p /opt/app-root/brilview_tmp 
EXPOSE 1495
# RUN groupadd -r brilview -g 1000 && useradd -u 1000 -g brilview -r -M -p \* -s /sbin/nologin brilview
RUN useradd -u 1000 -g root -r -M -p \* -s /sbin/nologin brilview
COPY brilview_openshift_dev.yaml /opt/app-root/brilview_tmp 
COPY frontier_config.xml /opt/app-root/brilview_tmp
RUN chown -R brilview:root /opt/app-root/brilview_tmp
RUN chmod -R 775 /opt/app-root/brilview_tmp
USER 1000
CMD ["/opt/brilconda/bin/brilview","--config","/opt/app-root/brilview_tmp/brilview_openshift_dev.yaml"] 
