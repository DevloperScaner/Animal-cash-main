
import { auth, App } from '../firebase-init.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
onAuthStateChanged(auth, (u)=>{
  if(!u){ location.href='../index.html'; return; }
  const url = `${location.origin}/?ref=${u.uid}`;
  const input = document.getElementById('inviteLink');
  input.value = url;
  document.getElementById('copyBtn')?.addEventListener('click', ()=>{ navigator.clipboard.writeText(url); App.toast('Tautan disalin'); });
});
