import {mkdir,readFile,writeFile} from 'node:fs/promises';
const html=await readFile('dist/index.html','utf8');
const pages=['fonctionnement','plateformes','faq','soutenir','contact','confidentialite','conditions','droits-auteur','tiktok-downloader','instagram-reels-downloader','x-video-downloader'];
for(const page of pages){await mkdir('dist/'+page,{recursive:true});await writeFile('dist/'+page+'/index.html',html)}
await writeFile('dist/404.html',html);
