// Hero slider auto
(function(){
  const track = document.querySelector('.hero-track');
  const slides = track?.children || [];
  const dots = document.querySelector('#heroDots');
  if(!track || !slides.length) return;
  let idx = 0;
  // dots
  for(let i=0;i<slides.length;i++){
    const b=document.createElement('button');
    if(i===0) b.classList.add('active');
    b.addEventListener('click',()=>go(i,true));
    dots.appendChild(b);
  }
  function go(i, user=false){
    idx = (i+slides.length)%slides.length;
    track.style.transform = `translateX(${-idx*100}%)`;
    [...dots.children].forEach((d,di)=>d.classList.toggle('active', di===idx));
  }
  setInterval(()=> go(idx+1), 3800);
})();

// Swipe grid 3x3 (2 halaman)
(function(){
  const viewport = document.querySelector('.viewport');
  const track = document.querySelector('.track');
  const pages = document.querySelectorAll('.page');
  const dots = document.querySelector('#gridDots');
  if(!viewport || !track) return;
  let p=0, startX=0, drag=false;
  // dots
  for(let i=0;i<pages.length;i++){
    const b=document.createElement('button');
    if(i===0) b.classList.add('active');
    b.addEventListener('click',()=>go(i,true));
    dots.appendChild(b);
  }
  function go(i, user=false){
    p = Math.min(Math.max(i,0), pages.length-1);
    track.style.transition = user ? 'transform .25s ease' : 'transform 0s';
    track.style.transform = `translateX(${-p*100}%)`;
    [...dots.children].forEach((d,di)=>d.classList.toggle('active', di===p));
  }
  viewport.addEventListener('pointerdown',e=>{drag=true;startX=e.clientX;viewport.setPointerCapture(e.pointerId);track.style.transition='none';});
  viewport.addEventListener('pointermove',e=>{
    if(!drag) return;
    const dx = e.clientX - startX;
    const perc = dx/viewport.clientWidth*100;
    track.style.transform = `translateX(${perc - p*100}%)`;
  });
  viewport.addEventListener('pointerup',e=>{
    if(!drag) return; drag=false;
    const dx = e.clientX - startX;
    if(Math.abs(dx) > viewport.clientWidth*0.18) go(p + (dx<0?1:-1), true);
    else go(p, true);
  });
})();

// Auth guard: Home cuma untuk user login
(function(){
  if(!window.FB) return;
  FB.auth.onAuthStateChanged(u=>{
    if(!u){ location.href = "login.html"; }
  });
})();