
import { auth } from './firebase-init.js';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';

const $ = (q)=>document.querySelector(q);
$('#loginBtn').onclick = async ()=>{
  const email = $('#email').value.trim(), pass = $('#pass').value;
  try{
    if($('#remember').checked){ await setPersistence(auth, browserLocalPersistence); }
    await signInWithEmailAndPassword(auth, email, pass);
    location.href='dashboard.html';
  }catch(e){ alert('Login gagal: ' + (e?.message||e)); }
};
onAuthStateChanged(auth,(u)=>{ if(u) localStorage.setItem('uid',u.uid); });
