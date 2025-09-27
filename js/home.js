
const $=s=>document.querySelector(s);const $$=s=>document.querySelectorAll(s);
const state={theme:localStorage.getItem('theme')||'dark',lang:localStorage.getItem('lang')||'id',slide:0,page:0};
function applyTheme(){document.documentElement.classList.toggle('light',state.theme==='light');localStorage.setItem('theme',state.theme);}
function toggleTheme(){state.theme=state.theme==='dark'?'light':'dark';applyTheme();}
function setLang(l){state.lang=l;localStorage.setItem('lang',l);}

function sliderInit(){
  const slides=['Chicken — Cashback 5%','Cow — Potongan 10%','Sheep — Bonus 15%'];
  const bannerTitle=$('#bannerTitle');const dots=$$('#bannerDots .dot');
  setInterval(()=>{state.slide=(state.slide+1)%slides.length;bannerTitle.textContent=slides[state.slide];dots.forEach((d,i)=>d.classList.toggle('active',i===state.slide));},3500);
}

function gridInit(){
  const pages=[
    [
      {title:'Menarik',ico:'💳',href:'pages/withdraw.html'},
      {title:'Kontak',ico:'💬',href:'pages/kontak.html'},
      {title:'Tim',ico:'👥',href:'pages/tim.html'},
      {title:'Mengundang',ico:'✉️',href:'pages/invite.html'},
      {title:'Berita',ico:'📰',href:'pages/berita.html'},
      {title:'Ringkasan',ico:'📈',href:'pages/ringkasan.html'},
      {title:'Pusat Tugas',ico:'🗒️',href:'pages/tugas.html'},
      {title:'Dompet',ico:'👛',href:'pages/dompet.html'},
      {title:'Logout',ico:'🚪',href:'#logout'}
    ],
    [
      {title:'Help',ico:'❓',href:'pages/help.html'},
      {title:'Rate',ico:'⭐',href:'pages/rate.html'},
      {title:'Lainnya',ico:'➕',href:'pages/lainnya.html'}
    ]
  ];
  const grid=$('#grid'); const pager=$('#gridPager'); let startX=null,locked=false;
  function render(){
    grid.innerHTML=''; const items=pages[state.page];
    items.forEach(it=>{
      const a=document.createElement('a');a.className='tile';a.href=it.href;a.innerHTML=`<div class="ico"></div>`;
      a.innerHTML=`<div class="ico">{it.ico}</div><div class="txt">{it.title}</div>`;
      if(it.href==='#logout') a.addEventListener('click',e=>{e.preventDefault();localStorage.clear();alert('Berhasil logout');window.location='login.html';});
      grid.appendChild(a);
    });
    pager.querySelectorAll('.dot').forEach((d,i)=>d.classList.toggle('active',i===state.page));
  }
  render();
  grid.addEventListener('touchstart',e=>startX=e.touches[0].clientX);
  grid.addEventListener('touchmove',e=>{if(startX===null||locked)return; const dx=e.touches[0].clientX-startX; if(Math.abs(dx)>60){locked=true; if(dx<0 && state.page<pages.length-1) state.page++; else if(dx>0 && state.page>0) state.page--; render(); setTimeout(()=>locked=false,200);}});
  grid.addEventListener('touchend',()=>startX=null);
}

function tabbarInit(){
  $$('.tab').forEach(t=>t.addEventListener('click',()=>{window.location=t.dataset.href;}));
}

document.addEventListener('DOMContentLoaded',()=>{
  applyTheme(); sliderInit(); gridInit(); tabbarInit();
  $('#themeBtn').addEventListener('click',toggleTheme);
});
