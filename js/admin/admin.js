
import { auth } from '../firebase-init.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import './dashboard.js'; import './orders.js'; import './withdrawals.js'; import './referrals.js'; import './banners.js'; import './settings.js';
const view = document.getElementById('adminView');
document.getElementById('logoutBtn')?.addEventListener('click', async ()=>{ await signOut(auth); location.href='../index.html'; });
onAuthStateChanged(auth, (u)=>{ if(!u){ location.href='../index.html'; return; } window.render('dash'); });
document.getElementById('adminTabs')?.addEventListener('click', (e)=>{ const btn = e.target.closest('button[data-tab]'); if(!btn) return; window.render(btn.dataset.tab); });
export function render(tab){ switch(tab){ case 'dash': window.renderAdminDashboard(); break; case 'orders': window.renderAdminOrders(); break; case 'withdrawals': window.renderAdminWithdrawals(); break; case 'referrals': window.renderAdminReferrals(); break; case 'banners': window.renderAdminBanners(); break; case 'settings': window.renderAdminSettings(); break; } } window.render=render;
