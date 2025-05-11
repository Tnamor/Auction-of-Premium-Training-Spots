import React, { useState } from "react";
import { ethers } from "ethers";
import { Sparkles, Loader2, CheckCircle } from "lucide-react";
import GymNFTABI from "../abis/GymNFT.json";
import auctionAddresses from "../abis/auction-address.json";

const NFTMintForm = ({ tokenURI, onMintSuccess }) => {
const [txHash, setTxHash] = useState("");
const [tokenId, setTokenId] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const handleMint = async () => {
setError("");
setTxHash("");
setTokenId("");


if (!window.ethereum) {
  setError("❌ MetaMask is not available.");
  return;
}

if (!tokenURI?.startsWith("ipfs://")) {
  setError("⚠️ Invalid Token URI.");
  return;
}

try {
  setLoading(true);

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const nftContract = new ethers.Contract(
    auctionAddresses.GymNFT,
    GymNFTABI.abi,
    signer
  );

  const tx = await nftContract.mintNFT(tokenURI.trim());
  const receipt = await tx.wait();

  const transferEvent = receipt.logs.find(
    (log) => log.topics[0] === ethers.id("Transfer(address,address,uint256)")
  );
  if (!transferEvent) throw new Error("❌ Transfer event not found");

  const tokenIdHex = transferEvent.topics[3];
  const mintedId = ethers.getBigInt(tokenIdHex).toString();

  setTokenId(mintedId);
  setTxHash(receipt.hash);
  if (onMintSuccess) onMintSuccess(mintedId);
} catch (err) {
  console.error("❌ Mint error:", err);
  setError(err.message || "❌ Failed to mint NFT.");
} finally {
  setLoading(false);
}
};

return (
<div className="p-6 bg-white border rounded-2xl shadow-md space-y-4">
<div className="flex items-center gap-2 text-indigo-700 font-semibold text-xl">
<Sparkles size={22} /> Mint NFT
</div>


  <div className="text-sm text-gray-600 break-words bg-gray-50 p-3 rounded-md border font-mono leading-snug">
    <span className="text-gray-500 block mb-1">Token URI:</span>
    {tokenURI || "⛔ No metadata yet"}
  </div>

  <button
    onClick={handleMint}
    disabled={loading || !tokenURI}
    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium disabled:opacity-50"
  >
    {loading ? (
      <span className="flex items-center justify-center gap-2">
        <Loader2 className="animate-spin" size={16} /> Minting...
      </span>
    ) : (
      "Mint NFT"
    )}
  </button>

  {tokenId && (
    <div className="flex items-center text-green-600 text-sm gap-2">
      <CheckCircle size={18} />
      <span>Minted Token ID:</span>
      <strong>{tokenId}</strong>
    </div>
  )}

  {txHash && (
    <div className="text-sm text-green-700 break-all">
      ✅ Tx:&nbsp;
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

  {error && <div className="text-sm text-red-600">{error}</div>}
</div>
);
};

export default NFTMintForm;