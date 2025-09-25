
window.App = (function(){
  const toast = (msg)=>{
    const el = document.getElementById('toast');
    if(!el) return;
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(()=>el.classList.remove('show'), 2000);
  };

  const money = (n)=> (new Intl.NumberFormat('id-ID')).format(Number(n||0));

  // fake stats to keep UI not empty
  const setStats = ({total=0, q=0}={})=>{
    const t = document.getElementById('totalAsset');
    const ts = document.getElementById('totalAssetSub');
    const qv = document.getElementById('qBalance');
    const qs = document.getElementById('qBalanceSub');
    if(t) t.textContent = money(total);
    if(ts) ts.textContent = money(total);
    if(qv) qv.textContent = money(q);
    if(qs) qs.textContent = money(q);
  };

  const i18n = {
    set(lang){
      localStorage.setItem('ac.lang', lang);
      App.toast('Bahasa: '+lang);
      // place to translate later
    },
    get(){return localStorage.getItem('ac.lang')||'id'}
  };

  return {toast, money, setStats, i18n};
})();
