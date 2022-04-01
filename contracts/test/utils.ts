import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ContractReceipt, ContractTransaction, Event } from 'ethers';
import IMarketplace from './IMarketplace';
import INFT from './INFT';

export async function mintNFT(
  nftContract: INFT,
  user: SignerWithAddress | undefined = undefined,
): Promise<number> {
  const mintTransaction: ContractTransaction = user
    ? await nftContract.connect(user).mint('metadata.json')
    : await nftContract.mint('metadata.json');
  const mintReceipt: ContractReceipt = await mintTransaction.wait();
  const mintEvent = mintReceipt?.events?.find((event: Event) => event.event === 'NFTMinted');
  const [minter, tokenId] = mintEvent?.args ? mintEvent?.args : [];
  return tokenId;
}

export async function createOrder(
  marketplaceContract: IMarketplace,
  tokenId: number,
  salePrice: number,
) {
  const addOrderTransaction = await marketplaceContract.addOrder(tokenId, salePrice);
  const addOrderReceipt = await addOrderTransaction.wait();
  const addOrderEvent = addOrderReceipt?.events?.find(
    (event: Event) => event.event === 'OrderAdded',
  );
  return addOrderEvent?.args ? addOrderEvent?.args : [];
}
