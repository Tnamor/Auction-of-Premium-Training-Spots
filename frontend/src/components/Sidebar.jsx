import React from "react";
import { Home, Image, Gavel, User } from "lucide-react";
import { cn } from "../utils/cn";

const navItems = [
  { icon: <Home size={20} />, label: "Home" },
  { icon: <Image size={20} />, label: "My NFTs" },
  { icon: <Gavel size={20} />, label: "Auctions" },
  { icon: <User size={20} />, label: "Profile" },
];

const Sidebar = () => {
  return (
    <aside className="bg-white h-screen w-20 flex flex-col items-center py-4 shadow-md">
      <div className="text-pink-500 font-bold text-3xl mb-6">🦾</div>
      <nav className="flex flex-col gap-6">
        {navItems.map((item, idx) => (
          <button
            key={idx}
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-xl hover:bg-pink-100 text-gray-700"
            )}
            title={item.label}
          >
            {item.icon}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
