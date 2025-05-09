import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const CreateAuctionForm = ({ nftContract, auctionContract, defaultTokenId = "" }) => {
const [tokenId, setTokenId] = useState(defaultTokenId);
const [duration, setDuration] = useState("");
const [txHash, setTxHash] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

useEffect(() => {
setTokenId(defaultTokenId);
}, [defaultTokenId]);

const handleCreateAuction = async () => {
setError("");
setTxHash("");


if (!window.ethereum) return setError("❌ MetaMask not detected");
if (!tokenId || isNaN(duration) || parseInt(duration) <= 0)
  return setError("⚠️ Please enter valid Token ID and Duration (minutes)");

if (!nftContract || !auctionContract) return setError("⚠️ Contracts are not connected");

try {
  setLoading(true);
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const userAddress = await signer.getAddress();

  const owner = await nftContract.ownerOf(tokenId);
  if (owner.toLowerCase() !== userAddress.toLowerCase()) {
    return setError("⚠️ You are not the owner of this token");
  }

  const isApproved = await nftContract.getApproved(tokenId);
  if (isApproved.toLowerCase() !== auctionContract.target.toLowerCase()) {
    const approveTx = await nftContract.approve(auctionContract.target, tokenId);
    await approveTx.wait();
  }

  const tx = await auctionContract.createAuction(nftContract.target, tokenId, parseInt(duration));
  const receipt = await tx.wait();
  setTxHash(receipt.hash);
  setTokenId(""); // Clear after success
  setDuration("");
} catch (err) {
  console.error("Auction creation error:", err);
  setError("❌ Failed to create auction. See console for details.");
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
      placeholder="e.g., 10"
      className="w-full p-2 border border-gray-300 rounded text-sm"
    />
  </div>

  <button
    onClick={handleCreateAuction}
    disabled={loading || !tokenId || !duration}
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