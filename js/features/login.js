
const params = new URLSearchParams(location.search); if(params.get('ref')) localStorage.setItem('referrerUid', params.get('ref'));
import { auth, App } from '../firebase-init.js';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
onAuthStateChanged(auth, u=>{ if(u) location.href='dashboard.html'; });
document.getElementById('loginForm')?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const email = document.getElementById('lemail').value.trim();
  const pass  = document.getElementById('lpass').value;
  const remember = document.getElementById('remember')?.checked ?? true;
  try{ await App.setRemember(remember); const cred = await signInWithEmailAndPassword(auth, email, pass); await App.initUserDoc(cred.user); location.href='dashboard.html'; }catch(err){ App.toast(err.message); }
});
