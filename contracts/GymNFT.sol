// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GymNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    constructor(address initialOwner) ERC721("GymNFT", "GYMNFT") Ownable(initialOwner) {
        _tokenIdCounter = 1;
    }

    function mintNFT(string memory tokenURI) public returns (uint256) {
        uint256 newTokenId = _tokenIdCounter;
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        _tokenIdCounter++;
        return newTokenId;
    }
}
