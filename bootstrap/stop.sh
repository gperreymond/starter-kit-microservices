#!/bin/bash

docker stack rm portainer
docker stack rm elk
docker stack rm databases
docker stack rm brokers

docker stack rm proxy
