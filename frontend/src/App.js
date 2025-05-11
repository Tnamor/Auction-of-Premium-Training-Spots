// src/App.js
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Navbar from './components/Navbar';
import AuctionList from './components/AuctionList';
import CreateAuctionForm from './components/CreateAuctionForm';
import NFTUploader from './components/NFTUploader';
import AuctionDetail from './components/AuctionDetail';
import AppLayout, { SectionCard } from './components/AppLayout';

import auctionAddresses from './abis/auction-address.json';
import AuctionABI from './abis/Auction.json';
import GymNFTABI from './abis/GymNFT.json';
import { resolveIPFS } from './utils/resolveIPFS';

function App() {
  const [account, setAccount] = useState(null);
  const [auctions, setAuctions] = useState([]);
  const [tokenId, setTokenId] = useState('');
  const [selectedAuction, setSelectedAuction] = useState(null);

  const auctionAddress = auctionAddresses.AuctionNFT;
  const nftAddress = auctionAddresses.GymNFT;

  const getContracts = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const auction = new ethers.Contract(auctionAddress, AuctionABI.abi, signer);
    const nft = new ethers.Contract(nftAddress, GymNFTABI.abi, signer);
    return { signer, auction, nft };
  };

  useEffect(() => {
    loadBlockchainData();
    const interval = setInterval(() => loadBlockchainData(), 20000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', ([newAccount]) => {
        setAccount(newAccount);
        loadBlockchainData();
      });
    }
  }, []);

  const loadBlockchainData = async () => {
    if (!window.ethereum) return alert('Please install MetaMask');

    try {
      const { signer, auction, nft } = await getContracts();
      const userAddress = await signer.getAddress();
      setAccount(userAddress);

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

          const contentType = res.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Not a JSON metadata URI');
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
      console.error('❌ Blockchain loading failed:', err);
    }
  };

  const switchAccount = async () => {
    try {
      setAccount(null);
      await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }],
      });
      const [newAccount] = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setAccount(newAccount);
      loadBlockchainData();
    } catch (err) {
      console.error('❌ Switch failed:', err);
    }
  };

  const placeBid = async (auctionId, bidAmount) => {
    try {
      const { auction } = await getContracts();
      const tx = await auction.placeBid(auctionId, {
        value: ethers.parseEther(bidAmount),
      });
      await tx.wait();
      alert('✅ Bid placed successfully!');
      loadBlockchainData();
    } catch (err) {
      console.error('Bid error:', err);
      alert('❌ Failed to place bid');
    }
  };

  const endAuction = async (auctionId) => {
    try {
      const { signer, auction } = await getContracts();
      const signerAddress = await signer.getAddress();
      const auctionInfo = await auction.getAuction(auctionId);

      const currentTime = Math.floor(Date.now() / 1000);
      const endTime = parseInt(auctionInfo.endTime);
      const lastBidTime = parseInt(auctionInfo.lastBidTime);

      if (auctionInfo.ended) return alert('⚠️ Auction already ended.');
      if (signerAddress.toLowerCase() !== auctionInfo.seller.toLowerCase()) {
        return alert('⛔ Only the seller can end the auction.');
      }
      const isExpired = currentTime >= endTime;
      const isNoBidsFor24h = currentTime > lastBidTime + 86400;

      if (!isExpired && !isNoBidsFor24h) {
        return alert('⏰ Auction is still active.');
      }

      const tx = await auction.endAuction(auctionId);
      await tx.wait();
      alert('✅ Auction ended successfully!');
      loadBlockchainData();
    } catch (err) {
      console.error('End auction error:', err);
      alert('❌ Failed to end auction');
    }
  };

  const handleMintSuccess = (mintedTokenId) => {
    setTokenId(mintedTokenId);
    loadBlockchainData();
  };

  return (
    <AppLayout>
      <Navbar account={account} onLogout={switchAccount} />

      <main className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700">
            Premium Training NFT Auction
          </h1>
          <p className="text-gray-500 mt-2 text-lg">Powered by Ethereum & IPFS</p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          <SectionCard title="Mint New NFT">
            <NFTUploader nftContract={null} onMintSuccess={handleMintSuccess} />
          </SectionCard>

          <SectionCard title="Create Auction">
            <CreateAuctionForm
              nftContract={null}
              auctionContract={null}
              defaultTokenId={tokenId}
            />
          </SectionCard>
        </div>

        <SectionCard title="Active Auctions">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl font-bold text-gray-800">Auctions</h2>
            <button
              onClick={loadBlockchainData}
              className="text-sm bg-gray-200 hover:bg-gray-300 rounded px-3 py-1"
            >
              Refresh
            </button>
          </div>

          <AuctionList
            auctionData={auctions}
            handleBid={placeBid}
            handleEndAuction={endAuction}
            account={account}
            onSelectAuction={(auction) => setSelectedAuction(auction)}
          />
        </SectionCard>

        {selectedAuction && (
          <SectionCard title="🔍 Auction Detail">
            <AuctionDetail
              auction={selectedAuction}
              handleBid={placeBid}
              handleEndAuction={endAuction}
              account={account}
            />
            <button
              onClick={() => setSelectedAuction(null)}
              className="w-full mt-3 bg-gray-200 hover:bg-gray-300 py-2 rounded text-sm"
            >
              Close Detail
            </button>
          </SectionCard>
        )}
      </main>
    </AppLayout>
  );
}

export default App;
