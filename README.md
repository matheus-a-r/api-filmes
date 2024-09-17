## API RESTful

## Sumário
- [Pré-requisitos](#pré-requisitos)
- [Rodar o projeto](#rodaroprojeto)

## Pré-requisitos

1. [Node]

2. [Docker](https://docs.docker.com/engine/install/)

## Rodar o projeto

```
docker compose up --build -d
```

Após os containers estiverem UP, rode o comando a seguir para a collection **movie** ser populada com o arquivo **movies-2020s.json**

```
docker exec -it <CONTAINER_ID_DO_MONGO> mongoimport --db Filmes --collection movies --file /docker-entrypoint-initdb.d/movies-2020s.json --jsonArray
```