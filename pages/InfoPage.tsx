
import React, { useState } from 'react';
import { AppState, FlightInfo, AccommodationInfo } from '../types';

interface InfoPageProps {
  data: AppState;
  updateData: (newData: Partial<AppState>) => void;
}

const InfoPage: React.FC<InfoPageProps> = ({ data, updateData }) => {
  const [editingFlightId, setEditingFlightId] = useState<string | null>(null);
  const [editingAccommodationId, setEditingAccommodationId] = useState<string | null>(null);

  const handleUpdateFlight = (id: string, updates: Partial<FlightInfo>) => {
    const updatedFlights = data.flights.map(f => f.id === id ? { ...f, ...updates } : f);
    updateData({ flights: updatedFlights });
  };

  const handleUpdateAccommodation = (id: string, updates: Partial<AccommodationInfo>) => {
    const updatedAcc = data.accommodations.map(a => a.id === id ? { ...a, ...updates } : a);
    updateData({ accommodations: updatedAcc });
  };

  const exportTrip = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `Chiang_Mai_Trip_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importTrip = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        if (confirm('Importing this trip will overwrite your current plan. Continue?')) {
          updateData(importedData);
          alert('Trip imported successfully!');
        }
      } catch (err) {
        alert('Invalid trip file format.');
      }
    };
    reader.readAsText(file);
  };

  const weatherForecast = [
    { day: 'MON', icon: 'fa-sun', temp: '32°', cond: 'Sunny' },
    { day: 'TUE', icon: 'fa-sun', temp: '33°', cond: 'Sunny' },
    { day: 'WED', icon: 'fa-cloud-sun', temp: '31°', cond: 'Clear' },
    { day: 'THU', icon: 'fa-cloud-sun', temp: '30°', cond: 'Partly' },
    { day: 'FRI', icon: 'fa-cloud', temp: '29°', cond: 'Cloudy' },
    { day: 'SAT', icon: 'fa-sun', temp: '31°', cond: 'Sunny' },
    { day: 'SUN', icon: 'fa-sun', temp: '32°', cond: 'Sunny' },
  ];

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="p-6 space-y-10">
      <section className="space-y-4">
        <h3 className="text-gray-400 text-[10px] font-bold tracking-widest uppercase ml-1">Weather Forecast</h3>
        <div className="bg-white p-6 rounded-3xl muji-shadow border border-gray-50">
          <div className="flex justify-between items-center mb-6 px-2">
            <div>
              <p className="text-2xl font-medium text-black">32°C</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Chiang Mai, Thailand</p>
            </div>
            <i className="fa-solid fa-sun text-4xl text-black"></i>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {weatherForecast.map((w, i) => (
              <div key={i} className="flex flex-col items-center gap-2 py-2 rounded-xl hover:bg-gray-50 transition-colors">
                <span className="text-[8px] font-bold text-gray-300">{w.day}</span>
                <i className={`fa-solid ${w.icon} text-xs text-black`}></i>
                <span className="text-[10px] font-medium text-gray-700">{w.temp}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-gray-400 text-[10px] font-bold tracking-widest uppercase ml-1">Flights</h3>
        {data.flights.map(flight => (
          <div key={flight.id} className="bg-white rounded-3xl muji-shadow overflow-hidden border border-gray-50 relative">
            <div className="muji-bg-black px-6 py-2 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-white text-[9px] font-bold tracking-[0.2em]">{flight.type}</span>
                <span className="text-white/50 text-[9px] font-medium tracking-widest">{formatDate(flight.date)}</span>
              </div>
              <button 
                onClick={() => setEditingFlightId(editingFlightId === flight.id ? null : flight.id)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <i className={`fa-solid ${editingFlightId === flight.id ? 'fa-check' : 'fa-pen-to-square'} text-xs`}></i>
              </button>
            </div>
            
            {editingFlightId === flight.id ? (
              <div className="p-6 space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    placeholder="Airline"
                    className="p-2 bg-gray-50 rounded-lg text-xs"
                    value={flight.airline}
                    onChange={e => handleUpdateFlight(flight.id, { airline: e.target.value })}
                  />
                  <input 
                    placeholder="Code"
                    className="p-2 bg-gray-50 rounded-lg text-xs font-bold"
                    value={flight.code}
                    onChange={e => handleUpdateFlight(flight.id, { code: e.target.value })}
                  />
                </div>
                <div className="w-full">
                  <p className="text-[9px] font-bold text-gray-300 uppercase mb-1">Travel Date</p>
                  <input 
                    type="date"
                    className="w-full p-2 bg-gray-50 rounded-lg text-xs"
                    value={flight.date}
                    onChange={e => handleUpdateFlight(flight.id, { date: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <div className="space-y-2">
                     <p className="text-[9px] font-bold text-gray-300 uppercase">Departure</p>
                     <input 
                        placeholder="From"
                        className="w-full p-2 bg-gray-50 rounded-lg text-xs"
                        value={flight.from}
                        onChange={e => handleUpdateFlight(flight.id, { from: e.target.value })}
                      />
                      <input 
                        type="time"
                        className="w-full p-2 bg-gray-50 rounded-lg text-xs"
                        value={flight.departureTime}
                        onChange={e => handleUpdateFlight(flight.id, { departureTime: e.target.value })}
                      />
                   </div>
                   <div className="space-y-2">
                     <p className="text-[9px] font-bold text-gray-300 uppercase">Arrival</p>
                      <input 
                        placeholder="To"
                        className="w-full p-2 bg-gray-50 rounded-lg text-xs"
                        value={flight.to}
                        onChange={e => handleUpdateFlight(flight.id, { to: e.target.value })}
                      />
                      <input 
                        type="time"
                        className="w-full p-2 bg-gray-50 rounded-lg text-xs"
                        value={flight.arrivalTime}
                        onChange={e => handleUpdateFlight(flight.id, { arrivalTime: e.target.value })}
                      />
                   </div>
                </div>
              </div>
            ) : (
              <div className="p-6 flex justify-between items-center">
                <div className="text-center">
                  <p className="text-2xl font-medium text-black">{flight.from}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-widest">{flight.departureTime}</p>
                </div>
                <div className="flex-1 flex flex-col items-center px-4">
                  <span className="text-[10px] text-black font-bold mb-1 tracking-widest">{flight.code}</span>
                  <div className="w-full flex items-center opacity-20">
                     <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                     <div className="flex-1 h-px border-t border-dashed border-black mx-1"></div>
                     <i className="fa-solid fa-plane text-[10px]"></i>
                     <div className="flex-1 h-px border-t border-dashed border-black mx-1"></div>
                     <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                  </div>
                  <p className="text-[9px] text-gray-300 font-medium mt-1 uppercase">{flight.airline}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-medium text-black">{flight.to}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-widest">{flight.arrivalTime}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h3 className="text-gray-400 text-[10px] font-bold tracking-widest uppercase ml-1">Accommodation</h3>
        {data.accommodations.map(hotel => (
          <div key={hotel.id} className="bg-white rounded-3xl muji-shadow overflow-hidden border border-gray-50">
            <div className="muji-bg-black px-6 py-2 flex justify-between items-center">
              <span className="text-white text-[9px] font-bold tracking-[0.2em]">STAY INFO</span>
              <button 
                onClick={() => setEditingAccommodationId(editingAccommodationId === hotel.id ? null : hotel.id)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <i className={`fa-solid ${editingAccommodationId === hotel.id ? 'fa-check' : 'fa-pen-to-square'} text-xs`}></i>
              </button>
            </div>
            
            {editingAccommodationId === hotel.id ? (
              <div className="p-6 space-y-4 animate-in fade-in duration-200">
                <div className="space-y-2">
                  <p className="text-[9px] font-bold text-gray-300 uppercase">Hotel Name</p>
                  <input 
                    placeholder="Hotel Name"
                    className="w-full p-2 bg-gray-50 rounded-lg text-xs"
                    value={hotel.name}
                    onChange={e => handleUpdateAccommodation(hotel.id, { name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] font-bold text-gray-300 uppercase">Address</p>
                  <textarea 
                    placeholder="Full Address"
                    className="w-full p-2 bg-gray-50 rounded-lg text-xs h-20 resize-none"
                    value={hotel.address}
                    onChange={e => handleUpdateAccommodation(hotel.id, { address: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <div className="space-y-1">
                     <p className="text-[9px] font-bold text-gray-300 uppercase">Check In</p>
                     <input 
                        type="date"
                        className="w-full p-2 bg-gray-50 rounded-lg text-xs"
                        value={hotel.checkIn}
                        onChange={e => handleUpdateAccommodation(hotel.id, { checkIn: e.target.value })}
                      />
                   </div>
                   <div className="space-y-1">
                     <p className="text-[9px] font-bold text-gray-300 uppercase">Check Out</p>
                     <input 
                        type="date"
                        className="w-full p-2 bg-gray-50 rounded-lg text-xs"
                        value={hotel.checkOut}
                        onChange={e => handleUpdateAccommodation(hotel.id, { checkOut: e.target.value })}
                      />
                   </div>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <h4 className="text-lg font-medium text-black mb-2">{hotel.name}</h4>
                <p className="text-sm text-gray-400 font-light leading-relaxed mb-6">{hotel.address}</p>
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-50">
                  <div>
                    <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest mb-1">Check In</p>
                    <p className="text-xs font-medium text-gray-700 tracking-wider">{hotel.checkIn}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest mb-1">Check Out</p>
                    <p className="text-xs font-medium text-gray-700 tracking-wider">{hotel.checkOut}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h3 className="text-gray-400 text-[10px] font-bold tracking-widest uppercase ml-1">Share Trip</h3>
        <div className="bg-white p-8 rounded-3xl muji-shadow border border-gray-100 space-y-6">
          <p className="text-xs text-gray-400 font-light leading-relaxed">
            Collaborate with friends by exporting your trip data. They can import it on their devices to see your updates.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={exportTrip}
              className="flex-1 py-3 bg-gray-50 text-black border border-gray-100 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all muji-shadow"
            >
              <i className="fa-solid fa-file-export mr-2"></i> Export
            </button>
            <label className="flex-1 py-3 bg-gray-50 text-black border border-gray-100 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all muji-shadow text-center cursor-pointer">
              <i className="fa-solid fa-file-import mr-2"></i> Import
              <input type="file" accept=".json" onChange={importTrip} className="hidden" />
            </label>
          </div>
        </div>
      </section>

      <section className="space-y-4 pb-10">
        <h3 className="text-gray-400 text-[10px] font-bold tracking-widest uppercase ml-1">Travel Info</h3>
        <div className="bg-white p-8 rounded-3xl muji-shadow border border-gray-100 space-y-8">
          <div className="flex gap-6">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-black flex-shrink-0"><i className="fa-solid fa-phone"></i></div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-black mb-1">Emergency Numbers</p>
              <p className="text-sm text-gray-400 font-light">Tourist Police: 1155</p>
              <p className="text-sm text-gray-400 font-light">Ambulance: 1669</p>
            </div>
          </div>
          <div className="pt-6 border-t border-gray-50">
             <h5 className="text-[10px] font-bold text-black tracking-widest uppercase mb-4">Local Etiquette</h5>
             <ul className="text-sm font-light text-gray-400 space-y-4">
               <li className="flex gap-3"><i className="fa-solid fa-check text-[10px] mt-1 text-black"></i> Remove shoes before entering temples or homes.</li>
               <li className="flex gap-3"><i className="fa-solid fa-check text-[10px] mt-1 text-black"></i> Dress modestly for temples (no shorts/tank tops).</li>
               <li className="flex gap-3"><i className="fa-solid fa-check text-[10px] mt-1 text-black"></i> Do not touch anyone on the head.</li>
               <li className="flex gap-3"><i className="fa-solid fa-check text-[10px] mt-1 text-black"></i> Respect the Royal Family at all times.</li>
             </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InfoPage;
