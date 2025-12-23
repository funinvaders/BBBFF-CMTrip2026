
import React, { useState } from 'react';
import { AppState, ChecklistItem, MemoEntry } from '../types';

interface ListsPageProps {
  data: AppState;
  updateData: (newData: Partial<AppState>) => void;
}

const ListsPage: React.FC<ListsPageProps> = ({ data, updateData }) => {
  const [activeTab, setActiveTab] = useState<'checklist' | 'memos'>('checklist');
  const [newCheckItem, setNewCheckItem] = useState('');
  const [newMemo, setNewMemo] = useState('');

  const toggleCheck = (id: string) => {
    const updated = data.checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    updateData({ checklist: updated });
  };

  const addCheckItem = () => {
    if (!newCheckItem) return;
    const item: ChecklistItem = {
      id: Date.now().toString(),
      text: newCheckItem,
      completed: false,
      category: 'General'
    };
    updateData({ checklist: [...data.checklist, item] });
    setNewCheckItem('');
  };

  const addMemo = () => {
    if (!newMemo) return;
    const memo: MemoEntry = {
      id: Date.now().toString(),
      content: newMemo,
      timestamp: Date.now()
    };
    updateData({ memos: [memo, ...data.memos] });
    setNewMemo('');
  };

  const deleteMemo = (id: string) => {
    updateData({ memos: data.memos.filter(m => m.id !== id) });
  };

  const renderContentWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" 
             className="inline-flex items-center gap-1.5 px-3 py-1 my-1 bg-gray-100 text-black rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
            Link <i className="fa-solid fa-external-link text-[8px]"></i>
          </a>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl p-1 muji-shadow flex mb-8 border border-gray-100">
        <button 
          onClick={() => setActiveTab('checklist')}
          className={`flex-1 py-3 text-[10px] font-bold tracking-widest rounded-xl transition-all ${activeTab === 'checklist' ? 'muji-bg-black text-white muji-shadow' : 'text-gray-400'}`}
        >
          CHECKLIST
        </button>
        <button 
          onClick={() => setActiveTab('memos')}
          className={`flex-1 py-3 text-[10px] font-bold tracking-widest rounded-xl transition-all ${activeTab === 'memos' ? 'muji-bg-black text-white muji-shadow' : 'text-gray-400'}`}
        >
          MEMOS
        </button>
      </div>

      {activeTab === 'checklist' ? (
        <div className="space-y-6">
          <div className="flex gap-2">
            <input 
              placeholder="Add item..."
              value={newCheckItem}
              onChange={e => setNewCheckItem(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCheckItem()}
              className="flex-1 p-4 bg-white rounded-2xl border border-gray-100 text-sm muji-shadow"
            />
            <button onClick={addCheckItem} className="w-14 h-14 muji-bg-black text-white rounded-2xl flex items-center justify-center muji-shadow">
              <i className="fa-solid fa-plus"></i>
            </button>
          </div>
          <div className="space-y-2">
            {data.checklist.map(item => (
              <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-2xl muji-shadow border border-gray-50">
                <button onClick={() => toggleCheck(item.id)} className={`w-6 h-6 rounded-lg border-2 transition-colors flex items-center justify-center ${item.completed ? 'muji-bg-black border-transparent' : 'border-gray-100 bg-white'}`}>
                  {item.completed && <i className="fa-solid fa-check text-white text-[10px]"></i>}
                </button>
                <span className={`text-sm font-light ${item.completed ? 'text-gray-300 line-through' : 'text-gray-700'}`}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl muji-shadow border border-gray-100">
            <textarea 
              placeholder="Quick note or link..."
              value={newMemo}
              onChange={e => setNewMemo(e.target.value)}
              className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm h-32 resize-none mb-3 font-light leading-relaxed"
            ></textarea>
            <button onClick={addMemo} className="w-full py-4 muji-bg-black text-white rounded-2xl font-bold tracking-widest text-xs uppercase muji-shadow">Save Note</button>
          </div>
          <div className="space-y-4">
            {data.memos.map(memo => (
              <div key={memo.id} className="bg-white p-6 rounded-3xl muji-shadow border border-gray-50 group relative">
                <button onClick={() => deleteMemo(memo.id)} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-gray-200 hover:text-black p-2"><i className="fa-solid fa-trash text-xs"></i></button>
                <div className="text-sm font-light text-gray-700 leading-relaxed break-words whitespace-pre-wrap">{renderContentWithLinks(memo.content)}</div>
                <div className="mt-4 pt-4 border-t border-gray-50 text-[9px] text-gray-300 font-bold uppercase tracking-widest">{new Date(memo.timestamp).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListsPage;
