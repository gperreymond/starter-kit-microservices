#!/bin/sh

docker rmi gperreymond/thumbor
docker rmi gperreymond/thumbor:6.7.0-alpine

docker build -t gperreymond/thumbor .
docker tag gperreymond/thumbor gperreymond/thumbor:6.7.0-alpine

docker push gperreymond/thumbor
docker push gperreymond/thumbor:6.7.0-alpine
