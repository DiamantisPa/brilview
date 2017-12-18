#!/bin/bash
if [ -f brilview/Dockerfile.test ]
then
   echo 'already in PROD'
   exit
fi
mv brilview/Dockerfile brilview/Dockerfile.test
mv brilview/Dockerfile.prod brilview/Dockerfile
mv client-compiler/containerfiles/build_brilview_client.sh client-compiler/containerfiles/build_brilview_client.sh.test
mv client-compiler/containerfiles/build_brilview_client.sh.prod client-compiler/containerfiles/build_brilview_client.sh
