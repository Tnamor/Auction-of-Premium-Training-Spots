// components/NFTUploader.jsx
import React, { useState } from "react";
import NFTMintForm from "./NFTMintForm";
import { uploadMetadataToPinata } from "../utils/pinataUpload";

const NFTUploader = ({ nftContract, onMintSuccess }) => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coach, setCoach] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [metadataURI, setMetadataURI] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    setError("");
    setMetadataURI("");

    if (!file || !name || !description || !coach || !date || !location) {
      setError("❗ Please fill in all fields and select a file.");
      return;
    }

    try {
      setLoading(true);
      const uri = await uploadMetadataToPinata(file, name, description, coach, date, location);
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
      <input
        type="text"
        placeholder="Coach Name"
        value={coach}
        onChange={(e) => setCoach(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded text-sm"
      />
      <input
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded text-sm"
      />
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
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
