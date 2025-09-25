
import { db } from '../firebase-init.js';
import { collection, getDocs, query, orderBy, updateDoc, doc, serverTimestamp, addDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
const nf = new Intl.NumberFormat('id-ID');

async function createHoldingFromOrder(x){
  const startAt = new Date();
  const cycle = Number(x.cycleDays || x.cycle || 0);
  const endAt = new Date(startAt.getTime() + Math.max(0, cycle)*86400000);
  let dailyIncome = x.dailyIncome, totalIncome = x.totalIncome, productName = x.productName;
  if((dailyIncome==null || totalIncome==null || !productName) && x.productId){
    try{ const p = await getDoc(doc(db,'products', x.productId)); if(p.exists()){ const pd=p.data(); productName=productName||pd.name; dailyIncome=dailyIncome??pd.dailyIncome; totalIncome=totalIncome??pd.totalIncome; } }catch(_){}
  }
  await addDoc(collection(db,'users', x.uid, 'holdings'), { orderId: x.id||x.orderId||null, productId: x.productId||null, productName: productName||'Item', price: Number(x.price||0), dailyIncome: Number(dailyIncome||0), totalIncome: Number(totalIncome||0), cycleDays: cycle, startAt, endAt, status:'active', createdAt: serverTimestamp() });
}

function row(x){ const t = x.createdAt?.toDate ? x.createdAt.toDate().toLocaleString('id-ID') : '-';
  const proof = x.proofUrl ? `<a class="btn small" target="_blank" href="${x.proofUrl}">Lihat</a>` : '-';
  return `<tr><td>${t}</td><td>${x.userEmail||x.uid}</td><td>${x.productName||x.productId}</td><td>Rp ${nf.format(x.price||0)}</td><td>${proof}</td><td><button class="btn small green" data-act="approve" data-id="${x.id}">Approve</button><button class="btn small red" data-act="reject" data-id="${x.id}">Reject</button></td></tr>`;
}

export async function renderAdminOrders(rootId='root'){
  const root = document.getElementById(rootId);
  root.innerHTML = `<h3>Orders Pending</h3><div class="table big"><table class="wide"><thead><tr><th>Tanggal</th><th>User</th><th>Produk</th><th>Harga</th><th>Bukti</th><th>Aksi</th></tr></thead><tbody id="rows"></tbody></table></div>`;
  const rows = document.getElementById('rows');
  try{
    const snap = await getDocs(query(collection(db,'orders'), orderBy('createdAt','desc')));
    let any=false; rows.innerHTML='';
    snap.forEach(d=>{ const x=d.data(); x.id=d.id; if((x.status||'pending')==='pending'){ any=true; rows.insertAdjacentHTML('beforeend', row(x)); } });
    if(!any) rows.innerHTML = `<tr><td colspan="6">Tidak ada order pending.</td></tr>`;
    rows.addEventListener('click', async (e)=>{
      const b = e.target.closest('button[data-id]'); if(!b) return;
      const id=b.dataset.id, act=b.dataset.act;
      b.disabled=true;
      const ref = doc(db,'orders', id);
      // get data again
      let data=null; snap.forEach(d=>{ if(d.id===id){ data=d.data(); data.id=d.id; } });
      await updateDoc(ref, { status: act==='approve'?'approved':'rejected', updatedAt: serverTimestamp() });
      if(act==='approve' && data && data.uid){ await createHoldingFromOrder(data); }
      location.reload();
    });
  }catch(err){ rows.innerHTML = `<tr><td colspan="6">Gagal memuat: ${err?.message||err}</td></tr>`; }
}
renderAdminOrders();
