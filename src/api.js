export const ALLOWED_HOSTS = new Set([
  'tiktok.com', 'www.tiktok.com', 'm.tiktok.com', 'vm.tiktok.com', 'vt.tiktok.com',
  'instagram.com', 'www.instagram.com', 'm.instagram.com',
  'youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be',
  'x.com', 'www.x.com', 'twitter.com', 'www.twitter.com', 'mobile.twitter.com'
]);

export function validateUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' && ALLOWED_HOSTS.has(parsed.hostname.toLowerCase()) &&
      !parsed.username && !parsed.password && !parsed.port && parsed.pathname !== '/';
  } catch { return false; }
}

async function apiError(response) {
  const fallback = response.status === 503 ? 'The video server is busy or starting. Please try again shortly.' :
    response.status === 504 ? 'The video platform took too long to respond. Please try again later.' :
    `The video server could not complete the request (HTTP ${response.status}).`;
  try {
    const payload = await response.json();
    if (typeof payload.detail === 'string') return new Error(payload.detail);
    if (response.status === 422) return new Error('The video link was rejected by the server. Check the URL.');
  } catch { /* Render can return an HTML error while waking up or restarting. */ }
  return new Error(fallback);
}

export async function requestVideo(api, action, url, { fetchImpl = fetch, timeoutMs = action === 'download' ? 210000 : 75000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(`${api}/api/${action}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }), signal: controller.signal
    });
    if (!response.ok) throw await apiError(response);
    if (action === 'analyze') {
      const data = await response.json();
      if (!data || typeof data.title !== 'string' || !data.title || !data.available_formats?.length) {
        throw new Error('The server did not return a downloadable video.');
      }
      return data;
    }
    if (!(response.headers.get('content-type') || '').toLowerCase().startsWith('video/mp4')) {
      throw new Error('The server did not return an MP4 video. Nothing was saved.');
    }
    const blob = await response.blob();
    if (!blob.size) throw new Error('The downloaded video is empty. Nothing was saved.');
    const length = response.headers.get('content-length');
    if (length && Number(length) !== blob.size) throw new Error('The video transfer was incomplete. Please retry.');
    const header = new Uint8Array(await blob.slice(0, 12).arrayBuffer());
    if (String.fromCharCode(...header.slice(4, 8)) !== 'ftyp') {
      throw new Error('The server returned an invalid MP4 file. Nothing was saved.');
    }
    return blob;
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('The request timed out. The server may be starting or the platform is slow. Please retry.');
    if (error instanceof TypeError) throw new Error('Cannot reach the video server or the transfer was interrupted. Please retry; check the API URL and CORS settings if this persists.');
    throw error;
  } finally { clearTimeout(timer); }
}
