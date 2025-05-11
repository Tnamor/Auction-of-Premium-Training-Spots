// contracts/GymNFT.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GymNFT is ERC721URIStorage, Ownable {
uint256 private _tokenIdCounter = 1;
mapping(string => bool) private _usedURIs;

event NFTMinted(address indexed to, uint256 indexed tokenId, string tokenURI);

constructor(address initialOwner) ERC721("GymNFT", "GYMNFT") Ownable(initialOwner) {}

function mintNFT(string memory tokenURI) public returns (uint256) {
    require(bytes(tokenURI).length > 0, "Empty tokenURI");
    require(!_usedURIs[tokenURI], "Token URI already used");

    uint256 newTokenId = _tokenIdCounter;
    _safeMint(msg.sender, newTokenId);
    _setTokenURI(newTokenId, tokenURI);
    _usedURIs[tokenURI] = true;

    emit NFTMinted(msg.sender, newTokenId, tokenURI);

    _tokenIdCounter++;
    return newTokenId;
}
}