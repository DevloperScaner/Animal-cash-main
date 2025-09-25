import { db } from '../firebase-init.js';
import { collection, getDocs, query, orderBy, updateDoc, doc, serverTimestamp, addDoc } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
import { defaults } from '../config.js';

const f = new Intl.NumberFormat('id-ID');

export async function renderAdminReferrals(){
  const root = document.getElementById('adminView');
  root.innerHTML = `<section class="card">
      <h3>Referrals Pending</h3>
      <div id="refTable" class="table"></div>
    </section>`;
  const tbl = document.getElementById('refTable');

  try{
    const snap = await getDocs(query(collection(db,'referrals'), orderBy('createdAt','desc')));
    const rows = [];
    snap.forEach(d=>{ const x=d.data(); x.id=d.id; if((x.status||'pending')==='pending') rows.push(x); });

    if(rows.length===0){ tbl.innerHTML = `<div class="small">Belum ada referral pending.</div>`; return; }

    let html = `<table><thead><tr>
      <th>Tanggal</th><th>Referrer</th><th>New User</th><th>Bonus</th><th>Aksi</th>
    </tr></thead><tbody>`;
    for(const x of rows){
      const t = x.createdAt?.toDate ? x.createdAt.toDate().toLocaleString('id-ID') : '-';
      const bonus = x.bonus || defaults.referral.bonus || 5000;
      html += `<tr>
        <td>${t}</td>
        <td>${x.referrerEmail || x.referrerUid}</td>
        <td>${x.newUserEmail || x.newUserUid}</td>
        <td>Rp ${f.format(bonus)}</td>
        <td>
          <button class="btn small green" data-act="approve" data-id="${x.id}" data-uid="${x.referrerUid}" data-amount="${bonus}">Approve</button>
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
        if(act==='approve'){
          // catat bonus ke user
          const uid = btn.dataset.uid;
          const amount = Number(btn.dataset.amount||0);
          if(uid && amount>0){
            await addDoc(collection(db,'users',uid,'bonuses'), {
              type:'referral', amount, status:'credited', createdAt: serverTimestamp()
            });
          }
        }
        await updateDoc(doc(db,'referrals',id), { status: act==='approve'?'approved':'rejected', updatedAt: serverTimestamp() });
        renderAdminReferrals();
      } catch(err){ alert('Gagal: ' + (err?.message||err)); }
      finally{ btn.disabled=false; }
    });

  }catch(err){
    tbl.innerHTML = `<div class="small">Gagal memuat referrals: ${err?.message||err}</div>`;
  }
}
window.renderAdminReferrals = renderAdminReferrals;
