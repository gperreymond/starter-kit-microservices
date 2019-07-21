# Lalalab Development Bootstrap

First time ELK stack is created, it could be long, because these three components have to be build from docker files.

̀̀̀## Prepare your machine

#### Troubles with elasticsearch

- sudo sysctl -w vm.max_map_count=262144
- sudo sysctl -w fs.file-max=65536

#### Docker engines

Having __docker__ and __docker-compose__ ready to use.

## Listing of infrastructure components

#### commons

- traefik: https://traefik.docker.localhost

#### backends

- rabbitmq: https://portainer.docker.localhost
- postgres
- mysql
- logstash
- elasticsearch
- redis
- nats: https://nats.docker.localhost

#### frontends

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
