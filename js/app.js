
// ----- HERO DUMMY AUTO SLIDE -----
const heroDots = document.querySelectorAll('#heroDots .dot');
let heroIdx = 0;
setInterval(()=>{
  heroDots.forEach(d=>d.classList.remove('active'));
  heroIdx = (heroIdx + 1) % heroDots.length;
  heroDots[heroIdx].classList.add('active');
}, 3500);

// ----- MENU GRID RENDER + SWIPE -----
const page1 = document.getElementById('gridPage1');
const page2 = document.getElementById('gridPage2');
const gridDots = document.querySelectorAll('#gridDots .dot');
const viewport = document.getElementById('gridViewport');

const gridPage1Data = [
  {ico:'💳', title:'Menarik', to:'pages/withdraw.html'},
  {ico:'💬', title:'Kontak', to:'pages/contact.html'},
  {ico:'👥', title:'Tim', to:'pages/team.html'},
  {ico:'✉️', title:'Mengundang', to:'pages/invite.html'},
  {ico:'📰', title:'Berita', to:'pages/news.html'},
  {ico:'📈', title:'Ringkasan', to:'pages/summary.html'},
  {ico:'🗒️', title:'Pusat Tugas', to:'pages/tasks.html'},
  {ico:'👛', title:'Dompet', to:'pages/wallet.html'},
  {ico:'🚪', title:'Logout', to:'#logout'}
];

const gridPage2Data = [
  {ico:'⚙️', title:'Admin', to:'pages/admin.html'},
  {ico:'❓', title:'Help', to:'pages/help.html'},
  {ico:'⭐', title:'Rate', to:'pages/rate.html'}
];

function tileHTML(item){
  return `<a class="tile" href="${item.to}" data-to="${item.to}">
    <div class="ico">${item.ico}</div>
    <div class="ttl">${item.title}</div>
  </a>`;
}

page1.innerHTML = gridPage1Data.map(tileHTML).join('');
page2.innerHTML = gridPage2Data.map(tileHTML).join('');

// Lock sizes after render (no zoom changes on swipe)
viewport.addEventListener('scroll', () => {
  const idx = Math.round(viewport.scrollLeft / viewport.clientWidth);
  gridDots.forEach((d,i)=> d.classList.toggle('active', i===idx));
});

// Enable swipe by dragging
let isDown=false, startX=0, scrollLeft=0;
viewport.addEventListener('mousedown',(e)=>{isDown=true; startX=e.pageX - viewport.offsetLeft; scrollLeft=viewport.scrollLeft;});
viewport.addEventListener('mouseleave',()=>isDown=false);
viewport.addEventListener('mouseup',()=>isDown=false);
viewport.addEventListener('mousemove',(e)=>{
  if(!isDown) return;
  e.preventDefault();
  const x=e.pageX - viewport.offsetLeft;
  const walk=(x-startX)*1.1;
  viewport.scrollLeft=scrollLeft - walk;
});

// Touch support
let touchStartX=0;
viewport.addEventListener('touchstart', (e)=> touchStartX = e.touches[0].clientX, {passive:true});
viewport.addEventListener('touchend', (e)=>{
  const dx = (touchStartX - (e.changedTouches[0]?.clientX||touchStartX));
  const w = viewport.clientWidth;
  if (Math.abs(dx) > 40){
    const dir = dx>0 ? 1 : -1;
    const idx = Math.round(viewport.scrollLeft / w) + dir;
    viewport.scrollTo({left: Math.max(0, Math.min(w*idx, w)), behavior:'smooth'});
  }
});

// Tabbar activate current
document.querySelectorAll('.tabbar .tab').forEach(a => {
  const isActive = a.getAttribute('href').endsWith(location.pathname.split('/').pop() || 'index.html');
  if(isActive) a.classList.add('active');
});

// Handle Logout
document.addEventListener('click', (e)=>{
  const link = e.target.closest('a.tile');
  if(!link) return;
  const to = link.dataset.to;
  if(to === '#logout'){
    e.preventDefault();
    alert('Anda telah keluar.');
    // here we could clear localStorage/session etc.
  }
});

// Topbar buttons (demo popups)
document.getElementById('btnNotif').addEventListener('click', ()=>alert('Notifikasi contoh ✅'));
document.getElementById('btnLang').addEventListener('click', ()=>alert('Pilih bahasa: Indonesia / English'));
document.getElementById('btnTheme').addEventListener('click', ()=>alert('Tema diganti (demo).'));
