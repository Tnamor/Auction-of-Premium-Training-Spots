import { ethers } from "ethers";
import AuctionNFT from "../abis/AuctionNFT.json";
import addresses from "../abis/auction-address.json";

export function getAuctionContract() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  return provider.then((prov) => {
    const signer = prov.getSigner();
    return new ethers.Contract(addresses.AuctionNFT, AuctionNFT.abi, signer);
  });
}
