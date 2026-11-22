import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './style.css';
const measurementId = (import.meta.env.VITE_GA_MEASUREMENT_ID ?? '').trim();

if (import.meta.env.PROD && /^G-[A-Z0-9]+$/.test(measurementId)) {
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }

  gtag('js', new Date());
  gtag('set', {
    page_location: window.location.origin + window.location.pathname,
    page_referrer: document.referrer ? new URL(document.referrer).origin : '',
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  gtag('config', measurementId);
  document.head.appendChild(script);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
);
