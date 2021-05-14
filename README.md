## Services
    - Frontend: ReactJS
    - Backend: NodeJS - Express
    - Elasticsearch: v7.10.1
    - Kibana: v7.10.1
    - MongoDB: v4.2
    - Redis: v6.2-debian-10
    - Rabbitmq: v3-management-alpine

## Backend
```
PORT=

# MONGO
MONGO_HOST=
MONGO_PORT=
MONGO_USERNAME=
MONGO_PASSWORD=
MONGO_DATABASE=

# JWT
JWT_SECRET_KEY=
JWT_EXPIRES_TIME=

# ELASTICSEARCH
ELASTIC_HOST=
ELASTIC_PORT=
ELASTIC_USERNAME=
ELASTIC_PASSWORD=

# RABBITMQ
RABBITMQ_HOST=
RABBITMQ_PORT=
RABBITMQ_USERNAME=
RABBITMQ_PASSWORD=

# REDIS
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=
```

## Frontend
```
PORT=
REACT_APP_API_DOMAIN=
```

## API
### 1. Create user
- Method: POST
- URL: /api/v1/auths/register
- Body: 
```
{
  "email": "user@gmail.com",
  "name": "username",
  "password": "123456"
}
```
