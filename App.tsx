import React, { useState, useEffect, useCallback } from 'react';
import { Page, AppState } from './types';
import { STORAGE_KEY, INITIAL_DATA } from './constants';
import Navbar from './components/Navbar';
import PlanPage from './pages/PlanPage';
import GuidePage from './pages/GuidePage';
import WalletPage from './pages/WalletPage';
import ListsPage from './pages/ListsPage';
import InfoPage from './pages/InfoPage';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.PLAN);
  const [data, setData] = useState<AppState>(INITIAL_DATA);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setData({ ...INITIAL_DATA, ...parsed });
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, isLoaded]);

  const updateData = useCallback((newData: Partial<AppState>) => {
    setData(prev => ({ ...prev, ...newData }));
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case Page.PLAN: return <PlanPage data={data} updateData={updateData} />;
      case Page.GUIDE: return <GuidePage data={data} updateData={updateData} />;
      case Page.WALLET: return <WalletPage data={data} updateData={updateData} />;
      case Page.LISTS: return <ListsPage data={data} updateData={updateData} />;
      case Page.INFO: return <InfoPage data={data} updateData={updateData} />;
      default: return <PlanPage data={data} updateData={updateData} />;
    }
  };

  if (!isLoaded) return <div className="flex items-center justify-center h-screen text-gray-400 font-light italic">Loading Trip...</div>;

  return (
    <div className="flex flex-col min-h-screen max-w-2xl mx-auto bg-[#f7f7f2] shadow-xl">
      <header className="sticky top-0 z-40 bg-white px-6 py-4 border-b border-gray-100 muji-shadow">
        <div className="flex justify-center items-center mb-4">
          <h1 className="text-lg font-bold tracking-[0.2em] text-black flex items-center gap-3">
            <i className="fa-solid fa-plane text-black"></i>
            黑黑黑肥肥 Chiang Mai Trip 2026
          </h1>
        </div>
        <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </header>

      <main className="flex-1 overflow-x-hidden pt-4 pb-12">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;