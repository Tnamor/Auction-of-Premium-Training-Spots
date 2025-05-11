// frontend/src/components/AuctionList.jsx
import React from "react";
import AuctionCard from "./AuctionCard";

const AuctionList = ({ auctionData, handleBid, handleEndAuction, account }) => {
  return (
    <section className="bg-white p-6 rounded-2xl shadow border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🔥</span>
          <h2 className="text-2xl font-bold text-gray-800">Live Auctions</h2>
        </div>
        <span className="text-sm text-gray-500">{auctionData.length} auctions</span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {auctionData.length > 0 ? (
          auctionData.map((auction) => (
            <AuctionCard
              key={auction.auctionId}
              auction={auction}
              handleBid={handleBid}
              handleEndAuction={handleEndAuction}
              account={account}
            />
          ))
        ) : (
          <p className="text-gray-500 text-sm italic col-span-full text-center py-10">
            No active auctions available.
          </p>
        )}
      </div>
    </section>
  );
};

export default AuctionList;
