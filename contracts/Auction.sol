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
        bool ended;
    }

    uint256 public auctionCounter;
    mapping(uint256 => AuctionItem) public auctions;

    event AuctionCreated(uint256 auctionId, address nftAddress, uint256 tokenId, uint256 endTime);
    event NewHighestBid(uint256 auctionId, address bidder, uint256 amount);
    event AuctionEnded(uint256 auctionId, address winner, uint256 amount);

    constructor(address initialOwner) Ownable(initialOwner) {}

    function createAuction(address nftAddress, uint256 tokenId, uint256 durationInMinutes) external {
        IERC721(nftAddress).transferFrom(msg.sender, address(this), tokenId);

        uint256 endTime = block.timestamp + (durationInMinutes * 1 minutes);
        auctions[auctionCounter] = AuctionItem({
            nftAddress: nftAddress,
            tokenId: tokenId,
            seller: payable(msg.sender),
            highestBid: 0,
            highestBidder: payable(address(0)),
            endTime: endTime,
            ended: false
        });

        emit AuctionCreated(auctionCounter, nftAddress, tokenId, endTime);
        auctionCounter++;
    }

    function placeBid(uint256 auctionId) external payable {
        AuctionItem storage auction = auctions[auctionId];
        require(block.timestamp < auction.endTime, "Auction ended");
        require(msg.value > auction.highestBid, "Bid too low");

        if (auction.highestBidder != address(0)) {
            auction.highestBidder.transfer(auction.highestBid);
        }

        auction.highestBid = msg.value;
        auction.highestBidder = payable(msg.sender);

        emit NewHighestBid(auctionId, msg.sender, msg.value);
    }

    function endAuction(uint256 auctionId) external {
        AuctionItem storage auction = auctions[auctionId];
        require(!auction.ended, "Auction already ended");
        require(block.timestamp >= auction.endTime, "Auction not finished yet");

        auction.ended = true;
        if (auction.highestBidder != address(0)) {
            IERC721(auction.nftAddress).transferFrom(address(this), auction.highestBidder, auction.tokenId);
            auction.seller.transfer(auction.highestBid);
        } else {
            IERC721(auction.nftAddress).transferFrom(address(this), auction.seller, auction.tokenId);
        }

        emit AuctionEnded(auctionId, auction.highestBidder, auction.highestBid);
    }

    function getAuction(uint256 auctionId) public view returns (
        address nftAddress,
        uint256 tokenId,
        address seller,
        uint256 highestBid,
        address highestBidder,
        uint256 endTime,
        bool ended
    ) {
        AuctionItem storage a = auctions[auctionId];
        return (a.nftAddress, a.tokenId, a.seller, a.highestBid, a.highestBidder, a.endTime, a.ended);
    }
}
