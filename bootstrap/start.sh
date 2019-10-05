#!/bin/bash

docker stack deploy -c docker-compose.traefik.yml proxy

docker stack deploy -c docker-compose.portainer.yml portainer
docker stack deploy -c docker-compose.elk.yml elk
docker stack deploy -c docker-compose.databases.yml databases
docker stack deploy -c docker-compose.brokers.yml brokers
docker stack deploy -c docker-compose.thumbor.yml thumbor
