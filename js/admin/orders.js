import { db, } from '../firebase-init.js';
import { collection, getDocs, query, orderBy, updateDoc, doc, serverTimestamp, addDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
const f = new Intl.NumberFormat('id-ID');
async function createHoldingFromOrder(x){
  try{
    const startAt = new Date();
    const cycle = Number(x.cycleDays || x.cycle || 0);
    const endAt = new Date(startAt.getTime() + Math.max(0, cycle)*86400000);
    let dailyIncome = x.dailyIncome, totalIncome = x.totalIncome, productName = x.productName;
    if((dailyIncome==null || totalIncome==null || !productName) && x.productId){
      try{ const p = await getDoc(doc(db,'products', x.productId)); if(p.exists()){ const pd = p.data(); productName = productName || pd.name; dailyIncome = dailyIncome ?? pd.dailyIncome; totalIncome = totalIncome ?? pd.totalIncome; } }catch(_){}
    }
    await addDoc(collection(db,'users', x.uid, 'holdings'), { orderId: x.id||x.orderId||null, productId: x.productId||null, productName: productName||'Item', price: Number(x.price||0), dailyIncome: Number(dailyIncome||0), totalIncome: Number(totalIncome||0), cycleDays: cycle, startAt, endAt, status:'active', createdAt: serverTimestamp() });
  }catch(err){ console.error('createHoldingFromOrder failed', err); throw err; }
}
export async function renderAdminOrders(){
  const root = document.getElementById('adminView');
  root.innerHTML = `<section class="card"><h3>Orders Pending</h3><div id="ordersTable" class="table"></div></section>`;
  const tbl = document.getElementById('ordersTable');
  try{
    const snap = await getDocs(query(collection(db,'orders'), orderBy('createdAt','desc')));
    const rows = []; snap.forEach(d=>{ const x=d.data(); x.id=d.id; if((x.status||'pending')==='pending') rows.push(x); });
    if(rows.length===0){ tbl.innerHTML = `<div class="small">Belum ada order pending.</div>`; return; }
    let html = `<table><thead><tr><th>Tanggal</th><th>User</th><th>Produk</th><th>Harga</th><th>Bukti</th><th>Aksi</th></tr></thead><tbody>`;
    for(const x of rows){ const t = x.createdAt?.toDate ? x.createdAt.toDate().toLocaleString('id-ID') : '-'; const proof = x.proofUrl ? `<a class="btn small" href="${x.proofUrl}" target="_blank">Lihat</a>` : '-';
      html += `<tr><td>${t}</td><td>${x.userEmail||x.uid}</td><td>${x.productName||x.productId}</td><td>Rp ${f.format(x.price||0)}</td><td>${proof}</td><td><button class="btn small green" data-act="approve" data-id="${x.id}">Approve</button><button class="btn small red" data-act="reject" data-id="${x.id}">Reject</button></td></tr>`;}
    html += `</tbody></table>`; tbl.innerHTML = html;
    tbl.addEventListener('click', async (e)=>{
      const btn = e.target.closest('button[data-act]'); if(!btn) return;
      const id = btn.dataset.id; const act = btn.dataset.act; btn.disabled = true;
      try{
        const ref = doc(db,'orders',id);
        // Baca detail order (untuk buat holding)
        let data=null; const all = await getDocs(query(collection(db,'orders'))); all.forEach(d=>{ if(d.id===id){ data=d.data(); data.id=d.id; } });
        await updateDoc(ref, { status: act==='approve' ? 'approved':'rejected', updatedAt: serverTimestamp() });
        if(act==='approve' && data && data.uid){ await createHoldingFromOrder(data); }
        renderAdminOrders();
      }catch(err){ alert('Gagal: ' + (err?.message||err)); } finally { btn.disabled=false; }
    });
  }catch(err){ tbl.innerHTML = `<div class="small">Gagal memuat orders: ${err?.message||err}</div>`; }
}
window.renderAdminOrders = renderAdminOrders;
