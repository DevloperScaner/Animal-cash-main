
;(() => {

  // ---- Utilities
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];

  // ---- Theme
  const themeToggle = $('#themeToggle');
  const applyTheme = (mode) => {
    document.body.classList.toggle('theme-light', mode === 'light');
    localStorage.setItem('theme', mode);
    themeToggle.textContent = mode === 'light' ? '🌞' : '🌗';
  };
  const initTheme = () => {
    const saved = localStorage.getItem('theme') || 'dark';
    applyTheme(saved);
  };
  themeToggle.addEventListener('click', () => {
    const next = document.body.classList.contains('theme-light') ? 'dark' : 'light';
    applyTheme(next);
  });
  initTheme();

  // ---- Lang
  const langSelect = $('#langSelect');
  const i18nMap = {
    id: {
      hero1_title: "Bonus Referral 5.000", hero1_sub: "Undang temanmu, bonus otomatis masuk saldo.",
      hero2_title: "Diskon Biaya Tarik", hero2_sub: "Biaya penarikan turun jadi 2% khusus minggu ini.",
      hero3_title: "Event Panen", hero3_sub: "Kumpulkan hadiah harian dari panenmu.",
      totalAsset: "Total Asset", quantAcc: "Akun Kuantitatif", activeHolding: "Holding Aktif",
      menu: "Menu",
      withdraw: "Menarik", contact: "Contact", team: "Tim", invite: "Mengundang",
      news: "Berita", summaryMenu: "Ringkasan", tasks: "Pusat Tugas", notifications: "Notifikasi",
      more: "Lainnya", promo: "Promo", leaderboard: "Leaderboard",
      settings: "Pengaturan", broadcast: "Broadcast", support: "Bantuan", guide: "Panduan", about: "Tentang"
    },
    en: {
      hero1_title: "Referral Bonus 5,000", hero1_sub: "Invite friends, bonus credited automatically.",
      hero2_title: "Withdraw Fee Discount", hero2_sub: "Withdrawal fee down to 2% this week.",
      hero3_title: "Harvest Event", hero3_sub: "Collect daily rewards from your farm.",
      totalAsset: "Total Assets", quantAcc: "Quantitative Account", activeHolding: "Active Holdings",
      menu: "Menu",
      withdraw: "Withdraw", contact: "Support", team: "Team", invite: "Invite",
      news: "News", summaryMenu: "Summary", tasks: "Task Center", notifications: "Notifications",
      more: "More", promo: "Promotions", leaderboard: "Leaderboard",
      settings: "Settings", broadcast: "Broadcast", support: "Help Center", guide: "Guide", about: "About"
    }
  };
  const applyLang = (code) => {
    const map = i18nMap[code] || i18nMap.id;
    // hero
    const slides = $$('#heroTrack .hero-slide');
    slides[0].querySelector('.hero-title').textContent = map.hero1_title;
    slides[0].querySelector('.hero-sub').textContent = map.hero1_sub;
    slides[1].querySelector('.hero-title').textContent = map.hero2_title;
    slides[1].querySelector('.hero-sub').textContent = map.hero2_sub;
    slides[2].querySelector('.hero-title').textContent = map.hero3_title;
    slides[2].querySelector('.hero-sub').textContent = map.hero3_sub;
    // texts
    $$('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (map[key]) el.textContent = map[key];
    });
    localStorage.setItem('lang', code);
  };
  const initLang = () => {
    const urlLang = new URLSearchParams(location.search).get('lang');
    const saved = urlLang || localStorage.getItem('lang') || 'id';
    langSelect.value = saved;
    applyLang(saved);
  };
  langSelect.addEventListener('change', () => applyLang(langSelect.value));
  initLang();

  // ---- Logout
  $('#btnLogout').addEventListener('click', () => {
    localStorage.removeItem('uid');
    localStorage.removeItem('role');
    location.href = 'login.html';
  });

  // ---- Notifications button (mock)
  $('#btnBell').addEventListener('click', () => {
    alert('Daftar notifikasi (mock) — nanti diarahkan ke halaman notif.');
  });

  // ---- Admin tile visibility
  const urlParams = new URLSearchParams(location.search);
  if (urlParams.get('admin') === '1') localStorage.setItem('role', 'admin');
  const isAdmin = (localStorage.getItem('role') === 'admin');
  if (!isAdmin) $$('.admin-only').forEach(el => el.style.display = 'none');

  // ---- Grid swiper
  const swiper = $('#gridSwiper');
  const pages = $('#gridPages');
  const pageCount = $$('.page', pages).length;
  let gridIndex = 0;
  const gridDots = $('#gridDots');
  const makeDots = (n) => {
    gridDots.innerHTML = '';
    for (let i=0;i<n;i++){
      const b = document.createElement('button');
      if (i===gridIndex) b.classList.add('active');
      b.addEventListener('click', () => go(i));
      gridDots.appendChild(b);
    }
  };
  const go = (idx) => {
    gridIndex = Math.max(0, Math.min(pageCount-1, idx));
    pages.style.transform = `translateX(-${gridIndex*100}%)`;
    [...gridDots.children].forEach((d,i)=>d.classList.toggle('active', i===gridIndex));
  };
  makeDots(pageCount); go(0);

  // touch handling
  let startX=0, curX=0, dragging=false;
  swiper.addEventListener('touchstart', e => {
    dragging=true; startX = curX = e.touches[0].clientX;
    pages.style.transition='none';
  }, {passive:true});
  swiper.addEventListener('touchmove', e => {
    if(!dragging) return;
    const x = e.touches[0].clientX;
    const dx = x - startX;
    const base = -gridIndex*window.innerWidth;
    pages.style.transform = `translateX(${base + dx}px)`;
    curX = x;
  }, {passive:true});
  const endDrag = () => {
    if(!dragging) return;
    pages.style.transition='transform .25s ease';
    const dx = curX - startX;
    if (Math.abs(dx) > 60) {
      go(gridIndex + (dx < 0 ? 1 : -1));
    } else {
      go(gridIndex);
    }
    dragging=false;
  };
  swiper.addEventListener('touchend', endDrag);
  swiper.addEventListener('touchcancel', endDrag);

  // glow effect on tiles
  $$('.tile').forEach(t => {
    t.addEventListener('click', () => {
      t.animate([{boxShadow:'0 0 0 0 rgba(110,168,254,.8)'},{boxShadow:'0 0 0 12px rgba(110,168,254,0)'}], {duration:400, easing:'ease-out'});
      // navigation mock
      const link = t.getAttribute('data-link') || '#';
      console.log('Navigate to', link);
    });
  });

  // ---- Hero slider auto
  const heroTrack = $('#heroTrack');
  const heroSlides = $$('#heroTrack .hero-slide');
  const heroDots = $('#heroDots');
  let hi = 0; const heroMakeDots = () => {
    heroDots.innerHTML = '';
    for(let i=0;i<heroSlides.length;i++){
      const b=document.createElement('button');
      if(i===hi) b.classList.add('active');
      b.addEventListener('click',()=>setHero(i));
      heroDots.appendChild(b);
    }
  };
  const setHero = (i) => {
    hi = (i + heroSlides.length) % heroSlides.length;
    heroTrack.style.transform = `translateX(-${hi*100}%)`;
    [...heroDots.children].forEach((d,idx)=>d.classList.toggle('active', idx===hi));
  };
  heroMakeDots(); setHero(0);
  setInterval(()=> setHero(hi+1), 4000);

})(); 
