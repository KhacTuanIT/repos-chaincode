#!/bin/sh
echo "I'm setup now!"
echo "Let nap a little bit bros....."
minifab down

minifab cleanup

minifab netup -o supply.teco.com -i 2.2 -l node -s couchdb -e true

[ ! -d "./vars/chaincode/teco" ] && mkdir ./vars/chaincode/teco

cp -r ../repos-chaincode/node ./vars/app/

cp -r ../repos-chaincode/app-node ./vars/app/

cp -r ../repos-chaincode/teco ./vars/chaincode/

minifab create,join -c ecsupply

minifab channelquery

minifab channelsign,channelupdate

minifab anchorupdate,profilegen

minifab ccup -n teco -l node -v 1.0 -d true -p '"initProductLedger"'

minifab invoke -n teco -p '"queryProduct","LAP0000001"'

cp ./vars/profiles/ecsupply_connection_for_nodesdk.json ./vars/app/app-node

mv ./vars/app/app-node/ecsupply_connection_for_nodesdk.json ./vars/app/app-node/connection.json