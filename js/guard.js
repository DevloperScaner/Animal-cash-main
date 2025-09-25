
import { auth } from './firebase-init.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
export function guardPage(cb){
  onAuthStateChanged(auth, async (u)=>{
    if(!u){ location.href='index.html'; return; }
    document.getElementById('logoutBtn')?.addEventListener('click', async ()=>{ await signOut(auth); location.href='index.html'; });
    cb?.(u);
  });
}
