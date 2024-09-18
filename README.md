## API RESTful

## Sumário
- [Pré-requisitos](#pré-requisitos)
- [Rodar o projeto](#rodaroprojeto)

## Pré-requisitos

1. [Node](https://nodejs.org/pt)

2. [Docker](https://docs.docker.com/engine/install/)

## Rodar o projeto

Após clonar o repositório, execute o comando abaixo.

```
docker compose up --build -d
```

Após os containers estiverem UP, rode o comando a seguir para a collection **movie** ser populada com o arquivo **movies-2020s.json**

```
docker exec -it <CONTAINER_ID_DO_MONGO> mongoimport --db Filmes --collection movies --file /docker-entrypoint-initdb.d/movies-2020s.json --jsonArray
```

Depois desses passos, o swagger da aplicação deve estar disponível na url **http://localhost:3000/swagger**