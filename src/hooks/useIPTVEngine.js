import { useState, useEffect, useCallback } from 'react';

export function useIPTVEngine(defaultM3u, defaultEpg) {
  const [channels, setChannels] = useState([]);
  const [epgData, setEpgData] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const PROXY = "https://corsproxy.io?";

  const parseEPG = useCallback((xmlText) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    const programmes = xmlDoc.getElementsByTagName('programme');
    const parsedEpg = {};

    for (let i = 0; i < programmes.length; i++) {
      const prog = programmes[i];
      const channelId = prog.getAttribute('channel');
      const start = prog.getAttribute('start');
      const stop = prog.getAttribute('stop');
      const title = prog.getElementsByTagName('title')[0]?.textContent || 'İsimsiz Program';

      if (!parsedEpg[channelId]) parsedEpg[channelId] = [];
      parsedEpg[channelId].push({ start, stop, title });
    }
    setEpgData(parsedEpg);
  }, []);

  const parseM3U = useCallback((m3uText) => {
    const lines = m3uText.split('\n');
    const parsedChannels = [];
    const parsedCategories = new Set();
    let currentMeta = null;

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('#EXTINF:')) {
        const tvgId = trimmed.match(/tvg-id="([^"]+)"/)?.[1] || "";
        const logo = trimmed.match(/tvg-logo="([^"]+)"/)?.[1] || "";
        const group = trimmed.match(/group-title="([^"]+)"/)?.[1] || "Genel";
        const name = trimmed.split(',').pop() || "Bilinmeyen Kanal";

        currentMeta = { tvgId, logo, group, name };
        if (group) parsedCategories.add(group);
      } else if (trimmed && !trimmed.startsWith('#') && currentMeta) {
        currentMeta.url = trimmed;
        parsedChannels.push(currentMeta);
        currentMeta = null;
      }
    });

    setChannels(parsedChannels);
    setCategories(Array.from(parsedCategories).sort());
  }, []);

  const loadData = useCallback(async (m3uUrl, epgUrl) => {
    setLoading(true);
    setError(null);
    try {
      if (epgUrl) {
        const epgRes = await fetch(PROXY + encodeURIComponent(epgUrl));
        if (epgRes.ok) parseEPG(await epgRes.text());
      }
      const m3uRes = await fetch(PROXY + encodeURIComponent(m3uUrl));
      if (!m3uRes.ok) throw new Error("M3U yükleme hatası.");
      parseM3U(await m3uRes.text());
    } catch (err) {
      setError("Veriler yüklenirken CORS veya ağ hatası oluştu.");
    } finally {
      setLoading(false);
    }
  }, [parseEPG, parseM3U]);

  useEffect(() => {
    loadData(defaultM3u, defaultEpg);
  }, [defaultM3u, defaultEpg, loadData]);

  return { channels, epgData, categories, loading, error, reload: loadData };
}
