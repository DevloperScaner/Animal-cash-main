
import { auth, db } from '../firebase-init.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { collection, getDocs, query, where, orderBy, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

onAuthStateChanged(auth, async (u)=>{
  if(!u){ location.href='index.html'; return; }
  const tbody = document.querySelector('#refTable tbody');
  const q = query(collection(db,'referrals'), where('referrerUid','==',u.uid), orderBy('createdAt','desc'));
  const snap = await getDocs(q);
  tbody.innerHTML='';
  for (const d of snap.docs){
    const x=d.data(); let name='-', email='-';
    if(x.referredUid){ const us=await getDoc(doc(db,'users',x.referredUid)); if(us.exists()){ name=us.data().displayName||'-'; email=us.data().email||'-'; } }
    const t=x.createdAt?.toDate?x.createdAt.toDate().toLocaleString('id-ID'):'-';
    const tr=document.createElement('tr'); tr.innerHTML=`<td>${name}</td><td>${email}</td><td>${t}</td><td>${x.bonusStatus||'pending'}</td>`; tbody.appendChild(tr);
  }
  document.getElementById('refStats').textContent = `Total: ${snap.size}`;
});
