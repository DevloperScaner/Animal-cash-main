import { auth, db, App } from './firebase-init.js';
import { onAuthStateChanged, signOut, getIdTokenResult } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

export function guardPage(cb){
  onAuthStateChanged(auth, async (u)=>{
    if(!u){ location.href = 'index.html'; return; }
    document.getElementById('logoutBtn')?.addEventListener('click', async ()=>{
      await signOut(auth); location.href='index.html';
    });

    // munculkan link admin jika admin
    const adminLink = document.getElementById('adminLink');
    if (adminLink) {
      let isAdmin = false;
      try { const tok = await getIdTokenResult(u); isAdmin = tok.claims?.admin === true; } catch {}
      if (!isAdmin) {
        const s = await getDoc(doc(db,'users',u.uid));
        isAdmin = s.exists() && s.data().role === 'admin';
      }
      if (isAdmin) adminLink.style.display = 'inline-flex';
    }
    cb?.(u);
  });
}
