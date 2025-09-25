
import { db } from '../firebase-init.js';
import { collection, getDocs, query, orderBy, updateDoc, doc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
const nf = new Intl.NumberFormat('id-ID');
export async function renderAdminWithdrawals(rootId='root'){
  const root = document.getElementById(rootId);
  root.innerHTML = `<h3>Withdrawals</h3><div class="table big"><table class="wide"><thead><tr><th>Tanggal</th><th>User</th><th>Metode</th><th>Provider</th><th>Jumlah</th><th>Status</th><th>Aksi</th></tr></thead><tbody id="rows"></tbody></table></div>`;
  const rows = document.getElementById('rows');
  try{
    const snap = await getDocs(query(collection(db,'withdrawals'), orderBy('createdAt','desc')));
    let any=false; snap.forEach(d=>{ const x=d.data(); any=true;
      const t = x.createdAt?.toDate ? x.createdAt.toDate().toLocaleString('id-ID') : '-';
      rows.insertAdjacentHTML('beforeend', `<tr><td>${t}</td><td>${x.userEmail||x.uid}</td><td>${x.method||'-'}</td><td>${x.provider||'-'}</td><td>Rp ${nf.format(x.amount||0)}</td><td>${x.status||'-'}</td><td>${x.status==='pending'?`<button class="btn small green" data-id="${d.id}" data-act="approve">Approve</button><button class="btn small red" data-id="${d.id}" data-act="reject">Reject</button>`:'-'}</td></tr>`);
    });
    if(!any) rows.innerHTML = `<tr><td colspan="7">Belum ada data.</td></tr>`;
    rows.addEventListener('click', async (e)=>{
      const b = e.target.closest('button[data-id]'); if(!b) return;
      await updateDoc(doc(db,'withdrawals', b.dataset.id), { status: b.dataset.act==='approve'?'approved':'rejected', updatedAt: serverTimestamp() });
      location.reload();
    });
  }catch(err){ rows.innerHTML = `<tr><td colspan="7">Gagal: ${err?.message||err}</td></tr>`; }
}
renderAdminWithdrawals();
