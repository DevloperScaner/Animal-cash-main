import { auth, db, App } from '../firebase-init.js';
import { createUserWithEmailAndPassword, updateProfile } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { doc, getDoc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

const tabEmail = document.getElementById('tab-reg-email');
const tabPhone = document.getElementById('tab-reg-phone');
const fEmail = document.getElementById('form-reg-email');
const fPhone = document.getElementById('form-reg-phone');

tabEmail?.addEventListener('click', ()=>{ fEmail.style.display='grid'; fPhone.style.display='none'; });
tabPhone?.addEventListener('click', ()=>{ fEmail.style.display='none'; fPhone.style.display='grid'; });

fEmail?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const email = document.getElementById('re-email').value.trim();
  const pass = document.getElementById('re-pass').value;
  const name = document.getElementById('re-name').value.trim() || 'User';
  try{
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(cred.user, { displayName: name });
    await bootstrapUserDoc(cred.user, { email, displayName: name });
    location.href='dashboard.html';
  }catch(err){ App.toast(err.message); }
});

fPhone?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const phone = document.getElementById('rp-phone').value.replace(/[^0-9]/g,'');
  const pass  = document.getElementById('rp-pass').value;
  const name  = document.getElementById('rp-name').value.trim() || 'User';
  const email = `${phone}@phone.local`; // phone-as-email
  try{
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(cred.user, { displayName: name });
    await bootstrapUserDoc(cred.user, { phone, displayName: name });
    location.href='dashboard.html';
  }catch(err){ App.toast(err.message); }
});

async function bootstrapUserDoc(user, extra={}){
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  if(!snap.exists()){
    await setDoc(ref, {
      uid: user.uid,
      email: user.email || null,
      phone: extra.phone || null,
      displayName: extra.displayName || user.displayName || 'User',
      role: 'user',
      createdAt: serverTimestamp()
    });
  }
}
