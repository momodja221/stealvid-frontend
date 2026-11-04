# StealVid frontend

React/Vite UI for public videos the user owns or has permission to download. Existing premium styling is preserved.

## Local development

Use Node 24 and start the separate `stealvid-backend` checkout on port 8000 with its Python dependencies, FFmpeg and Node installed.

```sh
npm ci
npm run dev
npm test
VITE_API_URL=https://your-reviewed-api.onrender.com npm run build
```

With no `VITE_API_URL` set, Vite development mode proxies `/api` and `/health` to port 8000. This is a development proxy, not a production reverse proxy. An explicit `VITE_API_URL` overrides it. Production builds default to the existing `https://stealvid-api.onrender.com` URL; set the variable explicitly to the actual reviewed service URL in your hosting build settings. Vite embeds it at build time, so changing it requires rebuilding.

## Render

The frontend `render.yaml` now defines a **static frontend**, not a Python service referencing a missing `backend/` directory. Build: `npm ci && npm run build`; publish directory: `dist`. Supply `VITE_API_URL` when creating the Blueprint service. Configure StealVid.com and www on the correct frontend hosting service and HTTPS certificate there.

The backend has its own Dockerfile and Render blueprint in `momodja221/stealvid-backend`. Set backend `ALLOWED_ORIGINS=https://stealvid.com,https://www.stealvid.com`, adding any actual staging frontend origin. Backend CORS must expose Content-Disposition and Content-Length. No paid API is used. Existing service settings, DNS and deployment are not modified by these repository changes. Auto-deployment is disabled in the supplied blueprint; deploy only after review.

## Download behavior

The analyzed URL is retained for downloading, and input editing is disabled while requests are running. A result says “Video found”, not that downloading has succeeded. Analysis has a 75-second client timeout; download has a 210-second timeout to allow backend processing/cold starts. Backend errors are displayed, including HTML hosting failures and interrupted transfers. The browser creates a download only after checking MP4 content type, nonzero size, advertised Content-Length when available, and the MP4 file header. The backend separately validates streams with FFprobe. CSS and layout remain unchanged.

See [TEST_RESULTS.md](TEST_RESULTS.md). Unit tests verify the request/error/file checks; local backend media tests verify real conversion and transfer. No external platform is claimed functional without a successful authorized download from that platform. Public availability is not a guarantee of downloadable access; private/authentication-required or DRM content is unsupported.
