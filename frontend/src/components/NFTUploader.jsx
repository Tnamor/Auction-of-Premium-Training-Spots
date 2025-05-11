import React, { useState } from "react";
import NFTMintForm from "./NFTMintForm";
import { UploadCloud, ImageIcon } from "lucide-react";

const NFTUploader = ({ onMintSuccess }) => {
const [file, setFile] = useState(null);
const [name, setName] = useState("");
const [description, setDescription] = useState("");
const [coach, setCoach] = useState("");
const [date, setDate] = useState("");
const [location, setLocation] = useState("");
const [metadataURI, setMetadataURI] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const uploadToPinata = async () => {
const PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.REACT_APP_PINATA_SECRET_API_KEY;


if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
  throw new Error("❌ Missing Pinata API credentials.");
}

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

const metadata = {
  name,
  description,
  coach,
  date,
  location,
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
if (!file || !name || !description || !coach || !date || !location) {
setError("❗ Please fill in all fields and select a file.");
return;
}


try {
  setLoading(true);
  const uri = await uploadToPinata();
  setMetadataURI(uri);
} catch (err) {
  console.error("Upload error:", err);
  setError(err.message || "❌ Upload failed.");
} finally {
  setLoading(false);
}
};

return (
<div className="p-6 bg-white border rounded-2xl shadow-md space-y-5">
<div className="flex items-center gap-2 text-indigo-700 text-xl font-semibold">
<UploadCloud size={20} />
Upload & Mint NFT
</div>

  <label className="block">
    <span className="text-sm text-gray-600 mb-1 flex items-center gap-2">
      <ImageIcon size={14} /> Select Image
    </span>
    <input
      type="file"
      accept="image/*"
      onChange={(e) => setFile(e.target.files[0])}
      className="w-full p-2 border border-gray-300 rounded text-sm bg-gray-50"
    />
  </label>

  <input
    type="text"
    placeholder="NFT Name"
    value={name}
    onChange={(e) => setName(e.target.value)}
    className="w-full p-2 border border-gray-300 rounded text-sm bg-gray-50"
  />

  <input
    type="text"
    placeholder="Description"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    className="w-full p-2 border border-gray-300 rounded text-sm bg-gray-50"
  />

  <input
    type="text"
    placeholder="Coach Name"
    value={coach}
    onChange={(e) => setCoach(e.target.value)}
    className="w-full p-2 border border-gray-300 rounded text-sm bg-gray-50"
  />

  <input
    type="datetime-local"
    value={date}
    onChange={(e) => setDate(e.target.value)}
    className="w-full p-2 border border-gray-300 rounded text-sm bg-gray-50"
  />

  <input
    type="text"
    placeholder="Location"
    value={location}
    onChange={(e) => setLocation(e.target.value)}
    className="w-full p-2 border border-gray-300 rounded text-sm bg-gray-50"
  />

  <button
    onClick={handleUpload}
    disabled={loading}
    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md text-sm font-medium disabled:opacity-50"
  >
    {loading ? "Uploading..." : "Upload to IPFS"}
  </button>

  {error && <div className="text-sm text-red-600">{error}</div>}

  {metadataURI && (
    <div className="border-t pt-4">
      <NFTMintForm
        tokenURI={metadataURI}
        onMintSuccess={onMintSuccess}
      />
    </div>
  )}
</div>
);
};

export default NFTUploader;