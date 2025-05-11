import React from "react";

const Navbar = ({ account, onLogout }) => {
  const shortAddress = (addr) => addr?.slice(0, 6) + "..." + addr?.slice(-4);

  return (
    <header className="bg-white shadow-md px-6 py-4 flex items-center justify-between rounded-b-2xl border-b border-gray-200">
      {/* Left - Logo and Title */}
      <div className="flex items-center space-x-3">
        <div>
          <img
            src="/gym-auction-logo.png"
            alt="Gym Auction Logo"
            className="w-14 h-14 object-contain"
          />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">
          NFT Auction Hub
        </h1>
      </div>

      {/* Right - Account Info */}
      <div className="flex items-center space-x-4">
        {account ? (
          <>
            <div className="hidden md:flex flex-col items-end text-right">
              <span className="text-sm text-gray-800 font-semibold">Connected</span>
              <span className="text-xs text-gray-500 font-mono">{shortAddress(account)}</span>
            </div>

            <div className="relative flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {account.slice(2, 4).toUpperCase()}
              </div>

              <button
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-full shadow transition"
              >
                Disconnect
              </button>
            </div>
          </>
        ) : (
          <span className="text-gray-500 italic text-sm">Wallet not connected</span>
        )}
      </div>
    </header>
  );
};

export default Navbar;
