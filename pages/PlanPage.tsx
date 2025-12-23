
import React, { useState } from 'react';
import { AppState, DayPlan, ItineraryItem } from '../types';

interface PlanPageProps {
  data: AppState;
  updateData: (newData: Partial<AppState>) => void;
}

const PlanPage: React.FC<PlanPageProps> = ({ data, updateData }) => {
  const [selectedDayId, setSelectedDayId] = useState<string>(data.itinerary[0]?.id || '');
  const [isAdding, setIsAdding] = useState(false);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<Partial<ItineraryItem>>({
    time: '', title: '', description: '', isImportant: false
  });

  const selectedDay = data.itinerary.find(d => d.id === selectedDayId);

  const addItem = () => {
    if (!newItem.title || !selectedDayId) return;
    const updatedItinerary = data.itinerary.map(day => {
      if (day.id === selectedDayId) {
        return {
          ...day,
          items: [...day.items, { ...newItem, id: Date.now().toString() } as ItineraryItem].sort((a, b) => a.time.localeCompare(b.time))
        };
      }
      return day;
    });
    updateData({ itinerary: updatedItinerary });
    setNewItem({ time: '', title: '', description: '', isImportant: false });
    setIsAdding(false);
  };

  const deleteItem = (dayId: string, itemId: string) => {
    const updatedItinerary = data.itinerary.map(day => {
      if (day.id === dayId) {
        return { ...day, items: day.items.filter(i => i.id !== itemId) };
      }
      return day;
    });
    updateData({ itinerary: updatedItinerary });
  };

  // Drag and Drop Handlers
  const onDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItemId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggedItemId === null || draggedItemId === id) return;

    const updatedItinerary = data.itinerary.map(day => {
      if (day.id === selectedDayId) {
        const items = [...day.items];
        const draggedIdx = items.findIndex(i => i.id === draggedItemId);
        const targetIdx = items.findIndex(i => i.id === id);
        
        if (draggedIdx !== -1 && targetIdx !== -1) {
          const [draggedItem] = items.splice(draggedIdx, 1);
          items.splice(targetIdx, 0, draggedItem);
          return { ...day, items };
        }
      }
      return day;
    });

    updateData({ itinerary: updatedItinerary });
  };

  const onDragEnd = () => {
    setDraggedItemId(null);
  };

  return (
    <div className="p-6">
      <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
        {data.itinerary.map((day) => (
          <button
            key={day.id}
            onClick={() => setSelectedDayId(day.id)}
            className={`flex-shrink-0 w-16 h-16 rounded-2xl flex flex-col items-center justify-center border transition-all ${
              selectedDayId === day.id
                ? 'muji-bg-black text-white border-transparent muji-shadow'
                : 'bg-white text-gray-400 border-gray-100'
            }`}
          >
            <span className="text-[10px] font-bold opacity-70">DAY</span>
            <span className="text-xl font-medium tracking-tighter">{day.dayNumber}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-6 relative">
        <div className="absolute left-3 top-2 bottom-2 w-px bg-gray-200"></div>
        
        {selectedDay?.items.length === 0 && (
          <div className="text-center py-10 text-gray-300 font-light italic">Empty day. Add some plans.</div>
        )}

        {selectedDay?.items.map((item) => (
          <div 
            key={item.id} 
            className={`relative pl-10 transition-all duration-200 ${draggedItemId === item.id ? 'opacity-30 scale-95' : 'opacity-100'}`}
            draggable
            onDragStart={(e) => onDragStart(e, item.id)}
            onDragOver={(e) => onDragOver(e, item.id)}
            onDragEnd={onDragEnd}
          >
            <div className={`absolute left-1.5 top-1.5 w-3 h-3 rounded-full border-2 border-white muji-shadow ${item.isImportant ? 'muji-bg-black' : 'bg-gray-300'}`}></div>
            
            <div className={`bg-white p-5 rounded-2xl muji-shadow border-l-4 group ${item.isImportant ? 'muji-border-black' : 'border-gray-100'}`}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                   <div className="cursor-grab text-gray-200 group-hover:text-gray-400 transition-colors">
                     <i className="fa-solid fa-grip-vertical text-xs"></i>
                   </div>
                   <span className="text-[10px] font-bold text-gray-400 tracking-widest">{item.time}</span>
                </div>
                <button 
                  onClick={() => deleteItem(selectedDayId, item.id)}
                  className="text-gray-200 hover:text-black transition-colors"
                >
                  <i className="fa-solid fa-xmark text-sm"></i>
                </button>
              </div>
              
              <h3 className={`text-base font-medium mb-1 ${item.isImportant ? 'text-black' : 'text-gray-700'}`}>
                {item.title}
              </h3>
              
              {item.description && <p className="text-sm text-gray-400 font-light leading-relaxed mb-4">{item.description}</p>}
              
              <div className="flex flex-wrap gap-2">
                {item.mapUrl && (
                  <a href={item.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 text-[10px] font-bold uppercase rounded-lg hover:bg-gray-100 transition-colors">
                    <i className="fa-solid fa-map-pin text-black"></i> Map
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        {!isAdding ? (
          <button 
            onClick={() => setIsAdding(true)}
            className="w-full py-4 border border-dashed border-gray-200 rounded-2xl text-gray-400 hover:text-black transition-all flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-plus text-xs"></i> New Entry
          </button>
        ) : (
          <div className="bg-white p-6 rounded-3xl muji-shadow border border-gray-100 space-y-4">
            <input 
              type="time" 
              className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-1 focus:ring-gray-200 text-sm"
              value={newItem.time}
              onChange={e => setNewItem({...newItem, time: e.target.value})}
            />
            <input 
              placeholder="Destination / Activity" 
              className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-1 focus:ring-gray-200 text-sm"
              value={newItem.title}
              onChange={e => setNewItem({...newItem, title: e.target.value})}
            />
            <textarea 
              placeholder="Notes..." 
              className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-1 focus:ring-gray-200 text-sm h-24 resize-none"
              value={newItem.description}
              onChange={e => setNewItem({...newItem, description: e.target.value})}
            ></textarea>
            <label className="flex items-center gap-3 px-1">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded text-black focus:ring-black" 
                checked={newItem.isImportant}
                onChange={e => setNewItem({...newItem, isImportant: e.target.checked})}
              />
              <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Important</span>
            </label>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setIsAdding(false)} className="flex-1 py-3 bg-gray-100 text-gray-500 rounded-xl font-bold text-xs uppercase tracking-widest">Cancel</button>
              <button onClick={addItem} className="flex-2 w-full py-3 muji-bg-black text-white rounded-xl font-bold text-xs uppercase tracking-widest muji-shadow">Save</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanPage;
