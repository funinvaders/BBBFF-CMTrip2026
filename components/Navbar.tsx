
import React from 'react';
import { Page } from '../types';

interface NavbarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { page: Page.PLAN, label: 'PLAN', icon: 'fa-calendar' },
    { page: Page.GUIDE, label: 'GUIDE', icon: 'fa-book' },
    { page: Page.WALLET, label: 'WALLET', icon: 'fa-coins' },
    { page: Page.LISTS, label: 'LISTS', icon: 'fa-check-double' },
    { page: Page.INFO, label: 'INFO', icon: 'fa-circle-question' },
  ];

  return (
    <nav className="flex justify-between items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
      {navItems.map((item) => (
        <button
          key={item.page}
          onClick={() => setCurrentPage(item.page)}
          className={`relative flex-1 flex flex-col items-center gap-1 py-2 px-1 transition-all duration-300 rounded-lg ${
            currentPage === item.page ? 'bg-white text-black muji-shadow' : 'text-gray-400'
          }`}
        >
          <i className={`fa-solid ${item.icon} text-sm`}></i>
          <span className="text-[9px] font-bold tracking-tighter">{item.label}</span>
          {currentPage === item.page && (
            <div className="absolute -bottom-1 w-1 h-1 rounded-full muji-bg-black"></div>
          )}
        </button>
      ))}
    </nav>
  );
};

export default Navbar;
