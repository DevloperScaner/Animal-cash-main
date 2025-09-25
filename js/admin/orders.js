
import { db } from '../firebase-init.js';
import { collection, query, where, orderBy, getDocs, updateDoc, doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
window.renderAdminOrders = async function(){
  const el=document.getElementById('adminView');
  el.innerHTML=`<section class='card'><h3>Orders Pending</h3><table id='tOrders'><thead><tr><th>Tanggal</th><th>User</th><th>Produk</th><th>Harga</th><th>Bukti</th><th>Aksi</th></tr></thead><tbody></tbody></table></section>`;
  const tb=el.querySelector('#tOrders tbody');
  const qy=query(collection(db,'orders'), where('status','==','pending'), orderBy('createdAt','desc'));
  const snap=await getDocs(qy); tb.innerHTML='';
  for(const d of snap.docs){ const x=d.data(); const t=x.createdAt?.toDate?x.createdAt.toDate().toLocaleString('id-ID'):'-';
    const tr=document.createElement('tr'); tr.innerHTML=`<td>${t}</td><td>${x.uid}</td><td>${x.productName}</td><td>Rp ${new Intl.NumberFormat('id-ID').format(x.price)}</td><td><a href='${x.proofUrl}' target='_blank'>Lihat</a></td><td><button class='btn green' data-approve='${d.id}'>Approve</button> <button class='btn red' data-reject='${d.id}'>Reject</button></td>`; tb.appendChild(tr); }
  tb.addEventListener('click', async (e)=>{ const a=e.target.closest('button[data-approve]'); const r=e.target.closest('button[data-reject]'); if(a){ await approve(a.dataset.approve); window.render('orders'); } if(r){ await updateDoc(doc(db,'orders',r.dataset.reject), { status:'rejected' }); window.render('orders'); } });
};
async function approve(id){ const {getDoc}=await import('https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js'); const ref=doc(db,'orders',id); const s=await getDoc(ref); if(!s.exists())return; const o=s.data(); const now=new Date(); const end=new Date(now.getTime()+(o.cycleDays||60)*86400000); await setDoc(doc(db,'users',o.uid,'holdings',o.productId), { productId:o.productId, productName:o.productName, price:o.price, dailyIncome:o.dailyIncome, totalIncome:o.totalIncome, cycleDays:o.cycleDays, startAt:now, endAt:end, status:'active', createdAt:now }); await updateDoc(ref, { status:'approved', approvedAt:new Date() }); }
