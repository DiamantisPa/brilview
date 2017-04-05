#!/bin/sh
if [ -d "brilview_src" ]; then
    rm -rf brilview_src/
fi
git config --global user.email "brilview-client-compiler"
git config --global user.name "brilview client compiler"
git clone https://github.com/jonasdaugalas/brilview.git --depth 1 brilview_src
cd brilview_src/brilview/web
yarn install # does not get killed, but fails to completely build
# npm config set jobs 1
# npm install --unsafe-perm # after yarn does not need to fetch deps. finish build
rm /client_files_for_serving/*
cp dist/* /client_files_for_serving/

echo "Finished. Going to sleep."
echo "To update client again: scale down to 0 pods, then scale up to 1"

trap 'trap - TERM; kill -s TERM -- -$$' TERM
tail -f /dev/null & wait
exit 0
