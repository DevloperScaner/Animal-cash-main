import { auth, db, App } from '../firebase-init.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';

const input = document.getElementById('inviteLink');
const copyBtn = document.getElementById('copyBtn');

onAuthStateChanged(auth, (u)=>{
  if(!u){ location.href='../index.html'; return; }
  const url = `${location.origin}/?ref=${u.uid}`;
  input.value = url;
});

copyBtn?.addEventListener('click', ()=>{
  navigator.clipboard.writeText(input.value); App.toast('Tautan disalin');
});
