import { boot } from "../app.js";
import { requireLogin } from "../../shared/auth.js";
import { auth, db, collection, query, where, onSnapshot } from "../../shared/firebase.js";
import { getLang, setLang, apply } from "../i18n.js";

boot();
await requireLogin();

// Language picker
const lp = document.getElementById("langPicker");
if (lp){ lp.value = getLang(); lp.addEventListener("change", ()=>{ setLang(lp.value); apply(); }); }
apply();

// Instant Theme toggle using CSS variables
function applyTheme(theme){
  const r = document.documentElement;
  if (theme === "light") {
    r.style.setProperty("--bg","#f7fafc");
    r.style.setProperty("--fg","#0b1520");
    r.style.setProperty("--muted","#455a70");
    r.style.setProperty("--panel","#ffffff");
    r.style.setProperty("--panel2","#ffffff");
    r.style.setProperty("--border","rgba(0,0,0,.08)");
  } else {
    r.style.setProperty("--bg","#0b1520");
    r.style.setProperty("--fg","#e6f0ff");
    r.style.setProperty("--muted","#9fb3c8");
    r.style.setProperty("--panel","#0f1a2a");
    r.style.setProperty("--panel2","#0f1a2a");
    r.style.setProperty("--border","rgba(255,255,255,.06)");
  }
  localStorage.setItem("theme", theme);
}
applyTheme(localStorage.getItem("theme") || "dark");
document.getElementById("themeBtn")?.addEventListener("click", ()=>{
  const next = (localStorage.getItem("theme")==="light") ? "dark" : "light";
  applyTheme(next);
});

// Logout
document.getElementById("logoutBtn")?.addEventListener("click", async ()=>{
  try {
    const { signOut } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
    await signOut(auth);
  } catch(e){ /* ignore */ }
  location.replace("./login.html");
});

// Notif button
document.getElementById("btnNotif")?.addEventListener("click", ()=> location.href = "./notifications.html");

// Summary realtime
const elAssets = document.getElementById("sumAssets");
const elHold = document.getElementById("sumHold");
const elAcc = document.getElementById("sumAcc");

onSnapshot(query(collection(db,"orders"), where("uid","==", auth.currentUser.uid), where("status","==","approved")), snap => {
  let total = 0;
  snap.forEach(d => total += (d.data().price || 0));
  elAssets.textContent = "Rp" + total.toLocaleString("id-ID");
});

onSnapshot(query(collection(db,"holdings"), where("uid","==", auth.currentUser.uid)), snap => {
  elHold.textContent = String(snap.size);
  elAcc.textContent = String(snap.size);
});

// HERO slider 3s
const hero = document.getElementById("heroSlides");
const dotsWrap = document.getElementById("heroDots");
let idx = 0;
const count = hero ? hero.children.length : 0;
if (dotsWrap && count > 0) {
  for(let i=0;i<count;i++){ const d=document.createElement("div"); d.className="dot"+(i===0?" active":""); dotsWrap.appendChild(d); d.addEventListener("click",()=>go(i)); }
}
function go(i){
  if (!hero) return;
  idx = (i+count)%count;
  hero.style.transform = `translateX(-${idx*100}%)`;
  [...dotsWrap.children].forEach((d,k)=> d.classList.toggle("active", k===idx));
}
let timer = setInterval(()=>go(idx+1), 3000);
hero?.addEventListener("mouseenter", ()=> clearInterval(timer));
hero?.addEventListener("mouseleave", ()=> timer = setInterval(()=>go(idx+1), 3000));

// Swipe grid paging (smooth & robust)
const grid = document.getElementById("menuGrid");
const gridDots = document.getElementById("gridDots");
if (grid) {
  const pages = [...grid.querySelectorAll(".page")];
  let gi=0, startX=0, dragging=false;
  pages.forEach((_,i)=>{
    const dot=document.createElement("div"); dot.className="dot"+(i===0?" active":""); gridDots.appendChild(dot);
    dot.addEventListener("click", ()=> { gi=i; grid.style.transform = `translateX(-${gi*100}%)`; syncDots(); });
  });
  function syncDots(){ [...gridDots.children].forEach((d,k)=> d.classList.toggle("active", k===gi)); }
  const threshold = 48;
  grid.addEventListener("touchstart", e=> { startX=e.touches[0].clientX; dragging=true; }, {passive:true});
  grid.addEventListener("touchmove",  e=> { if(!dragging) return; /* momentum optional */ }, {passive:true});
  grid.addEventListener("touchend",   e=> {
    if(!dragging) return; dragging=false;
    const dx=(e.changedTouches[0].clientX-startX);
    if (Math.abs(dx) > threshold) gi = Math.max(0, Math.min(pages.length-1, gi + (dx<0?1:-1)));
    grid.style.transform = `translateX(-${gi*100}%)`; syncDots();
  }, {passive:true});
}
