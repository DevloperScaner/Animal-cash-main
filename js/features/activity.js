
import { auth, db } from '../firebase-init.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { collection, getDocs, query, orderBy } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
onAuthStateChanged(auth, async (u)=>{
  if(!u){ location.href='index.html'; return; }
  const q = query(collection(db,'users',u.uid,'activities'), orderBy('createdAt','desc'));
  const snap = await getDocs(q);
  const el=document.getElementById('timeline');
  let html=''; snap.forEach(d=>{ const x=d.data(); const t=x.createdAt?.toDate?x.createdAt.toDate().toLocaleString('id-ID'):'-'; html+=`<div>• ${t} — ${x.message||x.type}</div>`; });
  el.innerHTML = html || 'Belum ada aktivitas.';
});
