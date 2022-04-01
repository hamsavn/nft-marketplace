async function main() {
  const nftFactory = await ethers.getContractFactory('NFT');
  const nftContract = await nftFactory.deploy();
  await nftContract.deployed();
  console.log('NFT contract was deployed to address:', nftContract.address);

  const marketplaceFactory = await ethers.getContractFactory('Marketplace');
  const marketplaceContract = await marketplaceFactory.deploy(nftContract.address);
  await marketplaceContract.deployed();
  console.log('Marketplace was deployed to address:', marketplaceContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
