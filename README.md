* cách cài đặt
  + services
    - FrontEnd: reactJs
    - BackendL nodejs
    - elasticsearch:7.10.1
    - kibana:7.10.1
    - redis
    - rabbitmq
  + file env backend:
    - PORT=
    - MONGO_HOST=
    - MONGO_PORT=
    - MONGO_DATABASE=
    - MONGO_USERNAME=
    - MONGO_PASSWORD=

    - JWT_SECRET_KEY=
    - JWT_EXPIRES_TIME=

    - ELASTIC_HOST=
    - ELASTIC_PORT=
    - ELASTIC_USERNAME=
    - ELASTIC_PASSWORD=

    - RABBITMQ_HOST=
    - RABBITMQ_PORT=
    - RABBITMQ_USERNAME=
    - RABBITMQ_PASSWORD=

    - REDIS_PORT=
    - REDIS_HOST=
    - REDIS_PASSWORD=
  + file env fontend:
    - REACT_APP_API_DOMAIN=
* call api create user
  + url: /api/v1/auths/register
  + body: {
    "email": "admin@gmail.com",
     "name": "admin",
     "password": "1"
    }
