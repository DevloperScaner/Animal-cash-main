import { db } from '../firebase-init.js';
import { collection, getDocs, query, orderBy, updateDoc, doc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
const f = new Intl.NumberFormat('id-ID');
export async function renderAdminWithdrawals(){
  const root = document.getElementById('adminView');
  root.innerHTML = `<section class="card"><h3>Withdrawals</h3><div id="wdTable" class="table"></div></section>`;
  const tbl = document.getElementById('wdTable');
  try{
    const snap = await getDocs(query(collection(db,'withdrawals'), orderBy('createdAt','desc')));
    let html = `<table><thead><tr><th>Tanggal</th><th>User</th><th>Metode</th><th>Provider</th><th>Jumlah</th><th>Status</th><th>Aksi</th></tr></thead><tbody>`;
    let any=false;
    snap.forEach(d=>{ const x=d.data(); any=true;
      const t = x.createdAt?.toDate ? x.createdAt.toDate().toLocaleString('id-ID') : '-';
      html += `<tr><td>${t}</td><td>${x.userEmail||x.uid}</td><td>${x.method||'-'}</td><td>${x.provider||'-'}</td><td>Rp ${f.format(x.amount||0)}</td><td>${x.status||'-'}</td><td>${x.status==='pending'?`<button class="btn small green" data-id="${d.id}" data-act="approve">Approve</button><button class="btn small red" data-id="${d.id}" data-act="reject">Reject</button>`:'-'}</td></tr>`;
    });
    html += `</tbody></table>`; tbl.innerHTML = any? html:`<div class="small">Belum ada data.</div>`;
    tbl.addEventListener('click', async (e)=>{
      const b = e.target.closest('button[data-id]'); if(!b) return;
      const ref = doc(db,'withdrawals', b.dataset.id);
      await updateDoc(ref, { status: b.dataset.act==='approve'?'approved':'rejected', updatedAt: serverTimestamp() });
      renderAdminWithdrawals();
    });
  }catch(err){ tbl.innerHTML = `<div class="small">Gagal memuat withdrawals: ${err?.message||err}</div>`; }
}
window.renderAdminWithdrawals = renderAdminWithdrawals;
