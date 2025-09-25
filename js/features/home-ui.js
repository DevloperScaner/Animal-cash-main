let heroIdx = 0;
const slides = document.getElementById('slides');
const dotsWrap = document.getElementById('heroDots');
function heroGo(i){
  if(!slides || !dotsWrap) return;
  heroIdx = (i % slides.children.length + slides.children.length) % slides.children.length;
  slides.style.transform = `translateX(-${heroIdx*100}%)`;
  [...dotsWrap.children].forEach((d,idx)=>d.classList.toggle('active', idx===heroIdx));
}
heroGo(0);
setInterval(()=>heroGo(heroIdx+1), 3000);
document.getElementById('notifBtn')?.addEventListener('click', ()=>{
  if (window.App?.toast) App.toast('Tidak ada notifikasi baru');
  else alert('Tidak ada notifikasi baru');
});
document.getElementById('langBtn')?.addEventListener('click', ()=>{
  const langs = [['id','Bahasa Indonesia'],['en','English'],['ms','Melayu'],['ar','العربية'],['hi','हिन्दी'],['th','ไทย'],['vi','Tiếng Việt']];
  const choice = prompt('Pilih bahasa:\n' + langs.map(([c,n])=>`${c} — ${n}`).join('\n') + '\n\nKetik kode (mis: id, en)');
  if(choice){
    localStorage.setItem('lang', choice.trim().toLowerCase());
    location.reload();
  }
});
