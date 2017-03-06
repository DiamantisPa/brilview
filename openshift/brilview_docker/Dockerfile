FROM openshift/base-centos7

RUN yum install -y libaio && \
  wget -q https://cern.ch/cmslumisw/installers/linux-64/Brilconda-1.1.7-Linux-x86_64.sh && \
  mkdir -p /opt && \
  rm -rf /opt/brilconda && \
  bash ./Brilconda-1.1.7-Linux-x86_64.sh -b -p /opt/brilconda && \
  rm ./Brilconda-1.1.7-Linux-x86_64.sh && \
  /opt/brilconda/bin/pip install brilws
CMD ["/bin/sh","-c","tail -f /dev/null"] 
