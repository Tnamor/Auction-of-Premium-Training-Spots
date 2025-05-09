import React, { useState } from "react";
import NFTMintForm from "./NFTMintForm";

const NFTUploader = ({ nftContract, onMintSuccess }) => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [metadataURI, setMetadataURI] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const uploadToPinata = async () => {
    const PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
    const PINATA_SECRET_API_KEY = process.env.REACT_APP_PINATA_SECRET_API_KEY;

    if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
      throw new Error("❌ Missing Pinata API credentials.");
    }

    // Upload image
    const imgForm = new FormData();
    imgForm.append("file", file);

    const imageRes = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
      body: imgForm,
    });

    if (!imageRes.ok) throw new Error("❌ Failed to upload image");
    const imageData = await imageRes.json();
    const imageCID = imageData.IpfsHash;

    // Build metadata
    const metadata = {
      name,
      description,
      image: `ipfs://${imageCID}`,
    };

    const metadataRes = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
      body: JSON.stringify(metadata),
    });

    if (!metadataRes.ok) throw new Error("❌ Failed to upload metadata");

    const metadataData = await metadataRes.json();
    return `ipfs://${metadataData.IpfsHash}`;
  };

  const handleUpload = async () => {
    setError("");
    setMetadataURI("");
    if (!file || !name || !description) {
      setError("❗ Please fill in all fields and select a file.");
      return;
    }

    try {
      setLoading(true);
      const uri = await uploadToPinata();
      setMetadataURI(uri);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-2xl shadow-md bg-white space-y-4">
      <h2 className="text-xl font-semibold text-indigo-700">🖼️ Upload & Mint NFT</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full p-2 border border-gray-300 rounded text-sm"
      />
      <input
        type="text"
        placeholder="NFT Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded text-sm"
      />
      <input
        type="text"
        placeholder="NFT Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded text-sm"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-2 rounded text-sm"
      >
        {loading ? "Uploading..." : "Upload to IPFS"}
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {metadataURI && (
        <NFTMintForm
          nftContract={nftContract}
          tokenURI={metadataURI}
          onMintSuccess={onMintSuccess}
        />
      )}
    </div>
  );
};

export default NFTUploader;
