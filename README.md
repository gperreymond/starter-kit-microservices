# Starter Kit Microservices

## Anatomy of the starter kit

![moleculer services](moleculer.png?raw=true)

![hapi server](hapi.png?raw=true)

- https://moleculer.services/
- https://hapi.dev/

## Definition of a service

A service is a set of actions and events who can be called over Nats or RabbimMQ.

## Create your first service

All services are created in the __services__ directory.  
Create a new directory with the name of the service you want, for example: __System__

```sh
mkdir services/System
```

```sh
application:main          Starting application: development +0ms
application:broker        Initializing broker: NATS +0ms
application:broker        Detecting broker services +56ms
application:broker        Service System is detected +2ms
application:utils         Action GetHealthCheckForKubernetes has been found +0ms
application:rabbitmq      Connected +0ms
application:rabbitmq      Detecting queues +1ms
application:rabbitmq      Domain System Queues 0 detected +2ms
application:broker        Broker started +584ms
application:main          Nats started +650ms
application:server        Plugin Inert, Vision are registered +0ms
application:server        Plugin HapiAuthBasic is registered +1ms
application:server        Plugin HapiSwagger is registered +4ms
application:server        Detecting server exposed routes +0ms
application:server        Server started +42ms
application:main          Application started +76ms
```

## Create your first action in a service

A service need to have some actions, concider an action as a simple handler and some configurations.  
Create a new directory in __services__ with the name of the action you want.

```sh
mkdir services/System/GetHealthCheckForKubernetes
```

Create a new file with name __handler.js__

```sh
touch services/System/GetHealthCheckForKubernetes/handler.js
```

```js
const handler = async (ctx) => {
  return { debug: true }
}
module.exports = handler
```

Take a look at moleculer action handler in the moleculer documentation.

```sh
application:main          Starting application: development +0ms
application:broker        Initializing broker: NATS +0ms
application:broker        Detecting broker services +56ms
application:broker        Service System is detected +2ms
application:utils         Action GetHealthCheckForKubernetes has been found +0ms
application:rabbitmq      Connected +0ms
application:rabbitmq      Detecting queues +1ms
application:rabbitmq      Domain System Queues 0 detected +2ms
application:broker        Broker started +584ms
application:main          Nats started +650ms
application:server        Plugin Inert, Vision are registered +0ms
application:server        Plugin HapiAuthBasic is registered +1ms
application:server        Plugin HapiSwagger is registered +4ms
application:server        Detecting server exposed routes +0ms
application:server        Server started +42ms
application:main          Application started +76ms
```
