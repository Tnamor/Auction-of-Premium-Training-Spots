# Gym NFT Auction
A decentralized application (DApp) where users can mint and bid on premium training spot NFTs with celebrity coaches. Each training session is a unique ERC-721 token auctioned transparently on the Ethereum blockchain.

Built with:

Smart Contracts (Solidity, Hardhat)

React (frontend)

IPFS + Pinata (for media and metadata)

## MetaMask (for wallet interaction)

   Features
   Mint unique training spot NFTs (ERC-721)

   Create & participate in live auctions

   Upload metadata (image, coach, location, time)

   Secure bidding & transfer of NFTs

   MetaMask integration

   Powered by Ethereum & IPFS (via Pinata)

   Prerequisites
Node.js ≥ 14.x
npm or yarn

## Git

MetaMask browser extension

Pinata account (for storing NFT metadata on IPFS)

## Installation
### 1. Clone the repository
bash

`
git clone https://github.com/Tnamor/Auction-of-Premium-Training-Spots.git
cd Auction-of-Premium-Training-Spots
`

### 3. Install frontend dependencies
bash

`
npm install
or
yarn install
`

## Environment Variables
You’ll need two .env files: one for the frontend and one for the smart contracts.

Frontend (.env)
Path: /Auction-of-Premium-Training-Spots/.env

Example:

`
REACT_APP_PINATA_API_KEY=your_pinata_api_key
REACT_APP_PINATA_SECRET_API_KEY=your_pinata_secret_api_key
`

This enables uploading NFT metadata to IPFS via Pinata.

## Smart Contracts (.env)
Path: /Auction-of-Premium-Training-Spots/contracts/.env (or root)

Example for Hardhat:
`
INFURA_PROJECT_ID=your_infura_project_id
PRIVATE_KEY=your_wallet_private_key
`

Used for contract deployment to Sepolia or another testnet.

⚙️ Contract Deployment (via Hardhat)
Install Hardhat (if not already):

bash

`
npm install --save-dev hardhat
`

Compile:

bash

`
npx hardhat compile
`

Deploy:

Update hardhat.config.js with your network and deploy:

bash

`
npx hardhat run scripts/deploy.js --network sepolia
`

After deployment, copy contract addresses and ABIs to:

frontend/src/abis/auction-address.json
frontend/src/abis/Auction.json
frontend/src/abis/GymNFT.json

Running the Frontend
bash

`
npm start
or
yarn start
`

Visit: http://localhost:3000

Ensure MetaMask is unlocked and connected to the correct network (e.g., Sepolia).

App Usage
Upload image + metadata (coach, date, description, location) to IPFS via Pinata.

Mint NFT with metadata URI.

Start an auction for your token.

Users can place ETH bids in real time.

Auction owner can manually end the auction.

NFT is transferred to the highest bidder after auction ends.

Automatic ending if no new bids within 24 hours.

## Testing (Optional)
To test locally:

bash

`
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
`

And connect MetaMask to http://localhost:8545.

## Contributing
Feel free to fork, improve or submit pull requests:

Fork this repo

Create a feature branch

Commit your changes

Open a pull request

## Resources

Solidity Docs: https://docs.soliditylang.org/

OpenZeppelin: https://docs.openzeppelin.com/contracts

Hardhat: https://hardhat.org/getting-started/

Pinata: https://docs.pinata.cloud/

MetaMask: https://metamask.io/
