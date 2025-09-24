import { auth, db, App } from '../firebase-init.js';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';

onAuthStateChanged(auth, (u)=>{
  if(u) location.href='dashboard.html';
});

document.getElementById('loginForm')?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const email = document.getElementById('lemail').value.trim();
  const pass = document.getElementById('lpass').value;
  try{
    await signInWithEmailAndPassword(auth, email, pass);
    location.href='dashboard.html';
  }catch(err){
    App.toast(err.message);
  }
});
