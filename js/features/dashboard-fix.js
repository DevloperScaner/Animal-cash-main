import { auth } from '../firebase-init.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { adminAllowlist } from '../config.js';

const dispName = document.getElementById('dispName');
const adminLink = document.getElementById('adminLink');
document.getElementById('logoutBtn')?.addEventListener('click', async ()=>{ await signOut(auth); location.href='index.html'; });

function isAllow(u){
  if(!u) return false;
  if (adminAllowlist.uids?.includes(u.uid)) return true;
  if (u.email && adminAllowlist.emails?.map(e=>e.toLowerCase()).includes(u.email.toLowerCase())) return true;
  return false;
}

onAuthStateChanged(auth, (u)=>{
  if(!u){ location.href='index.html'; return; }
  dispName.textContent = u.displayName || (u.email ? u.email.split('@')[0] : 'User');
  if (isAllow(u)) adminLink.style.display='inline-flex';
});
