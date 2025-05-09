// App.js
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Navbar from './components/Navbar';
import AuctionList from './components/AuctionList';
import CreateAuctionForm from './components/CreateAuctionForm';
import NFTUploader from './components/NFTUploader';
import NFTMintForm from './components/NFTMintForm';

import auctionAddresses from './abis/auction-address.json';
import AuctionABI from './abis/Auction.json';
import GymNFTABI from './abis/GymNFT.json';
import { resolveIPFS } from './utils/resolveIPFS';

function App() {
  const [account, setAccount] = useState(null);
  const [auctionContract, setAuctionContract] = useState(null);
  const [nftContract, setNFTContract] = useState(null);
  const [auctions, setAuctions] = useState([]);
  const [metadataURI, setMetadataURI] = useState("");
  const [tokenId, setTokenId] = useState("");

  const auctionAddress = auctionAddresses.AuctionNFT;
  const nftAddress = auctionAddresses.GymNFT;

  useEffect(() => {
    loadBlockchainData();
    const interval = setInterval(() => loadBlockchainData(), 20000);
    return () => clearInterval(interval);
  }, []);

  const loadBlockchainData = async () => {
    if (!window.ethereum) return alert("Please install MetaMask");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      setAccount(userAddress);

      const auction = new ethers.Contract(auctionAddress, AuctionABI.abi, signer);
      const nft = new ethers.Contract(nftAddress, GymNFTABI.abi, signer);

      setAuctionContract(auction);
      setNFTContract(nft);

      const auctionCount = await auction.auctionCounter();
      const auctionData = [];

      for (let i = 0; i < auctionCount; i++) {
        const auctionInfo = await auction.getAuction(i);
        const tokenId = auctionInfo.tokenId.toString();
        let metadata = {};

        try {
          const tokenURI = await nft.tokenURI(tokenId);
          const url = resolveIPFS(tokenURI);
          const res = await fetch(url);

          const contentType = res.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Not a JSON metadata URI");
          }

          metadata = await res.json();
        } catch (err) {
          console.warn(`⚠️ Failed to load metadata for token ${tokenId}:`, err.message);
        }

        auctionData.push({
          auctionId: i,
          tokenId,
          seller: auctionInfo.seller,
          highestBid: ethers.formatEther(auctionInfo.highestBid),
          highestBidder: auctionInfo.highestBidder,
          ended: auctionInfo.ended,
          endTime: auctionInfo.endTime.toString(),
          metadata,
        });
      }

      setAuctions(auctionData);
    } catch (err) {
      console.error("❌ Blockchain loading failed:", err);
    }
  };

  const switchAccount = async () => {
    try {
      setAccount(null);
      const [newAccount] = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(newAccount);
      loadBlockchainData();
    } catch (err) {
      console.error("Switch account failed:", err);
    }
  };

  const placeBid = async (auctionId, bidAmount) => {
    if (!auctionContract) return;
    try {
      const tx = await auctionContract.placeBid(auctionId, {
        value: ethers.parseEther(bidAmount),
      });
      await tx.wait();
      alert("✅ Bid placed successfully!");
      loadBlockchainData();
    } catch (err) {
      console.error("Bid error:", err);
      alert("❌ Failed to place bid");
    }
  };

  const endAuction = async (auctionId) => {
    if (!auctionContract) return;
    try {
      const tx = await auctionContract.endAuction(auctionId);
      await tx.wait();
      alert("✅ Auction ended successfully!");
      loadBlockchainData();
    } catch (err) {
      console.error("End auction error:", err);
      alert("❌ Failed to end auction");
    }
  };

  const handleUpload = (uri) => {
    setMetadataURI(uri);
  };

  const handleMintSuccess = (mintedTokenId) => {
    setTokenId(mintedTokenId);
    loadBlockchainData();
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-200 min-h-screen">
      <Navbar account={account} onLogout={switchAccount} />

      <main className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700">
            🏋️ Premium Training NFT Auction
          </h1>
          <p className="text-gray-500 mt-2 text-lg">Powered by Ethereum & IPFS</p>
        </header>

        <div className="grid md:grid-cols-2 gap-10">
          <section className="bg-white shadow rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">🎨 Mint New NFT</h2>
            <NFTUploader nftContract={nftContract} onMintSuccess={handleMintSuccess} />
          </section>

          <section className="bg-white shadow rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">📦 Create Auction</h2>
            <CreateAuctionForm
              nftContract={nftContract}
              auctionContract={auctionContract}
              defaultTokenId={tokenId}
            />
          </section>
        </div>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">🏆 Active Auctions</h2>
            <button
              onClick={loadBlockchainData}
              className="text-sm bg-gray-200 hover:bg-gray-300 rounded px-3 py-1"
            >
              🔄 Refresh
            </button>
          </div>

          <div className="bg-white shadow rounded-xl p-4">
            <AuctionList
              auctionData={auctions}
              handleBid={placeBid}
              handleEndAuction={endAuction}
              account={account}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
