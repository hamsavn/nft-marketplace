
# NFT Marketplace client

  

## Installation

- Create the `.env` file with the following pattern

    ```

    API_ENDPOINT=

    PORT=

    ```

- Use https://nft-marketplace.bc.hamsa.site/graphql or https://api-nft-marketplace.bc.hamsa.site/graphql for the `API_ENDPOINT`

-  `yarn install`

-  `yarn dev`

  

## Development notes

- all graphql queries/mutations should be located in the `src/graphql` folder

- run `yarn graphql` after adding/editting graphql queries to re-genreate graphql schema

- all API access should follow the [repository pattern](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/infrastructure-persistence-layer-design#:~:text=of%20Work%20patterns.-,The%20Repository%20pattern,from%20the%20domain%20model%20layer.). Check the `src/repositories` folder for detailed implementation

- run `yarn format` to format code before committing
- [dev site](https://nft-marketplace.bc.hamsa.site)
- [theme repo](https://bitbucket.org/hamsavn/nft-marketplace-theme/src/master/)
