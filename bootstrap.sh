#!/bin/bash

if [ "$1" = '--start' ]; then
  docker stack deploy -c infrastructure/docker-compose.traefik.yml proxy
  docker stack deploy -c infrastructure/docker-compose.portainer.yml portainer
  docker stack deploy -c infrastructure/docker-compose.databases.yml databases
  docker stack deploy -c infrastructure/docker-compose.brokers.yml brokers
fi

if [ "$1" = '--start-elk' ]; then
  docker stack deploy -c infrastructure/docker-compose.elk.yml elk
fi

if [ "$1" = '--start-grafana' ]; then
  docker stack deploy -c infrastructure/docker-compose.grafana.yml grafana
fi

if [ "$1" = '--stop' ]; then
  docker stack rm proxy
  docker stack rm portainer
  docker stack rm elk
  docker stack rm databases
  docker stack rm brokers
  docker stack rm grafana
fi
