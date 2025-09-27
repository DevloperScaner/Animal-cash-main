// Theme
(function(){
  const html = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', saved);
  btn.addEventListener('click', ()=>{
    const now = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', now);
    localStorage.setItem('theme', now);
  });
})();

// Language
(function(){
  const select = document.getElementById('langSelect');
  const saved = localStorage.getItem('lang') || 'id';
  select.value = saved;
  function apply(lang){
    const dict = window.I18N[lang] || window.I18N.id;
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      if(dict[key]) el.textContent = dict[key];
    });
  }
  select.addEventListener('change', ()=>{
    localStorage.setItem('lang', select.value);
    apply(select.value);
  });
  apply(saved);
})();

// Logout
document.getElementById('logoutBtn').addEventListener('click', ()=>{
  localStorage.removeItem('auth');
  window.location.href = 'login.html';
});

// Notifications (demo modal)
(function(){
  const notifBtn = document.getElementById('btnNotif');
  const modal = document.getElementById('notifModal');
  const list = document.getElementById('notifList');
  const count = document.getElementById('notifCount');
  const data = JSON.parse(localStorage.getItem('notifs')||'[]');
  // seed demo notifs once
  if(data.length===0){
    data.push({t: Date.now(), m: '🎉 Selamat datang di Peternakan Hewan!'});
    data.push({t: Date.now()-86400000, m: 'ℹ️ Jadwal maintenance hari Minggu 02.00-03.00.'});
    localStorage.setItem('notifs', JSON.stringify(data));
  }
  count.textContent = String(data.length);
  function open(){
    modal.setAttribute('aria-hidden','false');
    list.innerHTML = data.map(n=>`<div class="note">${new Date(n.t).toLocaleString()} — ${n.m}</div>`).join('');
  }
  function close(){modal.setAttribute('aria-hidden','true');}
  notifBtn.addEventListener('click', open);
  modal.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click', close));
})();

// Menu grid 3x3 with swipe pages
(function(){
  const menu = [
    {icon:'💳', label:{id:'Menarik', en:'Withdraw'}, href:'#withdraw'},
    {icon:'💬', label:{id:'Contact', en:'Contact'}, href:'#contact'},
    {icon:'👥', label:{id:'Tim', en:'Team'}, href:'#team'},
    {icon:'✉️', label:{id:'Mengundang', en:'Invite'}, href:'#invite'},
    {icon:'📰', label:{id:'Berita', en:'News'}, href:'#news'},
    {icon:'📈', label:{id:'Ringkasan', en:'Summary'}, href:'#summary'},
    {icon:'📋', label:{id:'Pusat Tugas', en:'Task Center'}, href:'#tasks'},
    {icon:'🔧', label:{id:'Admin', en:'Admin'}, href:'#admin', admin:true},
    {icon:'🎁', label:{id:'Bonus', en:'Bonus'}, href:'#bonus'},
    {icon:'🧾', label:{id:'Aktivitas', en:'Activity'}, href:'#activity'},
    {icon:'📞', label:{id:'Bantuan', en:'Support'}, href:'#support'},
    {icon:'⚙️', label:{id:'Pengaturan', en:'Settings'}, href:'#settings'}
  ];
  const isAdmin = localStorage.getItem('role') === 'admin'; // demo role switch
  const items = menu.filter(it=>!it.admin || isAdmin);
  const perPage = 9;
  const pages = [];
  for(let i=0;i<items.length;i+=perPage){ pages.push(items.slice(i,i+perPage)); }
  const pagesWrap = document.getElementById('menuPages');
  const dots = document.getElementById('menuDots');
  const lang = localStorage.getItem('lang')||'id';

  function makeItem(it){
    const div = document.createElement('a');
    div.className = 'grid-item';
    div.href = it.href;
    div.innerHTML = `<div class="icon">${it.icon}</div><div>${it.label[lang]||it.label.id}</div>`;
    div.addEventListener('click', ()=>{div.classList.add('glow'); setTimeout(()=>div.classList.remove('glow'), 450);});
    return div;
  }
  pages.forEach((pg,pi)=>{
    const page = document.createElement('div');
    page.className='grid-page';
    pg.forEach(it=> page.appendChild(makeItem(it)));
    pagesWrap.appendChild(page);
    const d = document.createElement('button'); d.className='dot'; if(pi===0) d.classList.add('active');
    d.addEventListener('click', ()=>{
      pagesWrap.scrollTo({left: pi*pagesWrap.clientWidth, behavior:'smooth'});
    });
    dots.appendChild(d);
  });

  // sync dots on scroll
  function onScroll(){
    const w = pagesWrap.clientWidth;
    const idx = Math.round(pagesWrap.scrollLeft / Math.max(1,w));
    [...dots.children].forEach((d,i)=>d.classList.toggle('active', i===idx));
  }
  pagesWrap.addEventListener('scroll', ()=>{
    clearTimeout(pagesWrap._t);
    pagesWrap._t = setTimeout(onScroll, 50);
  });
})();
