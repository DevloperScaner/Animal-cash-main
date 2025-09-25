
import { auth, db, App } from '../firebase-init.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { addDoc, collection, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
onAuthStateChanged(auth, (u)=>{
  if(!u){ location.href='index.html'; return; }
  document.getElementById('supportForm')?.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const subj = document.getElementById('subj').value.trim();
    const body = document.getElementById('body').value.trim();
    if(!subj || !body){ App.toast('Isi subjek & deskripsi'); return; }
    await addDoc(collection(db,'supportTickets'), { uid: u.uid, subject: subj, body, status: 'open', createdAt: serverTimestamp() });
    App.toast('Tiket terkirim'); e.target.reset();
  });
});
