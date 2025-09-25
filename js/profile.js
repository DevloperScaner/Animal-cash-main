
import { auth, db } from './firebase-init.js';
import { signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { collection, query, where, getDocs, orderBy } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

const nf = new Intl.NumberFormat('id-ID');
document.getElementById('logoutBtn').onclick = ()=> signOut(auth).then(()=>location.href='index.html');
function rowBonus(x){ const t=x.createdAt?.toDate?x.createdAt.toDate().toLocaleString('id-ID'):'-'; return `<tr><td>${t}</td><td>${x.type||'referral'}</td><td>Rp ${nf.format(x.amount||0)}</td></tr>`; }
function rowWd(x){ const t=x.createdAt?.toDate?x.createdAt.toDate().toLocaleString('id-ID'):'-'; return `<tr><td>${t}</td><td>${x.method||'-'} - ${x.provider||'-'}</td><td>Rp ${nf.format(x.amount||0)}</td><td>${x.status||'-'}</td></tr>`; }

async function loadHistory(uid, which){
  const box = document.getElementById('history'); box.innerHTML = 'Memuat…';
  if(which==='bonus'){
    const qy = query(collection(db,'bonuses'), where('uid','==',uid), orderBy('createdAt','desc'));
    const snap = await getDocs(qy); let html = '<table class="wide"><thead><tr><th>Tanggal</th><th>Jenis</th><th>Jumlah</th></tr></thead><tbody>';
    snap.forEach(d=> html += rowBonus(d.data()));
    html += '</tbody></table>'; box.innerHTML = html;
  }else{
    const qy = query(collection(db,'withdrawals'), where('uid','==',uid), orderBy('createdAt','desc'));
    const snap = await getDocs(qy); let html = '<table class="wide"><thead><tr><th>Tanggal</th><th>Metode</th><th>Jumlah</th><th>Status</th></tr></thead><tbody>';
    snap.forEach(d=> html += rowWd(d.data()));
    html += '</tbody></table>'; box.innerHTML = html;
  }
}

onAuthStateChanged(auth, (u)=>{
  if(!u){ location.href='index.html'; return; }
  document.getElementById('pName').textContent = u.displayName || '(tanpa nama)';
  document.getElementById('pEmail').textContent = u.email || '-';
  document.getElementById('pUid').textContent = u.uid;
  document.getElementById('pRole').textContent = 'user';
  loadHistory(u.uid, 'bonus');
  document.getElementById('tabBonus').onclick = ()=> loadHistory(u.uid,'bonus');
  document.getElementById('tabWd').onclick = ()=> loadHistory(u.uid,'wd');
});
