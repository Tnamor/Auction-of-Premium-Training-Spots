// utils/pinataUpload.js
export async function uploadMetadataToPinata(file, name, description, coach, date, location) {
  const PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
  const PINATA_SECRET_API_KEY = process.env.REACT_APP_PINATA_SECRET_API_KEY;

  if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
    throw new Error("❌ Pinata API keys are missing");
  }

  // Upload image
  const imageForm = new FormData();
  imageForm.append("file", file);

  const imageRes = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_SECRET_API_KEY,
    },
    body: imageForm,
  });

  if (!imageRes.ok) throw new Error("❌ Image upload failed");

  const imageData = await imageRes.json();
  const imageCID = imageData.IpfsHash;

  // Create metadata object
  const metadata = {
    name,
    description,
    coach,
    date,
    location,
    image: `ipfs://${imageCID}`,
  };

  // Upload metadata
  const metadataRes = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_SECRET_API_KEY,
    },
    body: JSON.stringify(metadata),
  });

  if (!metadataRes.ok) throw new Error("❌ Metadata upload failed");

  const metadataData = await metadataRes.json();
  return `ipfs://${metadataData.IpfsHash}`;
}
