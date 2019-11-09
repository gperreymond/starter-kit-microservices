#!/bin/bash

docker network create -d overlay --attachable global

if [ "$1" = '--prepare-oryd' ]; then
  docker run -it --rm \
    --network global \
    oryd/hydra:v1.0.9 \
    migrate sql postgres://infra:infra@postgres:5432/hydra?sslmode=disable
fi

if [ "$1" = '--start' ]; then
  docker stack deploy -c infrastructure/docker-compose.traefik.yml proxy
  docker stack deploy -c infrastructure/docker-compose.portainer.yml portainer
  docker stack deploy -c infrastructure/docker-compose.databases.yml databases
  docker stack deploy -c infrastructure/docker-compose.brokers.yml brokers
fi

if [ "$1" = '--start-elk' ]; then
  docker stack deploy -c infrastructure/docker-compose.elk.yml elk
fi

if [ "$1" = '--start-oryd' ]; then
  docker stack deploy -c infrastructure/docker-compose.oryd.yml oryd
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
  docker stack rm oryd
fi
