const qs = (s, el=document)=>el.querySelector(s);
const qsa = (s, el=document)=>[...el.querySelectorAll(s)];
// Dialogs
function modal(id){ return qs(id); }
function openModal(m){ m?.showModal(); }
function closeModal(m){ m?.close(); }
// Theme toggle (instant)
function setTheme(t){ document.body.classList.toggle('light', t==='light'); localStorage.setItem('theme', t); }
setTheme(localStorage.getItem('theme')||'dark');
window.addEventListener('click', (e)=>{
  if(e.target.matches('[data-toggle=theme]')){
    const t = document.body.classList.contains('light') ? 'dark' : 'light';
    setTheme(t);
  }
});
// Language modal
window.addEventListener('click', (e)=>{
  if(e.target.matches('[data-open=lang]')) openModal(qs('#langDialog'));
  if(e.target.matches('[data-open=notif]')) openModal(qs('#notifDialog'));
  if(e.target.dataset.lang){
    localStorage.setItem('lang', e.target.dataset.lang);
    closeModal(qs('#langDialog'));
    alert('Bahasa diset: '+e.target.dataset.lang);
  }
});
// Spinner demo
function showSpinner(ms=1500){
  const ov = qs('#loading');
  ov?.classList.add('show');
  setTimeout(()=> ov?.classList.remove('show'), ms);
}