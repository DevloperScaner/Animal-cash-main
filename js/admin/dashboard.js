
import { db } from '../firebase-init.js';
import { collection, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
window.renderAdminDashboard = async function(){
  const el = document.getElementById('adminView');
  el.innerHTML = `<section class='card'>
    <h3>Ringkasan</h3>
    <div style='display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px'>
      <div class='card'><div class='small'>Orders Pending</div><div id='kOrders' style='font-weight:800;font-size:22px'>-</div></div>
      <div class='card'><div class='small'>Withdraw Pending</div><div id='kWd' style='font-weight:800;font-size:22px'>-</div></div>
      <div class='card'><div class='small'>Referrals Pending</div><div id='kRef' style='font-weight:800;font-size:22px'>-</div></div>
      <div class='card'><div class='small'>Total Users (approx)</div><div id='kUsers' style='font-weight:800;font-size:22px'>-</div></div>
    </div>
  </section>`;

  const qOrders = query(collection(db,'orders'), where('status','==','pending'));
  const qWd     = query(collection(db,'withdrawals'), where('status','==','pending'));
  const qRef    = query(collection(db,'referrals'), where('bonusStatus','==','pending'));

  const [sO, sW, sR] = await Promise.all([getDocs(qOrders), getDocs(qWd), getDocs(qRef)]);
  document.getElementById('kOrders').textContent = sO.size;
  document.getElementById('kWd').textContent     = sW.size;
  document.getElementById('kRef').textContent    = sR.size;

  try{
    const uSnap = await getDocs(collection(db,'users'));
    document.getElementById('kUsers').textContent = uSnap.size;
  }catch(_){
    document.getElementById('kUsers').textContent = '∞';
  }
};
