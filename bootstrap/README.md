# Development Bootstrap

__Based on docker, docker-compose and swarm mode.__

```sh
docker swarm init
```

#### Troubles with elasticsearch

- sudo sysctl -w vm.max_map_count=262144
- sudo sysctl -w fs.file-max=65536

## Listing of infrastructure components

#### commons

- traefik: https://traefik.io/
- portainer: https://www.portainer.io/

#### brokers

- rabbitmq: https://www.rabbitmq.com/
- nats: https://nats.io/

#### databases

- postgres: https://www.postgresql.org/
- mysql: https://www.mysql.com/fr/
- couchbase: https://www.couchbase.com/
- elasticsearch: https://www.elastic.co/fr/
- rethinkdb: https://rethinkdb.com/

#### others

- logstash: https://www.elastic.co/fr/products/logstash
- thumbor: http://thumbor.org/

#### frontends

- traefik: https://traefik.docker.localhost
- portainer: https://portainer.docker.localhost
- rabbitmq: https://rabbitmq.docker.localhost
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
