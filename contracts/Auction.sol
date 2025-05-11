// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Auction is Ownable {
struct AuctionItem {
address nftAddress;
uint256 tokenId;
address payable seller;
uint256 highestBid;
address payable highestBidder;
uint256 endTime;
uint256 lastBidTime;
bool ended;
}


uint256 public auctionCounter;
mapping(uint256 => AuctionItem) public auctions;
mapping(address => mapping(uint256 => bool)) public activeTokenAuction;

event AuctionCreated(uint256 indexed auctionId, address indexed nftAddress, uint256 tokenId, uint256 endTime);
event NewHighestBid(uint256 indexed auctionId, address indexed bidder, uint256 amount);
event AuctionEnded(uint256 indexed auctionId, address indexed winner, uint256 amount);
event NFTTransferred(address indexed from, address indexed to, uint256 indexed tokenId);

constructor(address initialOwner) Ownable(initialOwner) {}

function createAuction(address nftAddress, uint256 tokenId, uint256 durationInMinutes) external {
    require(!activeTokenAuction[nftAddress][tokenId], "Token already on auction");

    IERC721(nftAddress).transferFrom(msg.sender, address(this), tokenId);

    uint256 endTime = block.timestamp + durationInMinutes * 1 minutes;

    auctions[auctionCounter] = AuctionItem({
        nftAddress: nftAddress,
        tokenId: tokenId,
        seller: payable(msg.sender),
        highestBid: 0,
        highestBidder: payable(address(0)),
        endTime: endTime,
        lastBidTime: block.timestamp,
        ended: false
    });

    activeTokenAuction[nftAddress][tokenId] = true;

    emit AuctionCreated(auctionCounter, nftAddress, tokenId, endTime);
    auctionCounter++;
}

function placeBid(uint256 auctionId) external payable {
    AuctionItem storage auction = auctions[auctionId];
    require(!auction.ended, "Auction already ended");
    require(block.timestamp < auction.endTime, "Auction expired");
    require(msg.sender != auction.highestBidder, "Already highest bidder");
    require(msg.value > auction.highestBid, "Bid too low");

    if (auction.highestBidder != address(0)) {
        auction.highestBidder.transfer(auction.highestBid);
    }

    auction.highestBid = msg.value;
    auction.highestBidder = payable(msg.sender);
    auction.lastBidTime = block.timestamp;

    emit NewHighestBid(auctionId, msg.sender, msg.value);
}

function endAuction(uint256 auctionId) public {
    AuctionItem storage auction = auctions[auctionId];
    require(!auction.ended, "Auction already ended");
    require(
        block.timestamp >= auction.endTime || block.timestamp > auction.lastBidTime + 24 hours,
        "Auction still active"
    );

    auction.ended = true;
    activeTokenAuction[auction.nftAddress][auction.tokenId] = false;

    if (auction.highestBidder != address(0)) {
        IERC721(auction.nftAddress).safeTransferFrom(address(this), auction.highestBidder, auction.tokenId);
        auction.seller.transfer(auction.highestBid);
        emit NFTTransferred(address(this), auction.highestBidder, auction.tokenId);
    } else {
        IERC721(auction.nftAddress).safeTransferFrom(address(this), auction.seller, auction.tokenId);
        emit NFTTransferred(address(this), auction.seller, auction.tokenId);
    }

    emit AuctionEnded(auctionId, auction.highestBidder, auction.highestBid);
}

function getAuction(uint256 auctionId) public view returns (AuctionItem memory) {
    return auctions[auctionId];
}

function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
    return this.onERC721Received.selector;
}
}