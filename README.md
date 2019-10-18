# Starter Kit Microservices

------------------------------------------------------------------

![moleculer services](moleculer.png?raw=true)

------------------------------------------------------------------

![hapi server](hapi.png?raw=true)

------------------------------------------------------------------

- https://moleculer.services/
- https://hapi.dev/

## Bootstrap infrastructure

#### Running the infrastructure
Start all components.

```sh
./bootstrap.sh --start
```

#### Stopping the infrastructure
Stop and remove all components.

```sh
./bootstrap.sh --stop
```

## Definition of a service

A service is a set of actions and events who can be called over Nats or RabbitMQ.

## Create your first service

All services are created in the __services__ directory.  
