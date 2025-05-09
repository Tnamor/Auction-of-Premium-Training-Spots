const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
const [deployer] = await hre.ethers.getSigners();
console.log("🔹 Deploying contracts with:", deployer.address);
console.log("🔹 Network:", hre.network.name);

// 1️⃣ Deploy GymNFT
const GymNFT = await hre.ethers.getContractFactory("GymNFT");
const gymNFT = await GymNFT.deploy(deployer.address);
await gymNFT.waitForDeployment();
const gymNFTAddress = await gymNFT.getAddress();
console.log("✅ GymNFT deployed to:", gymNFTAddress);

// 2️⃣ Deploy Auction
const Auction = await hre.ethers.getContractFactory("Auction");
const auction = await Auction.deploy(deployer.address);
await auction.waitForDeployment();
const auctionAddress = await auction.getAddress();
console.log("✅ Auction deployed to:", auctionAddress);

// 3️⃣ Save contract addresses
const addresses = {
GymNFT: gymNFTAddress,
AuctionNFT: auctionAddress,
};

const frontendPath = path.join(__dirname, "..", "frontend", "src", "abis");
fs.writeFileSync(path.join(frontendPath, "auction-address.json"), JSON.stringify(addresses, null, 2));
console.log("📂 Contract addresses written to auction-address.json");

// 4️⃣ Save ABI files
const gymNFTArtifact = await hre.artifacts.readArtifact("GymNFT");
const auctionArtifact = await hre.artifacts.readArtifact("Auction");

fs.writeFileSync(path.join(frontendPath, "GymNFT.json"), JSON.stringify(gymNFTArtifact, null, 2));
fs.writeFileSync(path.join(frontendPath, "Auction.json"), JSON.stringify(auctionArtifact, null, 2));
console.log("📂 ABIs written to GymNFT.json and Auction.json");

console.log("🎉 All contracts deployed and frontend synced!");
}

main().catch((error) => {
console.error("❌ Deployment failed:", error);
process.exitCode = 1;
});