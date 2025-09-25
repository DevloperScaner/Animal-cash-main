
// slider
(function(){
  const slides = document.getElementById('slides');
  const dotsWrap = document.getElementById('dots');
  if(!slides || !dotsWrap) return;
  const count = slides.children.length;
  let i=0, t=null;
  const update=()=>{
    slides.style.transform = `translateX(${-i*100}%)`;
    dotsWrap.querySelectorAll('button').forEach((b,idx)=>b.classList.toggle('active', idx===i));
  };
  for(let k=0;k<count;k++){
    const b=document.createElement('button');
    b.addEventListener('click', ()=>{i=k; update(); restart()});
    dotsWrap.appendChild(b);
  }
  const next=()=>{i=(i+1)%count; update()};
  const restart=()=>{clearInterval(t); t=setInterval(next, 3000)};
  update(); restart();
})();

// top actions
(function(){
  const btnLang = document.getElementById('btnLang');
  const menu = document.getElementById('langMenu');
  if(btnLang && menu){
    btnLang.addEventListener('click', ()=> menu.classList.toggle('show'));
    menu.querySelectorAll('li').forEach(li=> li.addEventListener('click', ()=>{
      App.i18n.set(li.dataset.lang);
      menu.classList.remove('show');
    }));
  }
  const btnNotif = document.getElementById('btnNotif');
  btnNotif && btnNotif.addEventListener('click', ()=> App.toast('Tidak ada notifikasi baru'));
})();

// seed UI values
App.setStats({total:0,q:0});
