#!/bin/bash
# This script pulls latest version of the Identifo user panel and then builds it.

# Fetch and build source code.
wget https://github.com/MadAppGang/identifo-admin/archive/master.zip
unzip master.zip
cd identifo-admin-master
rm .env
export BASE_URL=/adminpanel/ && export ASSETS_PATH=/adminpanel/ # Needed for build.
npm i
npm run build

# Update build directory content.
rm -rf ../build
mv build/ ../

# Clean up.
cd ../
rm -f master.zip
rm -fr identifo-admin-master
