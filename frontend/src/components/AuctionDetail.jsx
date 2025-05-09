import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import auctionAbi from '../abis/Auction.json';

const AuctionDetail = ({ auctionAddress }) => {
  const [currentBid, setCurrentBid] = useState(null);
  const [highestBidder, setHighestBidder] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [winner, setWinner] = useState('');
  const [isEnded, setIsEnded] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const auctionContract = new ethers.Contract(auctionAddress, auctionAbi, signer);

  const loadAuctionDetails = async () => {
    try {
      const bid = await auctionContract.highestBid();
      const bidder = await auctionContract.highestBidder();
      const ended = await auctionContract.ended();
      const win = await auctionContract.winner();

      setCurrentBid(ethers.utils.formatEther(bid));
      setHighestBidder(bidder);
      setIsEnded(ended);
      if (ended && win !== ethers.constants.AddressZero) setWinner(win);
    } catch (err) {
      setError('Ошибка при загрузке данных аукциона');
    }
  };

  const placeBid = async () => {
    try {
      setLoading(true);
      const tx = await auctionContract.bid({ value: ethers.utils.parseEther(bidAmount) });
      await tx.wait();
      await loadAuctionDetails();
      setBidAmount('');
    } catch (err) {
      setError('Ошибка при ставке');
    } finally {
      setLoading(false);
    }
  };

  const finalizeAuction = async () => {
    try {
      setLoading(true);
      const tx = await auctionContract.finalizeAuction();
      await tx.wait();
      await loadAuctionDetails();
    } catch (err) {
      setError('Ошибка при завершении аукциона');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuctionDetails();
  }, []);

  return (
    <div className="p-4 border rounded-xl shadow-md bg-white">
      <h2 className="text-xl font-bold mb-2">Аукцион</h2>
      <p>Текущая ставка: {currentBid} ETH</p>
      <p>Лидер: {highestBidder}</p>
      {!isEnded ? (
        <>
          <input
            type="number"
            placeholder="Сумма ставки в ETH"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            className="border px-2 py-1 mt-2"
          />
          <button
            onClick={placeBid}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-1 rounded mt-2"
          >
            Сделать ставку
          </button>
          <button
            onClick={finalizeAuction}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-1 rounded mt-2 ml-2"
          >
            Завершить аукцион
          </button>
        </>
      ) : (
        <p className="text-green-600 font-semibold mt-2">Победитель: {winner}</p>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default AuctionDetail;
