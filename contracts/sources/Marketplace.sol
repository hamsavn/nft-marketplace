//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

contract Marketplace is Ownable, ReentrancyGuard {
  using Counters for Counters.Counter;

  struct Order {
    uint256 orderId;
    uint256 tokenId;
    address seller;
    uint256 price;
  }

  IERC721 public immutable nftContract;
  event OrderAdded(
    uint256 orderId,
    uint256 indexed tokenId,
    address indexed seller,
    uint256 price
  );
  event OrderCancelled(uint256 orderId, uint256 tokenId, address seller);
  event OrderExecuted(
    uint256 orderId,
    uint256 indexed tokenId,
    address indexed seller,
    address indexed buyer,
    uint256 price
  );

  mapping(uint256 => Order) public orders;
  Counters.Counter public orderCounter;
  mapping(uint256 => bool) public sold;

  constructor(address nftContractAddress_) {
    nftContract = IERC721(nftContractAddress_);
  }

  function isListedForSale(uint256 tokenId) public view returns (bool) {
    Order memory order = orders[tokenId];
    return order.seller != address(0);
  }

  function isAlreadySold(uint256 tokenId) public view returns (bool) {
    return sold[tokenId] == true;
  }

  function addOrder(uint256 tokenId_, uint256 price_) public returns (bool) {
    require(
      nftContract.ownerOf(tokenId_) == _msgSender(),
      "Only onwer can put item for sale"
    );

    orderCounter.increment();
    Order storage order = orders[tokenId_];
    order.tokenId = tokenId_;
    order.orderId = orderCounter.current();
    order.seller = _msgSender();
    order.price = price_;

    emit OrderAdded(orderCounter.current(), tokenId_, _msgSender(), price_);
    return true;
  }

  function cancelOrder(uint256 tokenId) public returns (bool) {
    Order memory order = orders[tokenId];
    require(order.seller == _msgSender(), "Only seller can cancel the order");

    delete orders[tokenId];
    emit OrderCancelled(order.orderId, tokenId, order.seller);

    return true;
  }

  function executeOrder(uint256 tokenId)
    public
    payable
    nonReentrant
    returns (bool)
  {
    Order memory order = orders[tokenId];
    uint256 price = msg.value;

    require(order.seller != address(0), "Order does not exist");
    require(
      order.seller != _msgSender(),
      "Seller must be different than buyer"
    );
    require(order.price == price, "Price does not match");

    nftContract.safeTransferFrom(order.seller, _msgSender(), tokenId);
    emit OrderExecuted(
      order.orderId,
      order.tokenId,
      order.seller,
      _msgSender(),
      price
    );
    sold[tokenId] = true;
    delete orders[tokenId];

    (bool successful, ) = payable(order.seller).call{value: price}("");
    require(successful, "Failed to transfer money to seller");

    return true;
  }
}
