
import { db } from '../firebase-init.js';
import { collection, query, orderBy, getDocs, where } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

window.renderAdminDashboard = async function(){
  const el = document.getElementById('adminView');
  // Simple KPI counts
  const ordersPending = (await getDocs(query(collection(db,'orders'), where('status','==','pending')))).size;
  const wdPending = (await getDocs(query(collection(db,'withdrawals'), where('status','==','pending')))).size;
  el.innerHTML = `<section class='card'><h3>Dashboard</h3><div class='kpi'><div class='box'><div class='small'>Orders Pending</div><div style='font-weight:800;font-size:20px'>${ordersPending}</div></div><div class='box'><div class='small'>Withdraw Pending</div><div style='font-weight:800;font-size:20px'>${wdPending}</div></div></div></section>`;
};
