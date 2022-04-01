import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
const { ethers } = require('hardhat');
const { expect } = require('chai');
import INFT from './INFT';
import IMarketplace from './IMarketplace';
import { Contract, ContractTransaction } from 'ethers';
import { Event } from 'ethers';
import { createOrder, mintNFT } from './utils';

describe('Marketplace', () => {
  const SALE_PRICE = ethers.utils.parseEther('1');
  let marketplaceContract: IMarketplace;
  let nftContract: INFT;
  let deployer: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;

  beforeEach(async () => {
    [deployer, user1, user2, user3] = await ethers.getSigners();
    nftContract = await (await ethers.getContractFactory('NFT')).deploy();
    await nftContract.deployed();

    marketplaceContract = await (
      await ethers.getContractFactory('Marketplace')
    ).deploy(nftContract.address);
    await marketplaceContract.deployed();
  });

  describe('create order', () => {
    it('should not allow none-owner to create order', async () => {
      const tokenId = await mintNFT((await nftContract.connect(user1)) as unknown as INFT);
      await expect(marketplaceContract.addOrder(tokenId, SALE_PRICE)).to.be.reverted;
    });

    it('should not allow to create order for none-existence token id', async () => {
      const tokenId = await mintNFT((await nftContract.connect(user1)) as unknown as INFT);
      const noneExistenceTokenId = tokenId + 1;
      await expect(marketplaceContract.addOrder(noneExistenceTokenId, SALE_PRICE)).to.be.reverted;
    });

    it('should raise OrderAdded event', async () => {
      const tokenId = await mintNFT(nftContract);
      const [_orderId, _tokenId, _seller, _salePrice] = await createOrder(
        marketplaceContract,
        tokenId,
        SALE_PRICE,
      );

      expect(_tokenId).to.equals(tokenId);
      expect(_seller).to.equals(deployer.address);
      expect(_salePrice).to.equals(SALE_PRICE);
    });
  });

  describe('cancel order', () => {
    it('should not allow non-seller to cancel order', async () => {
      const tokenId = await mintNFT((await nftContract.connect(user1)) as unknown as INFT);
      await createOrder(
        (await marketplaceContract.connect(user1)) as unknown as IMarketplace,
        tokenId,
        SALE_PRICE,
      );
      await expect(marketplaceContract.cancelOrder(tokenId)).to.be.reverted;
    });

    it('should allow seller to cancel order', async () => {
      const tokenId = await mintNFT(nftContract);
      await createOrder(marketplaceContract, tokenId, SALE_PRICE);
      await marketplaceContract.cancelOrder(tokenId);
      await expect(await nftContract.ownerOf(tokenId)).to.equals(deployer.address);
    });

    it('should raise OrderCancelled event', async () => {
      const tokenId = await mintNFT(nftContract);
      await createOrder(marketplaceContract, tokenId, SALE_PRICE);
      const cancelOrderTransaction: ContractTransaction = await marketplaceContract.cancelOrder(
        tokenId,
      );
      const orderReceipt = await cancelOrderTransaction.wait();
      const event = orderReceipt?.events?.find((event: Event) => event.event === 'OrderCancelled');
      const [_oderId, _tokenId, _seller] = event?.args ? event?.args : [];
      expect(_tokenId).to.equals(tokenId);
      expect(_seller).to.equals(deployer.address);
    });
  });

  describe('execute order', () => {
    it('should throw if marketplace is not approved', async () => {
      const tokenId = await mintNFT(nftContract);
      await createOrder(marketplaceContract, tokenId, SALE_PRICE);
      const doesNotExitOrderId = 0;
      await expect(
        marketplaceContract.executeOrder(doesNotExitOrderId, { value: SALE_PRICE }),
      ).to.be.revertedWith('Order does not exist');
    });

    it('should throw if buyer and seller are same', async () => {
      const tokenId = await mintNFT(nftContract);
      await createOrder(marketplaceContract, tokenId, SALE_PRICE);
      await expect(
        marketplaceContract.executeOrder(tokenId, { value: ethers.utils.parseEther('0.2') }),
      ).to.be.revertedWith('Seller must be different than buyer');
    });

    it('should throw if price does not match', async () => {
      const tokenId = await mintNFT(nftContract);
      await createOrder(marketplaceContract, tokenId, SALE_PRICE);
      const contractWithBuyer: IMarketplace = (await marketplaceContract.connect(
        user1,
      )) as unknown as IMarketplace;
      await expect(
        contractWithBuyer.executeOrder(tokenId, { value: ethers.utils.parseEther('0.02') }),
      ).to.be.revertedWith('Price does not match');
    });

    it('should deduct ether from buyer', async () => {
      // owner mints
      const tokenId = await mintNFT(nftContract);

      // owner sells
      await createOrder(marketplaceContract, tokenId, SALE_PRICE);
      await nftContract.approve(marketplaceContract.address, tokenId);

      // buyer buys
      const marketplaceWithBuyer: IMarketplace = (await marketplaceContract.connect(
        user1,
      )) as unknown as IMarketplace;

      // verify buyer's balance
      const balanceBefore = await user1.getBalance();
      await marketplaceWithBuyer.executeOrder(tokenId, { value: SALE_PRICE });
      const balanceAfter = await user1.getBalance();
      // we need to subtract for the Gas fee
      expect(balanceAfter).to.be.below(balanceBefore.sub(SALE_PRICE));
    });

    it('should add ether to seller', async () => {
      // seller mints
      const tokenId = await mintNFT((await nftContract.connect(user1)) as unknown as INFT);

      // seller sells
      const marketplaceWithSeller: IMarketplace = (await marketplaceContract.connect(
        user1,
      )) as unknown as IMarketplace;
      await createOrder(marketplaceWithSeller, tokenId, SALE_PRICE);
      await nftContract.connect(user1).approve(marketplaceWithSeller.address, tokenId);

      // buyer buys
      const marketplaceWithBuyer: IMarketplace = (await marketplaceContract.connect(
        user2,
      )) as unknown as IMarketplace;
      const balanceBefore = await user1.getBalance();
      const transaction: ContractTransaction = await marketplaceWithBuyer.executeOrder(tokenId, {
        value: SALE_PRICE,
      });
      const receipt = await transaction.wait();
      const balanceAfter = await user1.getBalance();

      //verify seller's balance
      // some gas fee has been subtracted when transfer ether inside executeOrder
      expect(balanceAfter).to.be.above(balanceBefore.add(SALE_PRICE).sub(receipt.gasUsed));
    });

    it('should transfer NFT to buyer', async () => {
      // seller mints
      const tokenId = await mintNFT((await nftContract.connect(user1)) as unknown as INFT);
      expect(await nftContract.ownerOf(tokenId)).to.equals(user1.address);

      // seller sells
      const marketplaceWithSeller: IMarketplace = (await marketplaceContract.connect(
        user1,
      )) as unknown as IMarketplace;
      await createOrder(marketplaceWithSeller, tokenId, SALE_PRICE);
      await nftContract.connect(user1).approve(marketplaceContract.address, tokenId);

      // buyer buys
      const marketplaceWithBuyer: IMarketplace = (await marketplaceContract.connect(
        user2,
      )) as unknown as IMarketplace;
      await marketplaceWithBuyer.executeOrder(tokenId, {
        value: SALE_PRICE,
      });

      expect(await nftContract.ownerOf(tokenId)).to.equals(user2.address);
    });

    it('should raise OrderExecuted event', async () => {
      // seller mints
      const tokenId = await mintNFT((await nftContract.connect(user1)) as unknown as INFT);

      // seller sells
      const marketplaceWithSeller: IMarketplace = (await marketplaceContract.connect(
        user1,
      )) as unknown as IMarketplace;
      await createOrder(marketplaceWithSeller, tokenId, SALE_PRICE);
      await nftContract.connect(user1).approve(marketplaceWithSeller.address, tokenId);

      // buyer buys
      const marketplaceWithBuyer: IMarketplace = (await marketplaceContract.connect(
        user2,
      )) as unknown as IMarketplace;
      const transaction: ContractTransaction = await marketplaceWithBuyer.executeOrder(tokenId, {
        value: SALE_PRICE,
      });
      const receipt = await transaction.wait();
      const event = receipt.events?.find((event: Event) => event.event === 'OrderExecuted');
      const [_orderId, _tokenId, _seller, _buyer, _price] = event?.args ? event.args : [];

      expect(_tokenId).to.equals(tokenId);
      expect(_seller).to.equals(user1.address);
      expect(_buyer).to.equals(user2.address);
      expect(_price).to.equals(SALE_PRICE);
    });

    it('should allow to re-sell', async () => {
      // seller mints
      const tokenId = await mintNFT((await nftContract.connect(user1)) as unknown as INFT);
      expect(await nftContract.ownerOf(tokenId)).to.equals(user1.address);

      // seller sells
      const marketplaceWithSeller: IMarketplace = (await marketplaceContract.connect(
        user1,
      )) as unknown as IMarketplace;
      await createOrder(marketplaceWithSeller, tokenId, SALE_PRICE);
      await nftContract.connect(user1).approve(marketplaceWithSeller.address, tokenId);

      // buyer1 buys
      const marketplaceWithBuyer: IMarketplace = (await marketplaceContract.connect(
        user2,
      )) as unknown as IMarketplace;
      await marketplaceWithBuyer.executeOrder(tokenId, {
        value: SALE_PRICE,
      });

      // buyer1 resell
      await createOrder(marketplaceWithBuyer, tokenId, SALE_PRICE);
      await nftContract.connect(user2).approve(marketplaceWithBuyer.address, tokenId);

      // buyer 2 buys
      const marketplaceWithBuyer2: IMarketplace = (await marketplaceContract.connect(
        user3,
      )) as unknown as IMarketplace;
      await marketplaceWithBuyer2.executeOrder(tokenId, {
        value: SALE_PRICE,
      });
    });
  });
});
