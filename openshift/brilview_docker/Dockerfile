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
  mkdir /brilview_tmp 
COPY brilview_openshift_dev.yaml /brilview_tmp 
COPY frontier_config.xml /brilview_tmp
RUN useradd brilview
RUN chown brilview -R /brilview_tmp
EXPOSE 1495
USER brilview
CMD ["/opt/brilconda/bin/brilview","--config","/brilview_tmp/brilview_openshift_dev.yaml"] 
