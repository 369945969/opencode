#!/bin/bash

# Configuration
PORT=7070
if [ -f "opencode.json" ]; then
    # Simple extraction of port from JSON
    CONFIG_PORT=$(grep '"port":' opencode.json | sed -E 's/.*"port": "([^"]+)".*/\1/')
    if [ ! -z "$CONFIG_PORT" ]; then
        PORT=$CONFIG_PORT
    fi
fi

echo "Checking for processes on port $PORT..."
PID=$(lsof -t -i:$PORT)

if [ ! -z "$PID" ]; then
    echo "Killing process $PID..."
    kill -9 $PID
    sleep 1
else
    echo "No process found on port $PORT."
fi

echo "Starting NVIDIA Proxy on port $PORT..."
go run main.go
