# NFT Marketplace smart contracts

## Installation

- Create the `.env` file with the following pattern
  ```
  ETH_API_URL=
  PRIVATE_KEY=
  ```
- `yarn install`

## Testing

- `yarn test`

## Deployment

- `yarn deploy`

# Verify NFT smart contract on etherscan

- npx hardhat verify --network rinkeby <NFT contract address>

# Verify Marketplace smart contract on etherscan

- npx hardhat --network rinkeby <marketplace contract address> <NFT contract address>
