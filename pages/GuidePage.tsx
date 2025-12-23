
import React, { useState } from 'react';
import { AppState, GuideArticle, GuideCategory } from '../types';

interface GuidePageProps {
  data: AppState;
  updateData: (newData: Partial<AppState>) => void;
}

const CATEGORIES: GuideCategory[] = ['Food', 'Relax', 'Temple', 'Shopping', 'Sightseeing', 'General'];

const GuidePage: React.FC<GuidePageProps> = ({ data, updateData }) => {
  const [activeGuideId, setActiveGuideId] = useState<string>(data.guides[0]?.id || '');
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState<Partial<GuideArticle>>({
    title: '', content: '', imageUrl: '', category: 'General', tags: []
  });

  const activeGuide = data.guides.find(g => g.id === activeGuideId);

  const startAdding = () => {
    setFormState({ title: '', content: '', imageUrl: '', category: 'General', tags: [] });
    setIsAdding(true);
    setIsEditing(false);
  };

  const startEditing = () => {
    if (!activeGuide) return;
    setFormState({ ...activeGuide });
    setIsEditing(true);
    setIsAdding(false);
  };

  const handleSave = () => {
    if (!formState.title || !formState.content) return;
    
    if (isEditing && activeGuideId) {
      const updated = data.guides.map(g => g.id === activeGuideId ? { ...g, ...formState } as GuideArticle : g);
      updateData({ guides: updated });
    } else {
      const guide: GuideArticle = {
        id: Date.now().toString(),
        title: formState.title!,
        content: formState.content!,
        imageUrl: formState.imageUrl,
        category: formState.category || 'General',
        tags: ['Chiang Mai'],
        coordinates: { lat: 18.7883, lng: 98.9853 }
      };
      updateData({ guides: [...data.guides, guide] });
      setActiveGuideId(guide.id);
    }
    setIsAdding(false);
    setIsEditing(false);
  };

  const deleteGuide = (id: string) => {
    if (confirm('Delete this guide?')) {
      const updated = data.guides.filter(g => g.id !== id);
      updateData({ guides: updated });
      if (updated.length > 0) setActiveGuideId(updated[0].id);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-2 flex gap-3 overflow-x-auto hide-scrollbar border-b border-gray-100 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        {data.guides.map((guide) => (
          <button
            key={guide.id}
            onClick={() => {
              setActiveGuideId(guide.id);
              setIsAdding(false);
              setIsEditing(false);
            }}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all ${
              !isAdding && !isEditing && activeGuideId === guide.id 
                ? 'muji-bg-black text-white muji-shadow' 
                : 'text-gray-400 bg-white border border-gray-100'
            }`}
          >
            {guide.title}
          </button>
        ))}
        <button 
          onClick={startAdding} 
          className={`flex-shrink-0 w-8 h-8 rounded-full transition-all flex items-center justify-center ${
            isAdding 
              ? 'muji-bg-black text-white' 
              : 'text-gray-300 border border-dashed border-gray-300 hover:text-black hover:border-black'
          }`}
        >
          <i className="fa-solid fa-plus text-xs"></i>
        </button>
      </div>

      <div className="flex-1">
        {(isAdding || isEditing) ? (
          <div className="p-8 space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-end">
              <h2 className="text-xl font-medium text-black tracking-tight">
                {isEditing ? 'Edit Attraction' : 'New Attraction'}
              </h2>
              {isEditing && (
                <button onClick={() => deleteGuide(activeGuideId)} className="text-[10px] font-bold text-gray-300 hover:text-black uppercase tracking-widest">
                  Delete
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              <input 
                placeholder="Attraction Name"
                className="w-full p-4 bg-white rounded-2xl border border-gray-100 text-sm muji-shadow"
                value={formState.title}
                onChange={e => setFormState({...formState, title: e.target.value})}
              />
              
              <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFormState({...formState, category: cat})}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[9px] font-bold tracking-widest uppercase border transition-all ${
                      formState.category === cat ? 'muji-bg-black text-white border-transparent' : 'text-gray-400 border-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <input 
                  placeholder="Photo URL (e.g. https://...)"
                  className="w-full p-4 bg-white rounded-2xl border border-gray-100 text-sm muji-shadow"
                  value={formState.imageUrl}
                  onChange={e => setFormState({...formState, imageUrl: e.target.value})}
                />
                {formState.imageUrl && (
                  <div className="w-full h-32 rounded-xl overflow-hidden border border-gray-100">
                    <img src={formState.imageUrl} className="w-full h-full object-cover grayscale" alt="Preview" />
                  </div>
                )}
              </div>
              
              <textarea 
                placeholder="Details, history, or tips..."
                className="w-full p-4 bg-white rounded-2xl border border-gray-100 text-sm h-48 resize-none muji-shadow font-light"
                value={formState.content}
                onChange={e => setFormState({...formState, content: e.target.value})}
              />
            </div>

            <div className="flex gap-4">
               <button onClick={() => {setIsAdding(false); setIsEditing(false);}} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold text-xs uppercase tracking-widest">Cancel</button>
               <button onClick={handleSave} className="flex-2 w-full py-4 muji-bg-black text-white rounded-2xl font-bold text-xs uppercase tracking-widest muji-shadow">Save</button>
            </div>
          </div>
        ) : activeGuide ? (
          <article className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {activeGuide.imageUrl && (
              <div className="w-full h-72 overflow-hidden relative bg-gray-100">
                <img 
                  src={activeGuide.imageUrl} 
                  alt={activeGuide.title} 
                  className="w-full h-full object-cover grayscale transition-all duration-1000"
                  onLoad={(e) => (e.currentTarget.style.opacity = '1')}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent"></div>
              </div>
            )}
            
            <div className="p-8 -mt-16 relative z-10">
              <header className="mb-8">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-black bg-gray-100 px-3 py-1 rounded">
                      {activeGuide.category}
                    </span>
                  </div>
                  <button 
                    onClick={startEditing}
                    className="text-gray-300 hover:text-black transition-colors p-1"
                  >
                    <i className="fa-solid fa-pen-to-square text-sm"></i>
                  </button>
                </div>
                <h2 className="text-3xl font-medium text-black leading-tight tracking-tight mb-4">{activeGuide.title}</h2>
                <div className="w-10 h-0.5 bg-black"></div>
              </header>

              <div className="prose prose-sm text-gray-500 font-light leading-loose space-y-6">
                {activeGuide.content.split('\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {activeGuide.coordinates && (
                <div className="mt-12">
                  <h4 className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase mb-4">Location Reference</h4>
                  <div className="w-full h-48 rounded-2xl overflow-hidden grayscale border border-gray-100 bg-gray-50">
                    <iframe 
                      width="100%" height="100%" frameBorder="0" scrolling="no" 
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${activeGuide.coordinates.lng - 0.005}%2C${activeGuide.coordinates.lat - 0.005}%2C${activeGuide.coordinates.lng + 0.005}%2C${activeGuide.coordinates.lat + 0.005}&layer=mapnik&marker=${activeGuide.coordinates.lat}%2C${activeGuide.coordinates.lng}`}
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
          </article>
        ) : (
          <div className="text-center py-20 text-gray-300 font-light italic">Choose a guide to view or click + to add one.</div>
        )}
      </div>
    </div>
  );
};

export default GuidePage;
