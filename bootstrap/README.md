# Development Bootstrap

__Based on docker, docker-compose and swarmMode.__

#### Documentations

- https://sysadmins.co.za/traefik-and-portainer-on-docker-swarm-with-letsencrypt/

#### Troubles with elasticsearch

- sudo sysctl -w vm.max_map_count=262144
- sudo sysctl -w fs.file-max=65536

## Listing of infrastructure components

#### commons

- traefik: https://traefik.docker.localhost
- portainer: https://portainer.docker.localhost

#### brokers

- rabbitmq
- nats

#### databases

- postgres
- mysql
- couchbase
- elasticsearch

#### others

- logstash

#### frontends

- rabbitmq: https://portainer.docker.localhost
- couchbase: https://couchbase.docker.localhost
- kibana: https://kibana.docker.localhost

## Usages

#### Running the infrastructure
Start all components.

```sh
./start.sh
```

#### Stopping the infrastructure
Stop and remove all components.

```sh
./stop.sh
```
