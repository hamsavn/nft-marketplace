
# NFT Marketplace server

  

## Installation

- Create the `.env` file with the following pattern

    ```
    POSTGRES_HOST=
    POSTGRES_PORT=
    POSTGRES_USER=
    POSTGRES_PASSWORD=
    POSTGRES_DATABASE=
    DB_SYNC=("true" to enable auto schema sync - use for development only)
    PORT=
    ```

-  `yarn install`

-  `yarn dev`


## Development notes

- use CLI to generate resrouces, [reference](https://docs.nestjs.com/cli/usages)
- run `yarn format` to format code before committing
- dev server url https://api-nft-marketplace.bc.hamsa.site/graphql
- use only 1 entity declaration file for both TypeOrm and Graphql schema

## Graphql coding standard
-  Using input object type for mutations
-  Returning affected objects as a result of mutations
-  Using paginated lists by default
-  Nesting your objects in queries
-  [Reference](https://atheros.ai/blog/graphql-best-practices-for-graphql-schema-design)