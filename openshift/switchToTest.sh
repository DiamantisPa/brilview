#!/bin/bash
if [ -f brilview/Dockerfile.prod ]
then
   echo 'already in TEST'
   exit
fi
mv brilview/Dockerfile brilview/Dockerfile.prod
mv brilview/Dockerfile.test brilview/Dockerfile
mv client-compiler/containerfiles/build_brilview_client.sh client-compiler/containerfiles/build_brilview_client.sh.prod
mv client-compiler/containerfiles/build_brilview_client.sh.test client-compiler/containerfiles/build_brilview_client.sh
