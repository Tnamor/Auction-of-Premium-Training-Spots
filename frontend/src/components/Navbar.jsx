import React from "react";

const Navbar = ({ account, onLogout }) => {
  return (
    <header className="bg-white border-b shadow-sm px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-indigo-600">🏋️ Gym NFT Auctions</h1>

      <div className="flex items-center space-x-4">
        {account ? (
          <>
            <span className="bg-indigo-100 text-indigo-800 text-sm font-mono px-3 py-1 rounded-full">
              {account.slice(0, 6)}...{account.slice(-4)}
            </span>
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg text-sm"
            >
              Log Out
            </button>
          </>
        ) : (
          <span className="text-gray-600 italic text-sm">Wallet not connected</span>
        )}
      </div>
    </header>
  );
};

export default Navbar;
