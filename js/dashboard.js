import { auth, db, App } from './firebase-init.js';
import { onAuthStateChanged, signOut, getIdTokenResult } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

const dispName = document.getElementById('dispName');
const logoutBtn = document.getElementById('logoutBtn');
const adminLink = document.getElementById('adminLink');

onAuthStateChanged(auth, async (user)=>{
  if(!user){ location.href='index.html'; return; }
  dispName.textContent = user.displayName || (user.email ?? 'User');

  // check admin via user doc or custom claim
  let isAdmin = false;
  try{
    const token = await getIdTokenResult(user);
    if (token.claims && token.claims.admin === true) isAdmin = true;
  }catch{}
  if(!isAdmin){
    const snap = await getDoc(doc(db, 'users', user.uid));
    isAdmin = snap.exists() && snap.data().role === 'admin';
  }
  if(isAdmin) adminLink.style.display='inline-flex';

  logoutBtn?.addEventListener('click', async ()=>{
    await signOut(auth);
    location.href='index.html';
  });
});

// Tab demo
document.getElementById('tab-farm')?.addEventListener('click', (e)=>{ e.preventDefault(); App.toast('Buka fitur Farm'); });
document.getElementById('tab-profile')?.addEventListener('click', (e)=>{ e.preventDefault(); App.toast('Buka profil'); });
