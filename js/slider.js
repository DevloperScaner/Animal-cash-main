// Basic auto slider + dots
(function(){
  const root = document.getElementById('heroSlider');
  if(!root) return;
  const viewport = root.querySelector('.slides');
  const slides = [...root.querySelectorAll('.slide')];
  const dotsWrap = document.getElementById('sliderDots');
  let idx = 0, timer;

  function go(i){
    idx = (i+slides.length) % slides.length;
    viewport.style.transform = `translateX(${-idx*100}%)`;
    [...dotsWrap.children].forEach((d,k)=>d.classList.toggle('active', k===idx));
  }
  function next(){ go(idx+1); }
  slides.forEach((_,i)=>{
    const dot = document.createElement('button');
    dot.className='dot'; dot.setAttribute('role','tab'); dot.addEventListener('click',()=>go(i));
    dotsWrap.appendChild(dot);
  });
  go(0);
  function play(){ timer = setInterval(next, 4000); }
  function stop(){ clearInterval(timer); }
  root.addEventListener('pointerenter', stop);
  root.addEventListener('pointerleave', play);
  play();
})();
