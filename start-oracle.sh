#!/bin/bash

# Start the docker container if it's not already running
if [ ! "$(docker ps -q -f name=myoracledb)" ]; then
    echo "Starting Oracle Database container..."
    docker start myoracledb
    echo "Waiting a few seconds for DB to wake up..."
    sleep 3
else
    echo "Oracle Database is already running."
fi

# Set up Oracle Client environment variables
export LD_LIBRARY_PATH=/opt/oracle/instantclient_23_26:$LD_LIBRARY_PATH
export PATH=/opt/oracle/instantclient_23_26:$PATH

# Connect to the database
echo "Connecting to Oracle..."
sqlplus system/welcome@//localhost:1521/XE
