
export const $ = (q)=>document.querySelector(q);
export const $$ = (q)=>[...document.querySelectorAll(q)];
export function toast(msg){ const t = $('#toast'); if(!t) return; t.textContent = msg; t.style.display='block'; setTimeout(()=> t.style.display='none', 2000); }
