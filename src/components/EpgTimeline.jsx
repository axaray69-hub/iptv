import React from 'react';
import { Calendar } from 'lucide-react';

export default function EpgTimeline({ activeChannel, epgData }) {
  const list = activeChannel ? epgData[activeChannel.tvgId] || [] : [];

  const formatTime = (str) => {
    if(!str) return "";
    return `${str.substring(8, 10)}:${str.substring(10, 12)}`;
  };

  return (
    <div className="w-80 bg-gray-900 flex flex-col h-full shrink-0 border-l border-gray-800">
      <div className="p-3 border-b border-gray-800 bg-gray-900/80 flex items-center space-x-2 shrink-0">
        <Calendar size={14} className="text-blue-500" />
        <span className="text-[10px] font-black tracking-wider text-gray-300">YAYIN AKIŞI (TIMELINE)</span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {list.length === 0 ? (
          <div className="text-center text-xs text-gray-500 py-12">Yayın akışı verisi bulunamadı.</div>
        ) : (
          list.map((prog, idx) => (
            <div key={idx} className="p-2.5 rounded bg-gray-950 border border-gray-800 flex flex-col space-y-1">
              <span className="font-mono text-[10px] font-bold text-blue-400 bg-blue-500/5 px-1.5 py-0.5 rounded border border-blue-500/10 w-max">
                {formatTime(prog.start)} - {formatTime(prog.stop)}
              </span>
              <span className="text-xs font-bold text-gray-200 leading-tight">{prog.title}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
