import React, { useEffect, useState } from "react";
import { Clock, Hammer, Wallet, HandCoins, Info } from "lucide-react";

const AuctionDetail = ({ auction, handleBid, handleEndAuction, account }) => {
const [timeLeft, setTimeLeft] = useState("");
const [bidValue, setBidValue] = useState("");

const isOwner = auction.seller?.toLowerCase() === account?.toLowerCase();
const shorten = (addr) => (addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "-");

useEffect(() => {
const updateTimer = () => {
const now = Math.floor(Date.now() / 1000);
const secondsLeft = parseInt(auction.endTime) - now;


  if (secondsLeft <= 0 || auction.ended) {
    setTimeLeft("⏰ Expired");
  } else {
    const h = Math.floor(secondsLeft / 3600);
    const m = Math.floor((secondsLeft % 3600) / 60);
    const s = secondsLeft % 60;
    setTimeLeft(`${h}h ${m}m ${s}s`);
  }
};

updateTimer();
const interval = setInterval(updateTimer, 1000);
return () => clearInterval(interval);
}, [auction.endTime, auction.ended]);

const handleSubmit = (e) => {
e.preventDefault();
if (!bidValue || isNaN(bidValue) || parseFloat(bidValue) <= 0) return;
handleBid(auction.auctionId, bidValue);
setBidValue("");
};

return (
<div className="bg-white border rounded-2xl shadow-xl p-6 w-full max-w-2xl mx-auto space-y-5">
<h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
<Hammer size={20} className="text-indigo-600" />
Auction Details – Token #{auction.tokenId}
</h2>


  {auction.metadata?.image && (
    <img
      src={
        auction.metadata.image.startsWith("ipfs://")
          ? `https://gateway.pinata.cloud/ipfs/${auction.metadata.image.slice(7)}`
          : auction.metadata.image
      }
      alt="NFT"
      className="w-full rounded-xl border object-cover max-h-64"
    />
  )}

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
    <div>
      <p><strong>Name:</strong> {auction.metadata?.name || "-"}</p>
      <p><strong>Description:</strong> {auction.metadata?.description || "-"}</p>
      <p><strong>Coach:</strong> {auction.metadata?.coach || "-"}</p>
      <p><strong>Date:</strong> {auction.metadata?.date || "-"}</p>
      <p><strong>Location:</strong> {auction.metadata?.location || "-"}</p>
    </div>

    <div className="p-3 rounded-xl border border-gray-200 bg-gray-50 space-y-1 text-sm">
      <p className="flex items-center gap-2">
        <Wallet size={16} className="text-gray-500" />
        <strong>Seller:</strong>{" "}
        <span className={isOwner ? "text-indigo-600 font-semibold" : ""}>
          {shorten(auction.seller)} {isOwner && "(You)"}
        </span>
      </p>
      <p className="flex items-center gap-2">
        <HandCoins size={16} className="text-yellow-500" />
        <strong>Highest Bid:</strong>{" "}
        <span className="text-indigo-700 font-semibold">{auction.highestBid} ETH</span>
      </p>
      <p className="flex items-center gap-2">
        <Info size={16} className="text-purple-600" />
        <strong>Highest Bidder:</strong> {shorten(auction.highestBidder)}
      </p>
      <p className="flex items-center gap-2">
        <Clock size={16} className="text-blue-600" />
        <strong>Time Left:</strong>{" "}
        <span className={timeLeft.includes("Expired") ? "text-red-600 font-semibold" : "text-green-700 font-semibold"}>
          {timeLeft}
        </span>
      </p>
      <p>
        <strong>Status:</strong>{" "}
        <span className={`font-semibold ${auction.ended ? "text-red-600" : "text-green-600"}`}>
          {auction.ended ? "Ended" : "Active"}
        </span>
      </p>
    </div>
  </div>

  {!auction.ended && (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="number"
        min="0"
        step="0.01"
        placeholder="Enter your bid (ETH)"
        value={bidValue}
        onChange={(e) => setBidValue(e.target.value)}
        className="w-full border rounded-lg p-2 text-sm focus:ring-indigo-500 focus:outline-none"
      />
      <button
        type="submit"
        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition"
      >
        Place Bid
      </button>
    </form>
  )}

  {!auction.ended && isOwner && (
    <button
      onClick={() => handleEndAuction(auction.auctionId)}
      className="w-full py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg mt-2"
    >
      End Auction
    </button>
  )}
</div>
);
};

export default AuctionDetail;