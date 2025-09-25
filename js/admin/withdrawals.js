
import { db } from '../firebase-init.js';
import { collection, query, where, orderBy, getDocs, updateDoc, doc } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

window.renderAdminWithdrawals = async function(){
  const el = document.getElementById('adminView');
  el.innerHTML = `<section class='card'><h3>Withdrawals Pending</h3><table id='tWd'><thead><tr><th>Tanggal</th><th>User</th><th>Metode</th><th>Provider</th><th>Jumlah</th><th>Fee</th><th>Net</th><th>Aksi</th></tr></thead><tbody></tbody></table></section>`;
  const tb = el.querySelector('#tWd tbody');
  const qy = query(collection(db,'withdrawals'), where('status','==','pending'), orderBy('createdAt','desc'));
  const snap = await getDocs(qy);
  tb.innerHTML='';
  for(const d of snap.docs){
    const x = d.data(); const t=x.createdAt?.toDate?x.createdAt.toDate().toLocaleString('id-ID'):'-';
    const tr=document.createElement('tr'); tr.innerHTML=`<td>${t}</td><td>${x.uid}</td><td>${x.method}</td><td>${x.provider}</td><td>Rp ${new Intl.NumberFormat('id-ID').format(x.amount)}</td><td>Rp ${new Intl.NumberFormat('id-ID').format(x.fee||0)}</td><td>Rp ${new Intl.NumberFormat('id-ID').format(x.netAmount||0)}</td><td><button class='btn green' data-approve='${d.id}'>Approve</button> <button class='btn red' data-reject='${d.id}'>Reject</button></td>`; tb.appendChild(tr);
  }
  tb.addEventListener('click', async (e)=>{
    const a = e.target.closest('button[data-approve]'); const r = e.target.closest('button[data-reject]');
    if(a){ await updateDoc(doc(db,'withdrawals',a.dataset.approve), { status:'approved', approvedAt: new Date() }); window.render('withdrawals'); }
    if(r){ await updateDoc(doc(db,'withdrawals',r.dataset.reject), { status:'rejected', rejectedAt: new Date() }); window.render('withdrawals'); }
  });
};
