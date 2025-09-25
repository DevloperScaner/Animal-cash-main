import { auth } from '../firebase-init.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { adminAllowlist } from '../config.js';
const adminLink = document.getElementById('adminLink');
const dispNameEl = document.getElementById('dispName');
document.getElementById('logoutBtn')?.addEventListener('click', async ()=>{ await signOut(auth); location.href='index.html'; });
const isAllow = (u)=> !!u && ((adminAllowlist.uids||[]).includes(u.uid) || ((adminAllowlist.emails||[]).map(x=>x.toLowerCase()).includes((u.email||'').toLowerCase())));
onAuthStateChanged(auth, (u)=>{
  if(!u){ location.href='index.html'; return; }
  if (dispNameEl) dispNameEl.textContent = u.displayName || (u.email ? u.email.split('@')[0] : 'User');
  if (adminLink && isAllow(u)) adminLink.style.display='inline-flex';
});
