#!/bin/sh

docker rmi gperreymond/scribus-server
docker rmi gperreymond/scribus-server:1.5.5-ubuntu

docker build -t gperreymond/scribus-server .
docker tag gperreymond/scribus-server gperreymond/scribus-server:1.5.5-ubuntu

docker push gperreymond/scribus-server
docker push gperreymond/scribus-server:1.5.5-ubuntu
