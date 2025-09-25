import { db } from '../firebase-init.js';
import { collection, getDocs, query, orderBy, updateDoc, doc, serverTimestamp, addDoc } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
export const DEFAULT_BONUS = 5000;
export async function renderAdminReferrals(){
  const root = document.getElementById('adminView');
  root.innerHTML = `<section class="card"><h3>Referrals</h3><div id="refTable" class="table"></div></section>`;
  const tbl = document.getElementById('refTable');
  try{
    const snap = await getDocs(query(collection(db,'referrals'), orderBy('createdAt','desc')));
    let html = `<table><thead><tr><th>Tanggal</th><th>Referrer</th><th>Referral</th><th>Status</th><th>Aksi</th></tr></thead><tbody>`;
    let any=false;
    snap.forEach(d=>{ const x=d.data(); any=true;
      const t = x.createdAt?.toDate ? x.createdAt.toDate().toLocaleString('id-ID') : '-';
      html += `<tr><td>${t}</td><td>${x.referrerEmail||x.referrerUid}</td><td>${x.userEmail||x.userUid}</td><td>${x.status||'pending'}</td><td>${(x.status||'pending')==='pending'?`<button class="btn small green" data-id="${d.id}" data-ref="${x.referrerUid||''}">Approve</button>`:'-'}</td></tr>`;
    });
    html += `</tbody></table>`; tbl.innerHTML = any? html:`<div class="small">Belum ada data.</div>`;
    tbl.addEventListener('click', async (e)=>{
      const b = e.target.closest('button[data-id]'); if(!b) return;
      const id = b.dataset.id; const refUid = b.dataset.ref;
      await addDoc(collection(db,'users',refUid,'bonuses'), { type:'referral', amount: DEFAULT_BONUS, status:'approved', createdAt: serverTimestamp() });
      await updateDoc(doc(db,'referrals', id), { status:'approved', updatedAt: serverTimestamp() });
      renderAdminReferrals();
    });
  }catch(err){ tbl.innerHTML = `<div class="small">Gagal memuat referrals: ${err?.message||err}</div>`; }
}
window.renderAdminReferrals = renderAdminReferrals;
