//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Marketplace.sol";

contract NFT is ERC721URIStorage, Ownable {
  //To concatenate the URL of an NFT
  using Strings for uint256;

  using Counters for Counters.Counter;

  event BaseURISet(string baseURI);
  event NFTMinted(address indexed to, uint256 tokenId);
  event MarketplaceSet(address marketplace);
  event TokenURISet(uint256 tokenId, string tokenURI);

  string public baseTokenURI;

  Counters.Counter public tokenId;

  constructor() ERC721("My NFT", "NFT") {
    baseTokenURI = "";
  }

  function _baseURI() internal view override returns (string memory) {
    return baseTokenURI;
  }

  function setBaseURI(string memory baseURI_) public onlyOwner {
    require(bytes(baseURI_).length > 0, "Invalid base URI");
    baseTokenURI = baseURI_;
    emit BaseURISet(baseURI_);
  }

  function setTokenURI(uint256 tokenId_, string memory tokenURI_) public {
    require(bytes(tokenURI_).length > 0, "Invalid Token URI");
    require(ownerOf(tokenId_) == _msgSender(), "Unauthorized");
    _setTokenURI(tokenId_, tokenURI_);
    emit TokenURISet(tokenId_, tokenURI_);
  }

  function mint(string memory tokenURI_) public returns (uint256) {
    require(bytes(tokenURI_).length > 0, "Invalid token URI");
    tokenId.increment();
    uint256 newTokenId = tokenId.current();
    _safeMint(_msgSender(), newTokenId);
    _setTokenURI(newTokenId, tokenURI_);
    emit NFTMinted(_msgSender(), newTokenId);
    return newTokenId;
  }
}
