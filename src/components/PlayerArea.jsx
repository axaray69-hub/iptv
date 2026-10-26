import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Tv, AlertTriangle, Play } from 'lucide-react';

export default function PlayerArea({ activeChannel, currentProgram }) {
  const videoRef = useRef(null);
  const [hasError, setVideoError] = useState(false);

  useEffect(() => {
    if (!activeChannel) return;
    setVideoError(false);
    const video = videoRef.current;
    let hls;

    if (Hls.isSupported()) {
      hls = new Hls({ maxBufferLength: 10, enableWorker: true });
      hls.loadSource(activeChannel.url);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) setVideoError(true);
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = activeChannel.url;
      video.addEventListener('error', () => setVideoError(true));
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [activeChannel]);

  if (!activeChannel) {
    return (
      <div className="flex-1 bg-gray-950 flex flex-col items-center justify-center text-gray-500">
        <Tv size={48} className="mb-4 stroke-[1.5] text-blue-500/50" />
        <p className="text-sm font-medium">Lütfen akışı başlatmak için bir kanal seçin.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-black flex flex-col relative h-full">
      <div className="flex-1 relative flex items-center justify-center">
        <video ref={videoRef} className="w-full h-full object-contain" controls autoPlay />
        {hasError && (
          <div className="absolute inset-0 bg-gray-950/95 flex flex-col items-center justify-center p-6 text-center z-10">
            <AlertTriangle className="text-red-500 mb-2" size={40} />
            <h3 className="text-sm font-bold text-white">Yayın Oynatılamıyor</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-xs">CORS engeli veya adresi değişen yayın formatı.</p>
          </div>
        )}
      </div>
      <div className="bg-gray-900/90 border-t border-gray-800 p-4 shrink-0 backdrop-blur">
        <span className="text-[10px] text-blue-400 font-extrabold tracking-widest block mb-1">CANLI AKIŞ</span>
        <h2 className="text-md font-black text-white truncate">{currentProgram?.title || activeChannel.name}</h2>
      </div>
    </div>
  );
}
