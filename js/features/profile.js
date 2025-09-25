
import { auth, db } from '../firebase-init.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { collection, getDocs, query, where, orderBy } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

onAuthStateChanged(auth, async (u)=>{
  if(!u){ location.href='index.html'; return; }
  document.getElementById('pName').textContent = u.displayName || '-';
  document.getElementById('pEmail').textContent= u.email || '-';
  document.getElementById('pUid').textContent  = u.uid;
  document.getElementById('pRole').innerHTML   = `<span class="badge">user</span>`;

  const bonusBtn=document.getElementById('tabBonus'); const wdBtn=document.getElementById('tabWd'); const history=document.getElementById('history');

  async function loadBonus(){
    const snap = await getDocs(query(collection(db,'users',u.uid,'bonuses'), orderBy('createdAt','desc')));
    let html = '<table><thead><tr><th>Tanggal</th><th>Dari</th><th>Nominal</th><th>Status</th></tr></thead><tbody>';
    snap.forEach(d=>{ const x=d.data(); const t=x.createdAt?.toDate?x.createdAt.toDate().toLocaleString('id-ID'):'-'; html+=`<tr><td>${t}</td><td>${x.fromName||x.fromUid||'-'}</td><td>Rp ${new Intl.NumberFormat('id-ID').format(x.amount||0)}</td><td>${x.status||'-'}</td></tr>`; });
    html+='</tbody></table>'; history.innerHTML=html;
  }
  async function loadWd(){
    const snap = await getDocs(query(collection(db,'withdrawals'), where('uid','==',u.uid), orderBy('createdAt','desc')));
    let html = '<table><thead><tr><th>Tanggal</th><th>Metode</th><th>Provider</th><th>Jumlah</th><th>Status</th></tr></thead><tbody>';
    snap.forEach(d=>{ const x=d.data(); const t=x.createdAt?.toDate?x.createdAt.toDate().toLocaleString('id-ID'):'-'; html+=`<tr><td>${t}</td><td>${x.method}</td><td>${x.provider}</td><td>Rp ${new Intl.NumberFormat('id-ID').format(x.amount||0)}</td><td>${x.status||'-'}</td></tr>`; });
    html+='</tbody></table>'; history.innerHTML=html;
  }

  bonusBtn?.addEventListener('click', loadBonus);
  wdBtn?.addEventListener('click', loadWd);
  loadBonus();
});
