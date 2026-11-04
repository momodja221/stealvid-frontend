import React, { useState } from 'react';
import { requestVideo, validateUrl } from './api.js';

const API = (import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? '' : 'https://stealvid-api.onrender.com')).replace(/\/$/, '');
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
      const sourceUrl = url.trim();
      const data = await requestVideo(API, 'analyze', sourceUrl);
      setVideo({ ...data, sourceUrl });
    } catch (err) {
      setError(err instanceof TypeError ? 'Cannot reach the video server. Check the deployment and CORS settings.' : err.message);
    } finally { setLoading(false); }
  }

  async function download() {
    if (!video || downloading) return;
    setDownloading(true); setError('');
    try {
      const blob = await requestVideo(API, 'download', video.sourceUrl);
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
          <input disabled={loading || downloading} type="url" placeholder="Paste your video link here..." value={url} onChange={(e) => { setUrl(e.target.value); setVideo(null); setError(''); }} required />
          <button type="submit" disabled={loading || downloading}>{loading ? 'Analyzing...' : 'Get Video'}</button>
        </form>
        <div className="platforms"><span>TikTok</span><span>Instagram</span><span>YouTube Shorts</span><span>X / Twitter</span></div>
        {error && <div className="error" role="alert">{error}</div>}
        {video && <section className="result">
          <h2>Video found</h2>
          {video.thumbnail && <img src={video.thumbnail} alt="Video preview" className="thumbnail" />}
          <h3>{video.title}</h3>
          <button onClick={download} disabled={downloading}>{downloading ? 'Downloading...' : 'Download MP4'}</button>
        </section>}
      </main>
      <footer>© {new Date().getFullYear()} StealVid. Download content you own or have permission to use.</footer>
    </div>
  );
}
