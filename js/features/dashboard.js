
import { guardPage } from '../guard.js';
guardPage(u=>{
  document.querySelectorAll('.tabbar a')[0]?.classList.add('active');
  const slides = document.getElementById('homeSlides');
  const dots = document.querySelectorAll('.dots .dot');
  let i=0; setInterval(()=>{ i=(i+1)%3; slides.style.transform=`translateX(-${i*100}%)`; dots.forEach((d,idx)=>d.classList.toggle('active', idx===i)); }, 3000);
});
