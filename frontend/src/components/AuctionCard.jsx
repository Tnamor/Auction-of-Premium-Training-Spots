import React, { useEffect, useState } from "react";

function AuctionCard({ auction, handleBid, handleEndAuction, account, onView }) {
const [timeLeft, setTimeLeft] = useState("");
const [bidAmount, setBidAmount] = useState("");

const isOwner = auction.seller?.toLowerCase() === account?.toLowerCase();
const short = (addr) => addr?.slice(0, 6) + "..." + addr?.slice(-4);

useEffect(() => {
const updateTime = () => {
const now = Math.floor(Date.now() / 1000);
const seconds = parseInt(auction.endTime) - now;

  if (seconds <= 0) {
    setTimeLeft("Expired");
    return;
  }

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  setTimeLeft(`${h}h ${m}m ${s}s`);
};

updateTime();
const interval = setInterval(updateTime, 1000);
return () => clearInterval(interval);
}, [auction.endTime]);

return (
<div className="relative bg-white rounded-2xl shadow border border-gray-200 overflow-hidden hover:shadow-xl transition flex flex-col">
<div className="relative">
{auction.metadata?.image && (
<img
src={
auction.metadata.image.startsWith("ipfs://")
? `https://gateway.pinata.cloud/ipfs/${auction.metadata.image.slice(7)}`
: auction.metadata.image
}
alt={auction.metadata?.name}
className="w-full h-60 object-cover"
/>
)}
<div className="absolute top-2 left-2 bg-white text-xs font-medium text-gray-600 px-2 py-1 rounded shadow">
{short(auction.seller)}
</div>
{isOwner && (
<div className="absolute top-2 right-2 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded shadow">
Owner
</div>
)}
</div>

  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
    <div>
      <h3 className="text-base font-semibold text-gray-900 truncate">
        {auction.metadata?.name || `Token #${auction.tokenId}`}
      </h3>
      <p className="text-sm text-gray-500 line-clamp-2">
        {auction.metadata?.description}
      </p>
    </div>

    <div className="text-sm text-gray-600 space-y-1">
      <p>🏋️ Coach: <span className="text-gray-800">{auction.metadata?.coach}</span></p>
      <p>📍 Location: {auction.metadata?.location}</p>
      <p>📅 Date: {auction.metadata?.date}</p>
    </div>

    <div className="text-sm mt-2 bg-gray-50 p-3 rounded-xl space-y-1">
      <p>💰 Highest Bid: <span className="text-indigo-600 font-semibold">{auction.highestBid} ETH</span></p>
      <p>🏅 Bidder: {short(auction.highestBidder)}</p>
      <p>
        ⏰ Time Left:{" "}
        <span className={timeLeft === "Expired" ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}>
          {timeLeft}
        </span>
      </p>
      <p>
        Status:{" "}
        <span className={`font-semibold ${auction.ended ? "text-red-600" : "text-green-600"}`}>
          {auction.ended ? "Ended" : "Active"}
        </span>
      </p>
    </div>

    {!auction.ended && (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleBid(auction.auctionId, bidAmount);
          setBidAmount("");
        }}
        className="pt-2 space-y-2"
      >
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="Bid amount in ETH"
          name="bidAmount"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700"
        >
          💸 Place Bid
        </button>
      </form>
    )}

    {!auction.ended && isOwner && (
      <button
        onClick={() => handleEndAuction(auction.auctionId)}
        className="w-full mt-2 bg-red-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-red-700"
      >
        🔚 End Auction
      </button>
    )}

    <button
      onClick={onView}
      className="w-full mt-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-2 rounded-lg font-medium"
    >
      View Details
    </button>
  </div>
</div>
);
}

export default AuctionCard;