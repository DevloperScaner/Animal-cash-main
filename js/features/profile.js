import { auth, db } from '../firebase-init.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { collection, getDocs, query, orderBy } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
import { adminAllowlist } from '../config.js';
const f = new Intl.NumberFormat('id-ID');
const $ = (id)=>document.getElementById(id);
function isAdmin(u){ 
  return !!u && ((adminAllowlist.uids||[]).includes(u.uid) || ((adminAllowlist.emails||[]).map(x=>x.toLowerCase()).includes((u.email||'').toLowerCase())));
}
async function loadHistory(uid, type){
  const root = $('history'); root.innerHTML = 'Memuat…';
  if(type==='wd'){
    const snap = await getDocs(query(collection(db,'withdrawals'), orderBy('createdAt','desc')));
    let html = `<div class="table"><table><thead><tr><th>Tanggal</th><th>Metode</th><th>Provider</th><th>Jumlah</th><th>Status</th></tr></thead><tbody>`;
    let any = false;
    snap.forEach(d=>{ const x=d.data(); if(x.uid!==uid) return; any=true;
      const t = x.createdAt?.toDate ? x.createdAt.toDate().toLocaleString('id-ID') : '-';
      html += `<tr><td>${t}</td><td>${x.method||'-'}</td><td>${x.provider||'-'}</td><td>Rp ${f.format(x.amount||0)}</td><td>${x.status||'-'}</td></tr>`;
    });
    html += `</tbody></table></div>`;
    root.innerHTML = any ? html : `<div class="small">Belum ada penarikan.</div>`;
  } else {
    const snap = await getDocs(query(collection(db,'users',uid,'bonuses'), orderBy('createdAt','desc')));
    let html = `<div class="table"><table><thead><tr><th>Tanggal</th><th>Jenis</th><th>Jumlah</th><th>Status</th></tr></thead><tbody>`;
    let any = false;
    snap.forEach(d=>{ const x=d.data(); any=true;
      const t = x.createdAt?.toDate ? x.createdAt.toDate().toLocaleString('id-ID') : '-';
      html += `<tr><td>${t}</td><td>${x.type||'referral'}</td><td>Rp ${f.format(x.amount||0)}</td><td>${x.status||'-'}</td></tr>`;
    });
    html += `</tbody></table></div>`;
    root.innerHTML = any ? html : `<div class="small">Belum ada bonus.</div>`;
  }
}
onAuthStateChanged(auth, async (u)=>{
  if(!u){ location.href='index.html'; return; }
  $('pName').textContent = u.displayName || (u.email ? u.email.split('@')[0] : 'User');
  $('pEmail').textContent = u.email || '-';
  $('pUid').textContent = u.uid;
  $('pRole').innerHTML = `<span class="badge">${isAdmin(u) ? 'admin' : 'user'}</span>`;
  loadHistory(u.uid, 'bonus');
  $('tabBonus')?.addEventListener('click', ()=>loadHistory(u.uid,'bonus'));
  $('tabWd')?.addEventListener('click', ()=>loadHistory(u.uid,'wd'));
});
