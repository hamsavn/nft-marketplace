import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import INFT from './INFT';
import IMarketplace from './IMarketplace';
import { mintNFT } from './utils';

describe('NFT', () => {
  let marketplaceContract: IMarketplace;
  let nftContract: INFT;
  let deployer: SignerWithAddress;
  let user1: SignerWithAddress;

  beforeEach(async () => {
    [deployer, user1] = await ethers.getSigners();
    nftContract = (await (await ethers.getContractFactory('NFT')).deploy()) as unknown as INFT;
    await nftContract.deployed();

    marketplaceContract = (await (
      await ethers.getContractFactory('Marketplace')
    ).deploy(nftContract.address)) as unknown as IMarketplace;
    await marketplaceContract.deployed();

    await nftContract.setMarketplace(marketplaceContract.address);
  });

  describe('mint', () => {
    it('should allow deployer to mint', async () => {
      const tokenId = await mintNFT(nftContract);
      expect(await nftContract.ownerOf(tokenId)).to.equals(deployer.address);
    });

    it('should allow non-deployer to mint', async () => {
      const tokenId = await mintNFT(nftContract, user1);
      expect(await nftContract.ownerOf(tokenId)).to.equals(user1.address);
    });

    it('should not allow to mint empty token URI', async () => {
      await expect(nftContract.mint('')).to.be.reverted;
    });
  });

  describe('set base URI', () => {
    it('should not allow to set empty baseURI', async () => {
      await expect(nftContract.setBaseURI('')).to.be.reverted;
    });

    it('should allow deployer to set baseURI', async () => {
      const newBaseURI = 'https://myserver.com/';
      const oldBaseURI = await nftContract.baseTokenURI();
      await nftContract.setBaseURI(newBaseURI);
      expect(await nftContract.baseTokenURI()).to.equals(newBaseURI);
      expect(await oldBaseURI).not.to.equals(newBaseURI);
    });

    it('should not allow non-deployer to set base URI', async () => {
      await expect(nftContract.connect(user1).setBaseURI('abc')).to.be.reverted;
    });
  });

  describe('get token URI', () => {
    it('should return correct token URI', async () => {
      const newBaseURI = 'https://myserver.com/';
      await nftContract.setBaseURI(newBaseURI);
      const tokenId = await mintNFT(nftContract);
      expect(await nftContract.tokenURI(tokenId)).to.equals(newBaseURI + 'metadata.json');
    });
  });

  describe('set token URI', () => {
    it('should not allow to set empty URI', async () => {
      const tokenId = await mintNFT(nftContract);
      await expect(nftContract.setTokenURI(tokenId, '')).to.be.revertedWith('Invalid Token URI');
    });

    it('should not allow non-owner to set URI', async () => {
      const tokenId = await mintNFT(nftContract);
      await expect(
        ((await nftContract.connect(user1)) as unknown as INFT).setTokenURI(
          tokenId,
          'metadata2.json',
        ),
      ).to.be.revertedWith('Unauthorized');
    });

    it('should not allow to set URI of the NFT which is being listed for sale', async () => {
      const tokenId = await mintNFT(nftContract);
      await marketplaceContract.addOrder(tokenId, 1000);
      expect(nftContract.setTokenURI(tokenId, 'metadata2.json')).to.be.revertedWith(
        'NFT has already been listed for sale',
      );
    });

    it('should not allow to set URI of the NFT which is already sold', async () => {
      const tokenId = await mintNFT(nftContract);
      await marketplaceContract.addOrder(tokenId, 1000);
      await marketplaceContract.connect(user1).executeOrder(tokenId, { value: 1000 });
      await ((await marketplaceContract.connect(user1)) as unknown as IMarketplace).addOrder(
        tokenId,
        2000,
      );
      await marketplaceContract.connect(user1).cancelOrder(tokenId);
      await expect(
        nftContract.connect(user1).setTokenURI(tokenId, 'metadata2.json'),
      ).to.be.revertedWith('NFT has already been sold');
    });

    it('should throw TokenURISet event', async () => {
      const newTokenURI = 'metadata2.json';
      const tokenId = await mintNFT(nftContract);
      await expect(nftContract.setTokenURI(tokenId, newTokenURI))
        .to.emit(nftContract, 'TokenURISet')
        .withArgs(tokenId, newTokenURI);
    });

    it('should update new token URI', async () => {
      const newTokenURI = 'metadata2.json';
      const baseURI = 'https://myserver.com/';
      await nftContract.setBaseURI(baseURI);
      const tokenId = await mintNFT(nftContract);
      await nftContract.setTokenURI(tokenId, newTokenURI);
      expect(await nftContract.tokenURI(tokenId)).to.equals(baseURI + newTokenURI);
    });
  });

  describe('set marketplace', () => {
    it('should not allow none-deployer to set marketplace', async () => {
      await expect(nftContract.connect(user1).setMarketplace(marketplaceContract.address)).to.be
        .reverted;
    });

    it('should allow deployer to set marketplace', async () => {
      await nftContract.setMarketplace(marketplaceContract.address);
      expect(await nftContract.marketplace()).to.equals(marketplaceContract.address);
    });
  });
});
