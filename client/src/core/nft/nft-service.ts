import { MetaMaskService } from '@core/wallet/metamask';
import { ethers } from 'ethers';
import MarketPalceContractInfo from './marketplace-contract-info';
import NFTContractInfo from './nft-contract-info';

const NftServices = {
  async cancelOrder(tokenId: number): Promise<any> {
    const marketplaceAddress = MarketPalceContractInfo.address;
    const marketplaceAbi = MarketPalceContractInfo.abi;
    const provider = MetaMaskService.provider;
    const signer = MetaMaskService.provider.getSigner();

    const contract = new ethers.Contract(marketplaceAddress, marketplaceAbi, provider);

    const contractWithSigner = contract.connect(signer);

    return await contractWithSigner.cancelOrder(tokenId);
  },

  async minting(tokenURI_: string): Promise<{ [key: string]: any }> {
    const NFTaddress = NFTContractInfo.address;
    const NFTAbi = NFTContractInfo.abi;
    const provider = MetaMaskService.provider;
    const signer = MetaMaskService.provider.getSigner();

    const contract = new ethers.Contract(NFTaddress, NFTAbi, provider);

    const contractWithSigner = contract.connect(signer);

    return await contractWithSigner.mint(tokenURI_);
  },

  /**
   * Allow other user can buy this artwork
   * @param tokenId
   * @param price Ether unit
   */
  async addOrder(tokenId: number, price: number): Promise<any> {
    const marketplaceAddress = MarketPalceContractInfo.address;
    const marketplaceAbi = MarketPalceContractInfo.abi;
    const nftAddress = NFTContractInfo.address;
    const nftAbi = NFTContractInfo.abi;
    const provider = MetaMaskService.provider;
    const signer = MetaMaskService.provider.getSigner();

    const contract = new ethers.Contract(marketplaceAddress, marketplaceAbi, provider);
    const nftContract = new ethers.Contract(nftAddress, nftAbi, provider);

    const contractWithSigner = contract.connect(signer);
    const nftContractWithSigner = nftContract.connect(signer);

    const wei = ethers.utils.parseEther(String(price));

    await nftContractWithSigner.approve(marketplaceAddress, tokenId);
    const result = await contractWithSigner.addOrder(tokenId, wei.toBigInt());
    return result;
  },

  async executeOrder(tokenId: number, price: number): Promise<any> {
    const marketplaceAddress = MarketPalceContractInfo.address;
    const marketplaceAbi = MarketPalceContractInfo.abi;
    const provider = MetaMaskService.provider;
    const signer = MetaMaskService.provider.getSigner();

    const contract = new ethers.Contract(marketplaceAddress, marketplaceAbi, provider);
    const contractWithSigner = contract.connect(signer);

    const wei = ethers.utils.parseEther(String(price));
    return await contractWithSigner.executeOrder(tokenId, { value: wei.toBigInt() });
  },

  async setTokenURI(tokenId_: number, tokenURI: string): Promise<any> {
    const NFTaddress = NFTContractInfo.address;
    const NFTAbi = NFTContractInfo.abi;
    const provider = MetaMaskService.provider;
    const signer = MetaMaskService.provider.getSigner();

    const contract = new ethers.Contract(NFTaddress, NFTAbi, provider);

    const contractWithSigner = contract.connect(signer);

    return await contractWithSigner.setTokenURI(tokenId_, tokenURI);
  },
};

export default NftServices;
