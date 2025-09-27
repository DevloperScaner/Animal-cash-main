import { boot } from "../app.js";
import { requireLogin } from "../../shared/auth.js";
import { auth, db, collection, query, where, onSnapshot } from "../../shared/firebase.js";

boot();
await requireLogin();

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

// Theme toggle (persist)
const btnTheme = document.getElementById("themeBtn");
if (btnTheme) {
  const apply = () => {
    const theme = localStorage.getItem("theme") || "dark";
    document.documentElement.dataset.theme = theme;
  };
  apply();
  btnTheme.addEventListener("click", () => {
    const next = (localStorage.getItem("theme") === "light") ? "dark" : "light";
    localStorage.setItem("theme", next); apply();
  });
}

// HERO slider 3s
const hero = document.getElementById("heroSlides");
const dotsWrap = document.getElementById("heroDots");
let idx = 0;
const count = hero ? hero.children.length : 0;
if (dotsWrap && count > 0) {
  for(let i=0;i<count;i++){ const d=document.createElement("div"); d.className="dot"+(i===0?" active":""); dotsWrap.appendChild(d); d.addEventListener("click",()=>go(i)); }
}
function go(i){
  idx = (i+count)%count;
  hero.style.transform = `translateX(-${idx*100}%)`;
  [...dotsWrap.children].forEach((d,k)=> d.classList.toggle("active", k===idx));
}
let timer = setInterval(()=>go(idx+1), 3000);
hero?.addEventListener("mouseenter", ()=> clearInterval(timer));
hero?.addEventListener("mouseleave", ()=> timer = setInterval(()=>go(idx+1), 3000));

// Swipe grid paging (touch)
const grid = document.getElementById("menuGrid");
const gridDots = document.getElementById("gridDots");
if (grid) {
  const pages = [...grid.querySelectorAll(".page")];
  let gi=0;
  pages.forEach((_,i)=>{
    const dot=document.createElement("div"); dot.className="dot"+(i===0?" active":""); gridDots.appendChild(dot);
    dot.addEventListener("click", ()=> { gi=i; grid.style.transform = `translateX(-${gi*100}%)`; syncDots(); });
  });
  function syncDots(){ [...gridDots.children].forEach((d,k)=> d.classList.toggle("active", k===gi)); }
  let startX=0;
  grid.addEventListener("touchstart", e=> { startX=e.touches[0].clientX; }, {passive:true});
  grid.addEventListener("touchend", e=> {
    const dx=(e.changedTouches[0].clientX-startX);
    if (Math.abs(dx) > 40) gi = Math.max(0, Math.min(pages.length-1, gi + (dx<0?1:-1)));
    grid.style.transform = `translateX(-${gi*100}%)`; syncDots();
  }, {passive:true});
}
