import React, { useState } from 'react';
import { Search, Grid, Radio } from 'lucide-react';

export default function Sidebar({ channels, categories, onSelectChannel, activeChannel, getLiveProgram }) {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  const filtered = channels.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'all' || c.group === selectedGroup;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col h-full shrink-0">
      <div className="p-4 border-b border-gray-800 space-y-3 bg-gray-900/50">
        <div className="relative">
          <input type="text" placeholder="Kanal ara..." value={search} onChange={(e) => setSearch(e.target.value)}
                 className="w-full bg-gray-950 border border-gray-800 text-xs rounded p-2 pl-8 text-gray-200 focus:outline-none focus:border-blue-500" />
          <Search size={14} className="absolute left-2.5 top-3 text-gray-500" />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-black text-gray-400 tracking-wider">KATEGORİLER</label>
          <select value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 text-xs text-gray-300 rounded p-1.5 focus:outline-none">
            <option value="all">Tüm Gruplar</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto divide-y divide-gray-800/40">
        {filtered.map((channel, index) => {
          const live = getLiveProgram(channel.tvgId);
          const isActive = activeChannel?.url === channel.url;
          return (
            <button key={index} onClick={() => onSelectChannel(channel)}
                    className={`w-full flex items-center space-x-3 p-3 text-left transition-all ${isActive ? 'bg-blue-600/20 border-l-4 border-blue-500 text-white' : 'hover:bg-gray-800/40 text-gray-300'}`}>
              {channel.logo ? (
                <img src={channel.logo} alt="" className="w-8 h-8 object-contain rounded bg-black p-0.5 border border-gray-800" onError={(e)=>{e.target.src='https://placehold.co'}} />
              ) : (
                <div className="w-8 h-8 bg-gray-950 rounded border border-gray-800 flex items-center justify-center"><Radio size={12} className="text-gray-500" /></div>
              )}
              <div className="truncate flex-1">
                <span className="font-bold text-xs block truncate">{channel.name}</span>
                <span className="text-[10px] text-gray-400 block truncate mt-0.5">{live ? live.title : 'Yayın akışı yok'}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
