
function $(s,scope=document){return scope.querySelector(s)}
function getLang(){return localStorage.getItem('lang')||'ID'}
function setLang(v){localStorage.setItem('lang',v)}
function getTheme(){return localStorage.getItem('theme')||'dark'}
function setTheme(v){localStorage.setItem('theme',v); document.documentElement.setAttribute('data-theme', v==='light'?'light':'dark')}
function renderShell(activeTab='home'){
  setTheme(getTheme())
  const header=document.createElement('header');header.className='header';header.innerHTML=`
    <div class="header-inner container">
      <div class="brand" id="brand"></div>
      <button class="pill" id="btnNotif">🔔</button>
      <select class="lang-select" id="langSel"><option value="ID">ID</option><option value="EN">EN</option></select>
      <select class="theme-select" id="themeSel"><option value="dark">Dark</option><option value="light">Light</option></select>
      <a class="pill" id="logoutBtn">Logout</a>
    </div>`;
  document.body.prepend(header);
  const tabbar=document.createElement('div');tabbar.className='tabbar';tabbar.innerHTML=`
    <nav class="container">
      <a class="tab ${activeTab==='home'?'active':''}" href="../index.html">🏠<span>Home</span></a>
      <a class="tab ${activeTab==='farm'?'active':''}" href="farm.html">🐮<span>Farm</span></a>
      <a class="tab ${activeTab==='invite'?'active':''}" href="invite.html">🤝<span>Invite</span></a>
      <a class="tab ${activeTab==='profile'?'active':''}" href="profile.html">👤<span>Aku</span></a>
    </nav>`;document.body.append(tabbar);
  document.getElementById('langSel').value=getLang();document.getElementById('themeSel').value=getTheme();
  document.getElementById('langSel').addEventListener('change',e=>{setLang(e.target.value);applyLang()})
  document.getElementById('themeSel').addEventListener('change',e=>{setTheme(e.target.value)})
  document.getElementById('logoutBtn').addEventListener('click',()=>{localStorage.removeItem('authed');location.href='../login.html'})
  const modal=document.createElement('div');modal.className='modal';modal.id='notifModal';modal.innerHTML=`<div class="panel"><h3 id="notifTitle">Notifikasi</h3><div class="list" id="notifList"></div><div style="text-align:right;margin-top:12px"><button class="pill" id="closeNotif">Tutup</button></div></div>`;document.body.append(modal);
  document.getElementById('btnNotif').addEventListener('click',()=>modal.classList.add('open'));document.getElementById('closeNotif').addEventListener('click',()=>modal.classList.remove('open'))
  document.getElementById('notifList').innerHTML=['Promo biaya tarik 2% minggu ini.','Sistem maintenance Kamis 02:00-03:00.'].map(t=>`<div class="item">${t}</div>`).join('')
  applyLang()
}
function applyLang(){const L=I18N[getLang()];if(!L)return;const brand=L.brand.replace('\n','<br>');const el=document.getElementById('brand');if(el)el.innerHTML=brand;const nt=document.getElementById('notifTitle');if(nt)nt.textContent=L.notifTitle;document.querySelectorAll('[data-i18n]').forEach(e=>{const k=e.getAttribute('data-i18n');if(L[k]) e.textContent=L[k]})}
