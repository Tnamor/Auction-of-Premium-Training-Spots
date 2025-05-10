// src/components/CreateAuctionForm.jsx
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const CreateAuctionForm = ({ nftContract, auctionContract, defaultTokenId = "" }) => {
const [tokenId, setTokenId] = useState(defaultTokenId);
const [duration, setDuration] = useState("");
const [txHash, setTxHash] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const [activeAuction, setActiveAuction] = useState(null);
const [timeLeft, setTimeLeft] = useState("");
const [intervalId, setIntervalId] = useState(null);

// Sync tokenId from props
useEffect(() => {
setTokenId(defaultTokenId);
}, [defaultTokenId]);

// Check for existing auction when tokenId changes
useEffect(() => {
if (!tokenId || !auctionContract) return;
checkExistingAuction(tokenId);
}, [tokenId, auctionContract]);

// Cleanup interval when component unmounts
useEffect(() => {
return () => {
if (intervalId) clearInterval(intervalId);
};
}, [intervalId]);

const checkExistingAuction = async (id) => {
try {
const auction = await auctionContract.getAuction(id);
if (auction && !auction.ended) {
setActiveAuction(auction);
const interval = updateCountdown(auction.endTime.toString());
setIntervalId(interval);
} else {
setActiveAuction(null);
setTimeLeft("");
}
} catch (err) {
setActiveAuction(null);
setTimeLeft("");
}
};

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
return interval;
};

const handleCreateAuction = async () => {
setError("");
setTxHash("");


if (!window.ethereum) return setError("❌ MetaMask not detected");
if (!tokenId || isNaN(duration) || parseInt(duration) <= 0) {
  return setError("⚠️ Enter valid Token ID and Duration (in minutes)");
}
if (!nftContract || !auctionContract) return setError("⚠️ Contracts not ready");

try {
  setLoading(true);
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const userAddress = await signer.getAddress();

  // Validate token ownership
  let owner;
  try {
    owner = await nftContract.ownerOf(tokenId);
  } catch (err) {
    if (
      err.message.includes("ERC721NonexistentToken") ||
      err.message.includes("nonexistent") ||
      err.message.includes("does not exist")
    ) {
      return setError(`❌ Token ID ${tokenId} does not exist. Please mint it first.`);
    }
    throw err;
  }

  if (owner.toLowerCase() !== userAddress.toLowerCase()) {
    return setError("⚠️ You are not the owner of this token");
  }

  const isApproved = await nftContract.getApproved(tokenId);
  if (isApproved.toLowerCase() !== auctionContract.target.toLowerCase()) {
    const approveTx = await nftContract.approve(auctionContract.target, tokenId);
    await approveTx.wait();
  }

  const tx = await auctionContract.createAuction(
    nftContract.target,
    tokenId,
    parseInt(duration)
  );
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
<div className="p-6 border rounded-2xl shadow-md bg-white">
<h2 className="text-xl font-semibold mb-4 text-indigo-700">🏁 Create Auction</h2>


  <div className="mb-3">
    <label className="block text-sm font-medium text-gray-700 mb-1">Token ID</label>
    <input
      type="number"
      value={tokenId}
      onChange={(e) => setTokenId(e.target.value)}
      placeholder="e.g., 1"
      className="w-full p-2 border border-gray-300 rounded text-sm"
    />
  </div>

  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
    <input
      type="number"
      value={duration}
      onChange={(e) => setDuration(e.target.value)}
      placeholder="e.g., 30"
      className="w-full p-2 border border-gray-300 rounded text-sm"
    />
  </div>

  {activeAuction && (
    <p className="text-sm text-yellow-600 mb-2">
      ⏳ Auction already active for this token. Time left: <strong>{timeLeft}</strong>
    </p>
  )}

  <button
    onClick={handleCreateAuction}
    disabled={loading || !tokenId || !duration || activeAuction}
    className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded-md font-semibold text-sm disabled:opacity-50"
  >
    {loading ? "Creating..." : "Start Auction"}
  </button>

  {txHash && (
    <div className="text-sm text-green-600 break-all mt-3">
      ✅ Auction Created! Tx:&nbsp;
      <a
        href={`https://sepolia.etherscan.io/tx/${txHash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="underline"
      >
        {txHash.slice(0, 10)}...
      </a>
    </div>
  )}

  {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
</div>
);
};

export default CreateAuctionForm;