import React, { useState } from 'react';

const API = (import.meta.env.VITE_API_URL || 'https://stealvid-api.onrender.com').replace(/\/$/, '');
const ALLOWED_HOSTS = new Set([
  'tiktok.com', 'www.tiktok.com', 'm.tiktok.com', 'vm.tiktok.com', 'vt.tiktok.com',
  'instagram.com', 'www.instagram.com', 'm.instagram.com',
  'youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be',
  'x.com', 'www.x.com', 'twitter.com', 'www.twitter.com', 'mobile.twitter.com'
]);

function validateUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' && ALLOWED_HOSTS.has(parsed.hostname.toLowerCase()) && !parsed.username && !parsed.password && !parsed.port;
  } catch { return false; }
}

async function apiError(response, fallback) {
  let message = fallback;
  try { const payload = await response.json(); if (typeof payload.detail === 'string') message = payload.detail; } catch { /* Invalid response */ }
  return new Error(message);
}

export default function App() {
  const [url, setUrl] = useState('');
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  async function analyze(e) {
    e.preventDefault();
    if (!validateUrl(url.trim())) {
      setError('Enter a valid HTTPS link from TikTok, Instagram, YouTube or X.');
      return;
    }
    setLoading(true); setError(''); setVideo(null);
    try {
      const response = await fetch(`${API}/api/analyze`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() })
      });
      if (!response.ok) throw await apiError(response, 'Video analysis unavailable.');
      const data = await response.json();
      if (!data || !data.title) throw new Error('The server returned an invalid video response.');
      setVideo(data);
    } catch (err) {
      setError(err instanceof TypeError ? 'Cannot reach the video server. Check the deployment and CORS settings.' : err.message);
    } finally { setLoading(false); }
  }

  async function download() {
    if (!video || downloading) return;
    setDownloading(true); setError('');
    try {
      const response = await fetch(`${API}/api/download`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() })
      });
      if (!response.ok) throw await apiError(response, 'Download unavailable.');
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.startsWith('video/')) throw new Error('The server did not return a video file.');
      const blob = await response.blob();
      if (!blob.size) throw new Error('The downloaded file is empty.');
      const fileUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = fileUrl; link.download = 'stealvid-video.mp4';
      document.body.appendChild(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(fileUrl), 60000);
    } catch (err) { setError(err instanceof TypeError ? 'Cannot reach the video server.' : err.message); }
    finally { setDownloading(false); }
  }

  return (
    <div className="app">
      <header className="header"><a className="logo" href="/">STEAL<span>VID</span></a><span className="header-label">VIDEO DOWNLOADER</span></header>
      <main className="main">
        <div className="eyebrow">THE ULTIMATE VIDEO DOWNLOADER</div>
        <h1>Download Videos.<br /><span>Maximum Quality.</span></h1>
        <p className="subtitle">Download public videos you own or have permission to use from TikTok, Instagram, X and YouTube Shorts.</p>
        <form className="download-form" onSubmit={analyze}>
          <input type="url" placeholder="Paste your video link here..." value={url} onChange={(e) => { setUrl(e.target.value); setVideo(null); setError(''); }} required />
          <button type="submit" disabled={loading || downloading}>{loading ? 'Analyzing...' : 'Get Video'}</button>
        </form>
        <div className="platforms"><span>TikTok</span><span>Instagram</span><span>YouTube Shorts</span><span>X / Twitter</span></div>
        {error && <div className="error" role="alert">{error}</div>}
        {video && <section className="result">
          <h2>Video ready</h2>
          {video.thumbnail && <img src={video.thumbnail} alt="Video preview" className="thumbnail" />}
          <h3>{video.title}</h3>
          <button onClick={download} disabled={downloading}>{downloading ? 'Downloading...' : 'Download MP4'}</button>
        </section>}
      </main>
      <footer>© {new Date().getFullYear()} StealVid. Download content you own or have permission to use.</footer>
    </div>
  );
}
