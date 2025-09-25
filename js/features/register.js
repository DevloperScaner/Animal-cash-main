
import { auth, db, App } from '../firebase-init.js';
import { createUserWithEmailAndPassword, updateProfile, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { doc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

onAuthStateChanged(auth, u=>{ if(u) location.href='dashboard.html'; });

document.getElementById('reg')?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const email = document.getElementById('re-email').value.trim();
  const pass  = document.getElementById('re-pass').value;
  const name  = document.getElementById('re-name').value.trim() || 'User';
  try{
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(cred.user, { displayName: name });
    await setDoc(doc(db,'users',cred.user.uid), { uid: cred.user.uid, email, displayName: name, role: 'user', wallet: { balance: 0, quantitative: 0 }, createdAt: serverTimestamp() });
    location.href='dashboard.html';
  }catch(err){ App.toast(err.message); }
});
