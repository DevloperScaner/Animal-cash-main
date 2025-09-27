const qs = (s, el=document)=>el.querySelector(s);
const qsa = (s, el=document)=>[...el.querySelectorAll(s)];

// Theme toggle (instant)
function setTheme(t){ document.body.classList.toggle('light', t==='light'); localStorage.setItem('theme', t); }
setTheme(localStorage.getItem('theme')||'dark');
document.addEventListener('click',(e)=>{
  if(e.target.closest('[data-toggle=theme]')){
    const t = document.body.classList.contains('light') ? 'dark' : 'light';
    setTheme(t);
  }
});

// Language + Notif dialogs
function openDialog(id){ qs(id)?.showModal(); }
document.addEventListener('click',(e)=>{
  if(e.target.closest('[data-open=lang]')) openDialog('#langDialog');
  if(e.target.closest('[data-open=notif]')) openDialog('#notifDialog');
  if(e.target.dataset.lang){
    localStorage.setItem('lang', e.target.dataset.lang);
    qs('#langDialog')?.close();
    // (nanti: i18n apply text)
  }
});

// Spinner
function showSpinner(ms=1500){
  const ov = qs('#loading');
  ov?.classList.add('show');
  setTimeout(()=> ov?.classList.remove('show'), ms);
}

// Firebase bootstrap
function initFirebase(){
  if(!window.firebase) return;
  if(!firebase.apps.length) firebase.initializeApp(window.firebaseConfig);
  return { auth: firebase.auth(), db: firebase.firestore() };
}
window.FB = initFirebase();