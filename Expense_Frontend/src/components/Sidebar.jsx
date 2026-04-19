import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Wallet, CreditCard, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import { motion } from 'framer-motion';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout } = useContext(AuthContext);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Expenses', path: '/expenses', icon: CreditCard },
    { name: 'Incomes', path: '/incomes', icon: Wallet },
  ];

  return (
    <motion.div 
      initial={false}
      animate={{ width: isOpen ? 256 : 80 }}
      className="h-screen fixed left-0 top-0 glassmorphism z-50 flex flex-col pt-6 border-r border-white/5 honeycomb-pattern overflow-hidden shadow-[4px_0_24px_rgba(0,0,0,0.5)] transition-all duration-300"
    >
      <div className={`px-5 mb-8 flex items-center ${isOpen ? 'justify-between' : 'justify-center'}`}>
        {isOpen && (
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neonAmber to-neonOrange whitespace-nowrap">
            Expenzo
          </h1>
        )}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-1 rounded-lg bg-white/5 hover:bg-neonAmber/20 hover:text-neonAmber transition-colors"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      
      <nav className="flex flex-col gap-3 px-3 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 py-3 rounded-xl transition-all duration-300 group hover:scale-[1.02] ${
                  isActive
                    ? 'bg-gradient-to-r from-neonAmber/20 to-transparent border-l-4 border-neonAmber text-white shadow-[inset_0px_0px_20px_rgba(245,158,11,0.1)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
                } ${isOpen ? 'px-4' : 'px-0 justify-center'}`
              }
            >
              <Icon size={20} className="drop-shadow-md group-hover:text-neonAmber transition-colors" />
              {isOpen && <span className="font-medium tracking-wide whitespace-nowrap">{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 mb-4">
        <button
          onClick={logout}
          className={`w-full flex items-center gap-2 py-3 rounded-xl text-red-400 hover:text-white hover:bg-red-500/20 transition-all duration-300 group hover:scale-[1.02] ${isOpen ? 'px-4 justify-start' : 'px-0 justify-center'}`}
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          {isOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
