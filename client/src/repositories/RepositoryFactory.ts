import AuthRepository from './AuthRepository';
import NftRepository from './NftRepository';
import AppRepository from './AppRepository';

const repositories = {
  auth: AuthRepository,
  nft: NftRepository,
  app: AppRepository,
};

export const RepositoryFactory = {
  get<K extends keyof typeof repositories>(name: K) {
    return repositories[name];
  },
};
