import React, { useState, useEffect, useContext } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = () => {
  const { user, loading } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  useEffect(() => {
    setSearchQuery("");
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-darkBg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neonAmber"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-darkBg text-gray-100 flex relative overflow-hidden honeycomb-pattern">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className={`flex-1 transition-all duration-300 relative z-10 w-full min-h-screen flex flex-col p-6 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
            className="w-full flex-1 mt-2"
          >
            <Outlet context={{ searchQuery }} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Decorative blurred blobs for aesthetics */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-neonAmber/10 blur-[120px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-neonBlue/10 blur-[120px] pointer-events-none -z-10"></div>
    </div>
  );
};

export default Layout;
