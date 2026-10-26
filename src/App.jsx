import React, { useState } from 'react';
import { useIPTVEngine } from './hooks/useIPTVEngine';
import Sidebar from './sidebar';
import PlayerArea from './components/PlayerArea';
import EpgTimeline from './components/EpgTimeline';

export default function App() {
  const DEFAULT_M3U = "https://tinyurl.com";
  const DEFAULT_XML = "https://githubusercontent.com";

  const { channels, epgData, categories, loading, error } = useIPTVEngine(DEFAULT_M3U, DEFAULT_XML);
  const [activeChannel, setActiveChannel] = useState(null);

  const getLiveProgram = (tvgId) => {
    if (!tvgId || !epgData[tvgId]) return null;
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const nowStr = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

    return epgData[tvgId].find(p => {
      return nowStr >= p.start.split(' ')[0] && nowStr <= p.stop.split(' ')[0];
    });
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-950 text-gray-100 select-none">
      <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center px-6 justify-between shrink-0">
        <div class="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
          <span className="font-black text-sm tracking-widest text-white">MIRTISPOR PRO IPTV</span>
        </div>
        {loading && <span className="text-xs text-blue-400 font-bold animate-pulse">Veritabanı Senkronize Ediliyor...</span>}
      </header>

      <div className="flex flex-1 overflow-hidden w-full h-full">
        <Sidebar channels={channels} categories={categories} onSelectChannel={setActiveChannel} activeChannel={activeChannel} getLiveProgram={getLiveProgram} />
        <PlayerArea activeChannel={activeChannel} currentProgram={activeChannel ? getLiveProgram(activeChannel.tvgId) : null} />
        <EpgTimeline activeChannel={activeChannel} epgData={epgData} />
      </div>
    </div>
  );
}
