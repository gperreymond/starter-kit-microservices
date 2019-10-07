#!/bin/bash

docker stack rm proxy

docker stack rm portainer
docker stack rm elk
docker stack rm databases
docker stack rm brokers
docker stack rm thumbor
docker stack rm scribus
