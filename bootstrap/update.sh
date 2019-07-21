#!/bin/bash

docker-compose pull
docker-compose -f backends/docker-compose.yml pull
docker-compose -f frontends/docker-compose.yml pull
