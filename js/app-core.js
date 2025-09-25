
import { i18n } from './i18n.js';
import { auth, db } from './firebase-init.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { collection, getDocs, query, orderBy } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

document.addEventListener('click',(e)=>{ const t=e.target.closest('.btn,.tile,.tab'); if(t){ t.classList.remove('glow-click'); void t.offsetWidth; t.classList.add('glow-click'); }});

const hdr=document.getElementById('hdrCtrls');
if(hdr){
  const lang=document.createElement('div'); lang.className='lang'; lang.innerHTML=`<button id="langBtn">🌐</button><div class="menu" id="langMenu"><div class="item" data-lang="id"><span>Indonesia</span><span>🇮🇩</span></div><div class="item" data-lang="en"><span>English</span><span>🇬🇧</span></div><div class="item" data-lang="ar"><span>العربية</span><span>🇸🇦</span></div><div class="item" data-lang="ja"><span>日本語</span><span>🇯🇵</span></div><div class="item" data-lang="es"><span>Español</span><span>🇪🇸</span></div><div class="item" data-lang="hi"><span>हिन्दी</span><span>🇮🇳</span></div></div>`; hdr.prepend(lang);
  const btn=lang.querySelector('#langBtn'); const menu=lang.querySelector('#langMenu');
  btn.addEventListener('click', ()=> lang.classList.toggle('open'));
  menu.addEventListener('click', (e)=>{ const it=e.target.closest('.item[data-lang]'); if(!it) return; i18n.setLocale(it.dataset.lang); lang.classList.remove('open'); });
  document.addEventListener('click', (e)=>{ if(!lang.contains(e.target)) lang.classList.remove('open'); });

  const nwrap=document.createElement('div'); nwrap.className='lang'; nwrap.style.marginLeft='8px';
  nwrap.innerHTML=`<button id="notifBtn">🔔<span id="notifDot" style="margin-left:6px;font-size:12px;display:none">●</span></button>
    <div class="menu" id="notifMenu"><div class="item small">Tidak ada notifikasi</div></div>`;
  hdr.prepend(nwrap);
  const nbtn=nwrap.querySelector('#notifBtn'); const nmenu=nwrap.querySelector('#notifMenu'); const ndot=nwrap.querySelector('#notifDot');
  nbtn.addEventListener('click', ()=> nwrap.classList.toggle('open'));
  document.addEventListener('click', (e)=>{ if(!nwrap.contains(e.target)) nwrap.classList.remove('open'); });

  onAuthStateChanged(auth, async (u)=>{
    if(!u) return;
    try{
      const qy = query(collection(db,'users',u.uid,'notifications'), orderBy('createdAt','desc'));
      const snap = await getDocs(qy);
      let html=''; let unread=0;
      snap.forEach(d=>{ const x=d.data(); if(x.read===false) unread++; const t=x.createdAt?.toDate?x.createdAt.toDate().toLocaleString('id-ID'):'-'; html += `<div class="item"><div>${x.title||'Notifikasi'}</div><div class="small">${x.body||''}</div><div class="small">${t}</div></div>`; });
      nmenu.innerHTML = html || `<div class="item small">Tidak ada notifikasi</div>`;
      ndot.style.display = unread>0 ? 'inline-block':'none';
    }catch(e){ /* ignore */ }
  });
}
i18n.init();
