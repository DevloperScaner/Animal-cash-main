
// Firebase init (config in config.js)
import { firebaseConfig, cloudinary } from './config.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence, signOut } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFirestore, collection, doc, getDoc, setDoc, addDoc, getDocs, query, where, orderBy, onSnapshot, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

export const App = {};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Keep login session persistent
setPersistence(auth, browserLocalPersistence);

// Theme toggle
export function initTheme(){
  const q = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light':'dark';
  document.body.setAttribute('data-theme', localStorage.getItem('theme') || q);
  document.querySelectorAll('[data-theme-toggle]').forEach(el=>{
    el.addEventListener('change', e=>{
      const mode = e.target.checked ? 'light' : 'dark';
      document.body.setAttribute('data-theme', mode);
      localStorage.setItem('theme', mode);
    });
  });
}

// Guard: require auth on protected pages
export function requireAuth(){
  onAuthStateChanged(auth, async (user)=>{
    if(!user){
      // hide tabbar on auth pages handled separately
      location.href = "index.html";
      return;
    }
    // fetch user doc
    const snap = await getDoc(doc(db, "users", user.uid));
    App.me = { uid:user.uid, email:user.email, ...snap.data() };
    // show admin tile if admin
    const adminEls = document.querySelectorAll('[data-admin-only]');
    adminEls.forEach(el => el.style.display = (App.me?.role==='admin' || App.me?.isAdmin) ? '' : 'none');
    // page-specific hooks
    if(typeof window.pageReady === 'function'){ window.pageReady(); }
  });
}

// Toast helper
export function toast(msg){
  let el = document.getElementById('toast');
  if(!el){ el = document.createElement('div'); el.id='toast'; el.className='toast'; document.body.appendChild(el); }
  el.textContent = msg; el.classList.add('show');
  setTimeout(()=> el.classList.remove('show'), 2200);
}

// Upload to Cloudinary (returns secure_url)
export async function uploadProof(file){
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', cloudinary.uploadPreset);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudinary.cloudName}/auto/upload`, { method:'POST', body:fd });
  const data = await res.json();
  if(!data.secure_url) throw new Error('Upload gagal');
  return data.secure_url;
}

// Maintenance check
export async function checkMaintenance(){
  const s = await getDoc(doc(db, "settings", "app"));
  const v = s.exists() ? s.data() : {};
  if(v.maintenanceActive && !(App.me && (App.me.role==='admin' || App.me.isAdmin))){
    const overlay = document.createElement('div');
    overlay.style.cssText = "position:fixed;inset:0;display:grid;place-items:center;background:rgba(0,0,0,.8);z-index:99999;color:#fff;padding:24px;text-align:center";
    overlay.innerHTML = `<div class="card" style="max-width:520px"><h2>Perbaikan</h2><p>${v.maintenanceMsg||'Mohon maaf, web sedang dalam perbaikan. Silakan coba lagi nanti.'}</p></div>`;
    document.body.appendChild(overlay);
  }
}

// Sign out
export function initLogout(){
  document.querySelectorAll('[data-logout]').forEach(btn=>{
    btn.addEventListener('click', async ()=>{
      await signOut(auth);
      location.href = "index.html";
    });
  });
}
