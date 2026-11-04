# StealVid

React/Vite frontend with a FastAPI + yt-dlp backend for videos the user owns or is authorized to download.

## Frontend
Run `npm install` then `npm run dev` or `npm run build`. Configure `VITE_API_URL` to your deployed backend URL.

## Backend
Deploy via `render.yaml` as a Render blueprint, or from the `backend/` folder with `pip install -r requirements.txt` and `uvicorn main:app --host 0.0.0.0 --port $PORT`.
Set `ALLOWED_ORIGINS` to comma-separated URLs of your actual frontend domains, including any temporary Base44 or hosting preview domain if required.

`GET /health`, `POST /api/analyze` and `POST /api/download` are provided.

## Limits
Public link availability varies by platform, region, bot protection, and their terms. Authentication-protected or DRM content is not supported. The MP4-only path cannot guarantee highest quality if a video requires separate audio/video merging. No external deployment or cross-platform download has been verified. Free hosting can sleep and impose quotas. Do not use this to download content without authorization.

## Important on GitHub
The original repo contained capitalized `Index.html` and `Package.json`. The actual Vite names are lower-case. Delete the old capitalized files when uploading the replacements to avoid confusion.
