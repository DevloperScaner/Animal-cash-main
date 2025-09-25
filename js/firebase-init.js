
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getAuth, setPersistence, browserLocalPersistence, browserSessionPersistence, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
import { firebaseConfig, defaults } from './config.js';

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const App = {
  toast(msg){
    let t=document.getElementById('toast'); if(!t){t=document.createElement('div');t.id='toast';t.className='toast';document.body.appendChild(t);}
    t.textContent=msg; t.style.display='block'; clearTimeout(this._t); this._t=setTimeout(()=>t.style.display='none',2500);
  },
  async setRemember(remember){ await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence); },
  async ensureAppSettings(){ try{ const snap = await getDoc(doc(db,'appSettings','_root')); if(snap.exists()) return snap.data(); }catch(e){} return defaults; },
  async initUserDoc(u){ const ref=doc(db,'users',u.uid); const s=await getDoc(ref); if(!s.exists()){ await setDoc(ref, { uid:u.uid, email:u.email||'', displayName:u.displayName||'User', role:'user', wallet:{ balance:0, quantitative:0 }, createdAt: serverTimestamp() }); } },
  async signOutAll(){ await signOut(auth); location.href='index.html'; }
};
