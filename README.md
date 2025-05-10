# Gym NFT Auction

This is a decentralized application (DApp) that allows users to bid on premium training spots represented as NFTs (ERC-721). The project includes a smart contract deployed on Ethereum, a frontend built with React, and uses Pinata to store images and metadata for NFTs.

## Features

- **Auction System**: Users can create and participate in auctions for training spots.
- **NFTs (ERC-721)**: Training spots are represented as unique NFTs.
- **Pinata Integration**: Images and metadata for NFTs are uploaded to IPFS via Pinata.
- **MetaMask Integration**: Interact with the Ethereum blockchain using the MetaMask wallet.
- **Smart Contract**: Developed in Solidity using OpenZeppelin contracts.

## Prerequisites

Before you can run the project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)
- [MetaMask](https://metamask.io/) wallet extension in your browser
- [Pinata](https://www.pinata.cloud/) account for uploading NFT metadata and images.

## Installation

### 1. Clone the repository

Clone this repository to your local machine using Git:

```bash
git clone https://github.com/Tnamor/Auction-of-Premium-Training-Spots.git
cd Auction-of-Premium-Training-Spots
```
2. Install dependencies
Install the required dependencies for the project:
```
bash
npm install
or if you're using Yarn:

bash
yarn install
```
3. Set up environment variables
You need two .env files for this project. One is for the frontend (React) and the other one is for the smart contract deployment.

3.1. Frontend .env file
This file should be placed in the root directory of the project (where package.json is located for the frontend). It contains environment variables for Pinata API and other settings.

Path: /AuctionNFTProject/.env

Example contents for the frontend:

plaintext
REACT_APP_PINATA_API_KEY=your_pinata_api_key
REACT_APP_PINATA_SECRET_API_KEY=your_pinata_secret_api_key
Replace your_pinata_api_key and your_pinata_secret_api_key with your actual Pinata API credentials.

3.2. Smart Contract .env file
If you're using environment variables for network settings or deployment, you need a second .env file for the smart contract (e.g., when using Hardhat or Truffle). This file is used for deployment configurations like Infura, your private key, etc.

Path: /AuctionNFTProject/.env (or /AuctionNFTProject/contracts/.env depending on your setup)

Example contents for Hardhat:

plaintext
INFURA_PROJECT_ID=your_infura_project_id
PRIVATE_KEY=your_private_key
Replace your_infura_project_id and your_private_key with your actual Infura project ID and the private key needed for deploying to Ethereum.

4. Smart Contract Deployment
You will need to deploy the smart contract on Ethereum (either on a testnet or the mainnet). The contract is located in the /contracts folder. Use Hardhat or Truffle to deploy it. Here's an example of using Hardhat:

Install Hardhat:
```
bash
npm install --save-dev hardhat
Compile the contract:

bash
npx hardhat compile
Deploy the contract to the Ethereum network (adjust the hardhat.config.js for your network):

bash
npx hardhat run scripts/deploy.js --network rinkeby
```
5. Update frontend with contract address
Once the smart contract is deployed, update the frontend in the App.js file with the contract address and ABI.

javascript
const contractAddress = "your_contract_address";
const contractABI = [...];
Replace "your_contract_address" with the address of your deployed smart contract and the correct ABI.

Running the Application
Once everything is set up, run the frontend application:
```
bash
npm start
or

bash
yarn start
```
This will start the development server, and you can access the app at http://localhost:3000 in your browser.

Interacting with the Smart Contract
MetaMask: Make sure MetaMask is installed and connected to the appropriate Ethereum network (Mainnet, Rinkeby, or another testnet).

Minting NFTs: The frontend allows users to mint NFTs by uploading images and metadata via Pinata. The minting process involves interacting with the smart contract to create the NFTs.

Placing Bids: Users can participate in live auctions by placing bids in Ether (ETH).

Contributing
If you want to contribute to this project, feel free to fork the repository and submit a pull request. Here's how you can contribute:

Fork the repository.

Create a feature branch (git checkout -b feature/your-feature).

Commit your changes (git commit -am 'Add new feature').

Push to the branch (git push origin feature/your-feature).

Create a new pull request.

License
This project is licensed under the MIT License - see the LICENSE file for details.

Additional Resources
Solidity Documentation

OpenZeppelin Contracts

Hardhat Documentation

Pinata Documentation

yaml

---

### Key Changes:

1. **Two `.env` files**:
   - One for the frontend (React) with Pinata API keys.
   - One for the smart contract deployment, typically for services like Infura and private keys.

2. **Paths for `.env` files**:
   - Frontend `.env`: `/AuctionNFTProject/.env` (in the root directory of the frontend).
   - Smart Contract `.env`: `/AuctionNFTProject/.env` or `/AuctionNFTProject/contracts/.env` (depending on your configuration).

---

This should now cover everything, including how to set up and configure the environment variables properl
