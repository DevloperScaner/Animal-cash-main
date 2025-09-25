
import { db } from '../firebase-init.js';
import { collection, getDocs, query, orderBy, updateDoc, doc, serverTimestamp, addDoc } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
const DEFAULT_BONUS = 5000;
export async function renderAdminReferrals(rootId='root'){
  const root = document.getElementById(rootId);
  root.innerHTML = `<h3>Referrals</h3><div class="table big"><table class="wide"><thead><tr><th>Tanggal</th><th>Referrer</th><th>Referral</th><th>Status</th><th>Aksi</th></tr></thead><tbody id="rows"></tbody></table></div>`;
  const rows = document.getElementById('rows');
  try{
    const snap = await getDocs(query(collection(db,'referrals'), orderBy('createdAt','desc')));
    let any=false; snap.forEach(d=>{ const x=d.data(); any=true;
      const t = x.createdAt?.toDate ? x.createdAt.toDate().toLocaleString('id-ID') : '-';
      rows.insertAdjacentHTML('beforeend', `<tr><td>${t}</td><td>${x.referrerEmail||x.referrerUid}</td><td>${x.userEmail||x.userUid}</td><td>${x.status||'pending'}</td><td>${(x.status||'pending')==='pending'?`<button class="btn small green" data-id="${d.id}" data-uid="${x.referrerUid||''}">Approve</button>`:'-'}</td></tr>`);
    });
    if(!any) rows.innerHTML = `<tr><td colspan="5">Belum ada data.</td></tr>`;
    rows.addEventListener('click', async (e)=>{
      const b = e.target.closest('button[data-id]'); if(!b) return;
      const uid=b.dataset.uid;
      await addDoc(collection(db,'bonuses'), { uid, type:'referral', amount: DEFAULT_BONUS, status:'approved', createdAt: serverTimestamp() });
      await updateDoc(doc(db,'referrals', b.dataset.id), { status:'approved', updatedAt: serverTimestamp() });
      location.reload();
    });
  }catch(err){ rows.innerHTML = `<tr><td colspan="5">Gagal: ${err?.message||err}</td></tr>`; }
}
renderAdminReferrals();
