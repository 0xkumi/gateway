#!/usr/bin/env bash

# Exit script as soon as a command fails.
set -o errexit

# Executes cleanup function at script exit.
trap cleanup EXIT

cleanup() {
  # Kill the testrpc instance that we started (if we started one and if it's still running).
  if [ -n "$ganachePID" ] && ps -p $ganachePID > /dev/null; then
    echo "Kill ganachi $serverPID"
    kill -9 $ganachePID
  fi

  if [ -n "$serverPID" ] && ps -p $serverPID > /dev/null; then
    echo "Kill server $serverPID"
    kill -9 $serverPID
  fi

  docker rm -f test_mongo
}

mkdir -p logs

echo "Start mongo ..."
docker run -d -p 27017:27017 --name test_mongo mongo

# wait for testbed startup
echo "Start ganache ..."
ganache-cli --gasLimit 0xfffffffffff > logs/test_ganache.log &
ganachePID=$!

sleep 2s

source resources/dev_config.sh 
node src/server > logs/test_server.log &
serverPID=$!
echo "Run server ..."

sleep 2s

mocha --timeout 15000 $1

sleep 1s



