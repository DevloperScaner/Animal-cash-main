import { db } from '../firebase-init.js';
import { collection, getDocs, query, orderBy, updateDoc, doc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

const f = new Intl.NumberFormat('id-ID');

export async function renderAdminWithdrawals(){
  const root = document.getElementById('adminView');
  root.innerHTML = `<section class="card">
      <h3>Withdrawals Pending</h3>
      <div id="wdTable" class="table"></div>
    </section>`;

  const tbl = document.getElementById('wdTable');

  try{
    const snap = await getDocs(query(collection(db,'withdrawals'), orderBy('createdAt','desc')));
    const rows = [];
    snap.forEach(d=>{ const x=d.data(); x.id=d.id; if((x.status||'pending')==='pending') rows.push(x); });

    if(rows.length===0){ tbl.innerHTML = `<div class="small">Belum ada withdrawal pending.</div>`; return; }

    let html = `<table><thead><tr>
      <th>Tanggal</th><th>User</th><th>Metode</th><th>Provider</th><th>Jumlah</th><th>Akun</th><th>Aksi</th>
    </tr></thead><tbody>`;
    for(const x of rows){
      const t = x.createdAt?.toDate ? x.createdAt.toDate().toLocaleString('id-ID') : '-';
      html += `<tr>
        <td>${t}</td>
        <td>${x.userEmail || x.uid}</td>
        <td>${x.method||'-'}</td>
        <td>${x.provider||'-'}</td>
        <td>Rp ${f.format(x.amount||0)}</td>
        <td>${x.account || '-'}</td>
        <td>
          <button class="btn small green" data-act="approve" data-id="${x.id}">Approve</button>
          <button class="btn small red" data-act="reject" data-id="${x.id}">Reject</button>
        </td>
      </tr>`;
    }
    html += `</tbody></table>`;
    tbl.innerHTML = html;

    tbl.addEventListener('click', async (e)=>{
      const btn = e.target.closest('button[data-act]'); if(!btn) return;
      const id = btn.dataset.id; const act = btn.dataset.act;
      btn.disabled = true;
      try {
        await updateDoc(doc(db,'withdrawals',id), { status: act==='approve'?'approved':'rejected', updatedAt: serverTimestamp() });
        renderAdminWithdrawals();
      } catch(err){ alert('Gagal: ' + (err?.message||err)); }
      finally{ btn.disabled=false; }
    });

  }catch(err){
    tbl.innerHTML = `<div class="small">Gagal memuat withdrawals: ${err?.message||err}</div>`;
  }
}
window.renderAdminWithdrawals = renderAdminWithdrawals;
