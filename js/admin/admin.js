import { auth } from '../firebase-init.js';
import { adminAllowlist } from '../config.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import './dashboard.js'; import './orders.js'; import './withdrawals.js'; import './referrals.js'; import './banners.js'; import './settings.js';

const view = document.getElementById('adminView');
document.getElementById('logoutBtn')?.addEventListener('click', async ()=>{ await signOut(auth); location.href='../index.html'; });

function isAllowed(u){
  if(!u) return false;
  if (adminAllowlist.uids?.includes(u.uid)) return true;
  if (u.email && adminAllowlist.emails?.map(e=>e.toLowerCase()).includes(u.email.toLowerCase())) return true;
  return u.getIdTokenResult().then(t => !!t.claims?.admin).catch(()=>false);
}

onAuthStateChanged(auth, async (u)=>{
  if(!u){ location.href='../index.html'; return; }
  const ok = await isAllowed(u);
  if(!ok){
    alert('Akses admin ditolak.');
    location.href = '../dashboard.html';
    return;
  }
  window.render('dash');
});

document.getElementById('adminTabs')?.addEventListener('click', (e)=>{
  const btn = e.target.closest('button[data-tab]'); if(!btn) return;
  window.render(btn.dataset.tab);
});

export function render(tab){
  switch(tab){
    case 'dash': window.renderAdminDashboard(); break;
    case 'orders': window.renderAdminOrders(); break;
    case 'withdrawals': window.renderAdminWithdrawals(); break;
    case 'referrals': window.renderAdminReferrals(); break;
    case 'banners': window.renderAdminBanners(); break;
    case 'settings': window.renderAdminSettings(); break;
  }
}
window.render = render;
