import React, { useState } from "react";
import { ethers } from "ethers";

const NFTMintForm = ({ nftContract, tokenURI, onMintSuccess }) => {
  const [txHash, setTxHash] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleMint = async () => {
    setError("");
    setTxHash("");
    setTokenId("");

    if (!window.ethereum) return setError("❌ MetaMask is not available.");
    if (!tokenURI?.startsWith("ipfs://")) return setError("⚠️ Invalid Token URI.");
    if (!nftContract?.mintNFT) return setError("⚠️ NFT contract is not connected.");

    try {
      setLoading(true);
      const tx = await nftContract.mintNFT(tokenURI.trim());
      const receipt = await tx.wait();

      const transferEvent = receipt.logs.find((log) => log.topics[0] === ethers.id("Transfer(address,address,uint256)"));
      if (!transferEvent) throw new Error("❌ Transfer event not found");

      const tokenIdHex = transferEvent.topics[3];
      const mintedId = ethers.getBigInt(tokenIdHex).toString();

      setTokenId(mintedId);
      setTxHash(receipt.hash);
      if (onMintSuccess) onMintSuccess(mintedId);
    } catch (err) {
      console.error("❌ Mint error:", err);
      setError("❌ Failed to mint NFT. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-2xl shadow-md bg-white mt-6">
      <h2 className="text-xl font-semibold mb-4 text-indigo-700">🎨 Mint NFT</h2>

      <div className="mb-2 text-sm text-gray-700 break-words">
        <strong>Token URI:</strong> {tokenURI || "⛔ No metadata yet"}
      </div>

      <button
        onClick={handleMint}
        disabled={loading || !tokenURI}
        className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-md font-semibold"
      >
        {loading ? "Minting..." : "Mint NFT"}
      </button>

      {tokenId && (
        <div className="text-sm text-green-600 mt-2">
          ✅ Minted Token ID: <strong>{tokenId}</strong>
        </div>
      )}

      {txHash && (
        <div className="text-sm text-green-600 mt-1 break-all">
          ✅ Tx:&nbsp;
          <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="underline">
            {txHash.slice(0, 10)}...
          </a>
        </div>
      )}

      {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
    </div>
  );
};

export default NFTMintForm;
