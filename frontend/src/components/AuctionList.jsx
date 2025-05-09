// frontend/src/components/AuctionList.jsx
import React, { useEffect, useState } from "react";

function AuctionCard({ auction, handleBid, handleEndAuction, account }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = Math.floor(Date.now() / 1000);
      const secondsLeft = parseInt(auction.endTime) - now;

      if (secondsLeft > 0) {
        const hours = Math.floor(secondsLeft / 3600);
        const minutes = Math.floor((secondsLeft % 3600) / 60);
        const seconds = secondsLeft % 60;
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft("⏰ Expired");
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [auction.endTime]);

  const shortAddress = (addr) => {
    return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "N/A";
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow flex flex-col justify-between">
      <div className="space-y-2">
        <h2 className="text-lg font-bold text-indigo-700">
          🎟 Token #{auction.tokenId}
        </h2>
        <p className="text-sm text-gray-600">
          <strong>Seller:</strong> {shortAddress(auction.seller)}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Highest Bid:</strong> {auction.highestBid} ETH
        </p>
        <p className="text-sm text-gray-600">
          <strong>Bidder:</strong> {shortAddress(auction.highestBidder)}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Time Left:</strong>{" "}
          <span className={timeLeft === "⏰ Expired" ? "text-red-600" : ""}>
            {timeLeft}
          </span>
        </p>
        <p className="text-sm">
          <strong>Status:</strong>{" "}
          <span
            className={`ml-1 font-semibold ${
              auction.ended ? "text-red-600" : "text-green-600"
            }`}
          >
            {auction.ended ? "Ended" : "Active"}
          </span>
        </p>
      </div>

      {!auction.ended && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const bid = e.target.elements.bidAmount.value;
            handleBid(auction.auctionId, bid);
            e.target.reset();
          }}
          className="mt-4"
        >
          <input
            type="number"
            step="0.01"
            min="0"
            name="bidAmount"
            placeholder="Enter bid in ETH"
            className="border px-3 py-2 rounded w-full text-sm mb-2"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 text-sm font-medium"
          >
            Place Bid
          </button>
        </form>
      )}

      {!auction.ended &&
        auction.seller?.toLowerCase() === account?.toLowerCase() && (
          <button
            className="mt-2 bg-red-600 text-white py-2 rounded hover:bg-red-700 text-sm font-medium"
            onClick={() => handleEndAuction(auction.auctionId)}
          >
            End Auction
          </button>
        )}
    </div>
  );
}

function AuctionList({ auctionData, handleBid, handleEndAuction, account }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {auctionData.map((auction) => (
        <AuctionCard
          key={auction.auctionId}
          auction={auction}
          handleBid={handleBid}
          handleEndAuction={handleEndAuction}
          account={account}
        />
      ))}
    </div>
  );
}

export default AuctionList;
