
function makeHeroSlider(root){
  const track=root.querySelector('.hero-track');const dots=root.querySelectorAll('.dot');let i=0,n=track.children.length;
  function go(k){i=(k+n)%n;track.style.transform=`translateX(-${i*100}%)`;dots.forEach((d,idx)=>d.classList.toggle('active',idx===i))}
  let t=setInterval(()=>go(i+1),4000);root.addEventListener('mouseenter',()=>clearInterval(t));root.addEventListener('mouseleave',()=>t=setInterval(()=>go(i+1),4000));dots.forEach((d,idx)=>d.addEventListener('click',()=>go(idx)));go(0)
}
function makeGridSwiper(root){
  const track=root.querySelector('.grid-track');const dots=root.querySelectorAll('.grid-dot');let i=0,n=track.children.length;let sx=0,cx=0,down=false;
  function go(k){i=(k+n)%n;track.style.transform=`translateX(-${i*100}%)`;dots.forEach((d,idx)=>d.classList.toggle('active',idx===i))}
  root.addEventListener('touchstart',e=>{down=true;sx=e.touches[0].clientX})
  root.addEventListener('touchmove',e=>{if(!down)return;cx=e.touches[0].clientX})
  root.addEventListener('touchend',()=>{if(!down)return;down=false;if(cx-sx>40)go(i-1);else if(sx-cx>40)go(i+1)})
  dots.forEach((d,idx)=>d.addEventListener('click',()=>go(idx)));go(0)
}
