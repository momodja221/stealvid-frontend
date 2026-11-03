
import React, { useState } from "react";

const API = "https://stealvid-api.onrender.com";

export default function App() {
  const [url, setUrl] = useState("");
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  async function analyze(e) {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError("");
    setVideo(null);

    try {
      const response = await fetch(`${API}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() })
      });

      if (!response.ok) throw new Error("Analyse impossible");

      const data = await response.json();
      setVideo(data);
    } catch {
      setError("Impossible d'analyser cette vidéo.");
    } finally {
      setLoading(false);
    }
  }

  async function download() {
    setDownloading(true);
    setError("");

    try {
      const response = await fetch(`${API}/api/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() })
      });

      if (!response.ok) throw new Error("Téléchargement impossible");

      const blob = await response.blob();
      const fileUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = fileUrl;
      link.download = "stealvid-video.mp4";
      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => URL.revokeObjectURL(fileUrl), 60000);
    } catch {
      setError("Le téléchargement a échoué.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <a className="logo" href="/">STEAL<span>VID</span></a>
        <span className="header-label">VIDEO DOWNLOADER</span>
      </header>

      <main className="main">
        <div className="eyebrow">THE ULTIMATE VIDEO DOWNLOADER</div>

        <h1>
          Download Videos.
          <br />
          <span>Maximum Quality.</span>
        </h1>

        <p className="subtitle">
          Download public videos from TikTok, Instagram, X and
          YouTube Shorts in high quality.
        </p>

        <form className="download-form" onSubmit={analyze}>
          <input
            type="url"
            placeholder="Paste your video link here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Analyzing..." : "Get Video"}
          </button>
        </form>

        <div className="platforms">
          <span>TikTok</span>
          <span>Instagram</span>
          <span>YouTube Shorts</span>
          <span>X / Twitter</span>
        </div>

        {error && <div className="error">{error}</div>}

        {video && (
          <section className="result">
            <h2>Video ready</h2>
            {video.thumbnail && (
              <img
                src={video.thumbnail}
                alt="Video preview"
                className="thumbnail"
              />
            )}
            <h3>{video.title || "Your video"}</h3>
            <button onClick={download} disabled={downloading}>
              {downloading ? "Downloading..." : "Download MP4"}
            </button>
          </section>
        )}
      </main>

      <footer>
        © {new Date().getFullYear()} StealVid.
        Download content you own or have permission to use.
      </footer>
    </div>
  );
}
