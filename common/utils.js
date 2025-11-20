export const $=s=>document.querySelector(s);
export const $$=s=>document.querySelectorAll(s);
export async function api(url,opt={}){const r=await fetch(url,opt);return await r.json();}
