
import { auth, db } from '../firebase-init.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { collection, getDocs, query, where, orderBy } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
onAuthStateChanged(auth, async (u)=>{
  if(!u){ location.href='index.html'; return; }
  document.getElementById('pName').textContent = u.displayName || '-';
  document.getElementById('pEmail').textContent= u.email || '-';
  document.getElementById('pUid').textContent  = u.uid;
  document.getElementById('pRole').innerHTML   = `<span class="badge">user</span>`;

  const holdsWrap = document.createElement('section'); holdsWrap.className='card'; holdsWrap.innerHTML='<h3>Holdings Aktif</h3><div id="holds"></div>';
  document.querySelector('.content').prepend(holdsWrap);
  await loadHoldings(u);

  async function loadBonus(){
    const snap = await getDocs(query(collection(db,'users',u.uid,'bonuses'), orderBy('createdAt','desc')));
    let html = '<table><thead><tr><th>Tanggal</th><th>Dari</th><th>Nominal</th><th>Status</th></tr></thead><tbody>';
    snap.forEach(d=>{ const x=d.data(); const t=x.createdAt?.toDate?x.createdAt.toDate().toLocaleString('id-ID'):'-'; html+=`<tr><td>${t}</td><td>${x.fromName||x.fromUid||'-'}</td><td>Rp ${new Intl.NumberFormat('id-ID').format(x.amount||0)}</td><td>${x.status||'-'}</td></tr>`; });
    html+='</tbody></table>'; document.getElementById('history').innerHTML=html;
  }
  async function loadWd(){
    const snap = await getDocs(query(collection(db,'withdrawals'), where('uid','==',u.uid), orderBy('createdAt','desc')));
    let html = '<table><thead><tr><th>Tanggal</th><th>Metode</th><th>Provider</th><th>Jumlah</th><th>Status</th></tr></thead><tbody>';
    snap.forEach(d=>{ const x=d.data(); const t=x.createdAt?.toDate?x.createdAt.toDate().toLocaleString('id-ID'):'-'; html+=`<tr><td>${t}</td><td>${x.method}</td><td>${x.provider}</td><td>Rp ${new Intl.NumberFormat('id-ID').format(x.amount||0)}</td><td>${x.status||'-'}</td></tr>`; });
    html+='</tbody></table>'; document.getElementById('history').innerHTML=html;
  }
  document.getElementById('tabBonus')?.addEventListener('click', loadBonus);
  document.getElementById('tabWd')?.addEventListener('click', loadWd);
  loadBonus();
});
import { getDocs, collection } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
async function loadHoldings(u){
  const c = document.getElementById('holds');
  const snap = await getDocs(collection(db,'users',u.uid,'holdings'));
  const f = new Intl.NumberFormat('id-ID');
  if (snap.empty){ c.innerHTML = '<div class="small">Belum ada holdings aktif.</div>'; return; }
  c.innerHTML='';
  snap.forEach(d=>{
    const x=d.data(); const end=new Date(x.endAt); const now=new Date();
    const leftMs = Math.max(0, end - now); const leftDays = Math.ceil(leftMs/86400000);
    const totalMs = Math.max(1, new Date(x.endAt) - new Date(x.startAt)); const donePct = Math.min(100, Math.round((1 - (leftMs/totalMs))*100));
    const el=document.createElement('div'); el.className='card'; el.innerHTML = `
      <div style='display:flex;justify-content:space-between'><b>${x.productName}</b><span class='small'>Rp ${f.format(x.price||0)}</span></div>
      <div class='small'>Sisa ${leftDays} hari</div>
      <div style='height:8px;border-radius:999px;background:#ffffff15;margin-top:6px'><div style='width:${donePct}%;height:100%;background:#59d1ff;border-radius:999px'></div></div>`;
    c.appendChild(el);
  });
}
