export const platforms = [
  {id:'tiktok',name:'TikTok',symbol:'♪',path:'/tiktok-downloader',hosts:['tiktok.com','www.tiktok.com','m.tiktok.com','vm.tiktok.com','vt.tiktok.com']},
  {id:'instagram',name:'Instagram Reels',symbol:'◎',path:'/instagram-reels-downloader',hosts:['instagram.com','www.instagram.com','m.instagram.com']},
  {id:'x',name:'X / Twitter',symbol:'𝕏',path:'/x-video-downloader',hosts:['x.com','www.x.com','mobile.x.com','twitter.com','www.twitter.com','mobile.twitter.com']},
];
export function platformForUrl(value){try{const u=new URL(value);if(u.protocol!=='https:'||u.username||u.password||u.port)return null;return platforms.find(p=>p.hosts.includes(u.hostname.toLowerCase()))??null;}catch{return null}}
export function stripeSupportUrl(value){try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&!u.port&&['buy.stripe.com','checkout.stripe.com'].includes(u.hostname)?u.href:null;}catch{return null}}
export function safeMediaUrl(value){try{const u=new URL(value);return u.protocol==='https:'?u.href:null;}catch{return null}}
