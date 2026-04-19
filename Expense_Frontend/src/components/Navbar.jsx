import React, { useContext, useState } from "react";
import { Menu, Search, Bell } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ toggleSidebar, searchQuery, setSearchQuery }) => {
  const { user } = useContext(AuthContext);
  const [showNotifications, setShowNotifications] = useState(false);

  const getGreeting = () => {
    // Current IST time
    const istTime = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });
    const currentHour = new Date(istTime).getHours();

    if (currentHour < 12) return "Good Morning ☀️";
    if (currentHour < 17) return "Good Afternoon 🌤️";
    return "Good Evening 🌙";
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glassmorphism rounded-2xl p-4 flex justify-between items-center mb-8 border border-white/10 relative z-50"
    >
      <div className="flex items-center gap-4">
        {toggleSidebar && (
          <button
            onClick={toggleSidebar}
            className="p-2 bg-white/5 hover:bg-neonAmber/20 hover:text-neonAmber rounded-xl transition-all"
          >
            <Menu size={20} />
          </button>
        )}
        <div className="hidden md:block">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neonAmber to-neonOrange">
            {getGreeting()}, {user?.name.split(" ")[0]} !
          </h2>
          <p className="text-sm text-gray-400">
            Here's what's happening with your finances today.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 relative">
        <div className="hidden md:flex items-center bg-black/40 border border-white/10 rounded-xl px-3 py-2 w-64 focus-within:border-neonAmber transition-colors">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="bg-transparent text-sm w-full outline-none text-white placeholder-gray-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 bg-white/5 hover:bg-neonAmber/20 hover:text-neonAmber rounded-xl transition-all"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-64 glassmorphism border border-white/10 rounded-xl p-4 shadow-xl z-50"
              >
                <h3 className="font-bold text-sm mb-3 text-neonAmber border-b border-white/10 pb-2">
                  Notifications
                </h3>
                <div className="flex flex-col gap-3">
                  <div className="text-sm">
                    <p className="font-semibold">Welcome to Expenzo!</p>
                    <p className="text-xs text-gray-400">
                      Your smart unified dashboard is ready.
                    </p>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-green-400">
                      Profile synced
                    </p>
                    <p className="text-xs text-gray-400">
                      Your data has been successfully backed up.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-neonOrange to-neonAmber flex items-center justify-center font-bold shadow-[0_0_15px_rgba(245,158,11,0.4)] cursor-pointer hover:scale-105 transition-transform">
          {user?.name.charAt(0).toUpperCase()}
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;
