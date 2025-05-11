// frontend/src/components/CreateAuctionForm.jsx
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Clock, Sparkles } from "lucide-react";

const CreateAuctionForm = ({ defaultTokenId = "" }) => {
const [tokenId, setTokenId] = useState(defaultTokenId);
const [duration, setDuration] = useState("");
const [txHash, setTxHash] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [activeAuction, setActiveAuction] = useState(null);
const [timeLeft, setTimeLeft] = useState("");

const auctionABI = require("../abis/Auction.json").abi;
const nftABI = require("../abis/GymNFT.json").abi;
const addresses = require("../abis/auction-address.json");
const auctionAddress = addresses.AuctionNFT;
const nftAddress = addresses.GymNFT;

useEffect(() => {
setTokenId(defaultTokenId);
}, [defaultTokenId]);

useEffect(() => {
if (tokenId) checkExistingAuction(tokenId);
}, [tokenId]);

const updateCountdown = (endTime) => {
const interval = setInterval(() => {
const now = Math.floor(Date.now() / 1000);
const secondsLeft = parseInt(endTime) - now;
if (secondsLeft > 0) {
const h = Math.floor(secondsLeft / 3600);
const m = Math.floor((secondsLeft % 3600) / 60);
const s = secondsLeft % 60;
setTimeLeft(`${h}h ${m}m ${s}s`);
} else {
setTimeLeft("⏰ Expired");
setActiveAuction(null);
clearInterval(interval);
}
}, 1000);
};

const checkExistingAuction = async (id) => {
try {
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const auctionContract = new ethers.Contract(auctionAddress, auctionABI, signer);
const auction = await auctionContract.getAuction(id);

scss
Копировать
Редактировать
  if (auction && !auction.ended) {
    setActiveAuction(auction);
    updateCountdown(auction.endTime.toString());
  } else {
    setActiveAuction(null);
    setTimeLeft("");
  }
} catch {
  setActiveAuction(null);
  setTimeLeft("");
}
};

const handleCreateAuction = async () => {
setError("");
setTxHash("");
if (!window.ethereum) return setError("❌ MetaMask not detected");
if (!tokenId || isNaN(duration) || parseInt(duration) <= 0)
return setError("⚠️ Enter valid Token ID and duration");


try {
  setLoading(true);
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const userAddress = await signer.getAddress();

  const auctionContract = new ethers.Contract(auctionAddress, auctionABI, signer);
  const nftContract = new ethers.Contract(nftAddress, nftABI, signer);

  const owner = await nftContract.ownerOf(tokenId);
  if (owner.toLowerCase() !== userAddress.toLowerCase()) {
    return setError("🚫 You are not the owner of this token");
  }

  const isApproved = await nftContract.getApproved(tokenId);
  if (isApproved.toLowerCase() !== auctionAddress.toLowerCase()) {
    const approveTx = await nftContract.approve(auctionAddress, tokenId);
    await approveTx.wait();
  }

  const tx = await auctionContract.createAuction(nftAddress, tokenId, parseInt(duration));
  const receipt = await tx.wait();

  setTxHash(receipt.hash);
  setTokenId("");
  setDuration("");
  setActiveAuction(null);
} catch (err) {
  console.error("Create auction error:", err);
  setError("❌ Failed to create auction. See console.");
} finally {
  setLoading(false);
}
};

return (
<div className="rounded-2xl bg-white shadow-xl p-6 space-y-4 border">
<h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
<Sparkles className="text-indigo-500" size={20} /> Create New Auction
</h2>


  <div>
    <label className="text-sm text-gray-600 mb-1 block">Token ID</label>
    <input
      type="number"
      value={tokenId}
      onChange={(e) => setTokenId(e.target.value)}
      placeholder="e.g., 1"
      className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-indigo-500"
    />
  </div>

  <div>
    <label className="text-sm text-gray-600 mb-1 block">Duration (minutes)</label>
    <input
      type="number"
      value={duration}
      onChange={(e) => setDuration(e.target.value)}
      placeholder="e.g., 30"
      className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-indigo-500"
    />
  </div>

  {activeAuction && (
    <div className="flex items-center text-sm text-yellow-600 font-medium rounded bg-yellow-50 px-3 py-2 border border-yellow-300">
      <Clock className="w-4 h-4 mr-2" /> Active auction in progress. Time left:{" "}
      <strong className="ml-1">{timeLeft}</strong>
    </div>
  )}

  <button
    onClick={handleCreateAuction}
    disabled={loading || !tokenId || !duration || activeAuction}
    className="w-full py-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50"
  >
    {loading ? "⏳ Creating..." : "Start Auction"}
  </button>

  {txHash && (
    <p className="text-sm text-green-600 mt-1 break-words">
      ✅ Auction created!{" "}
      <a
        href={`https://sepolia.etherscan.io/tx/${txHash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="underline"
      >
        View on Etherscan
      </a>
    </p>
  )}

  {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
</div>
);
};

export default CreateAuctionForm;