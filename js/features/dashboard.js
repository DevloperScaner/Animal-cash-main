
import { App, auth, db } from '../firebase-init.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { collection, getDocs, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

document.querySelectorAll('.tabbar a')[0]?.classList.add('active');
const slides = document.getElementById('homeSlides'); const dots = document.querySelectorAll('.dots .dot'); let i=0; setInterval(()=>{ i=(i+1)%3; slides.style.transform=`translateX(-${i*100}%)`; dots.forEach((d,idx)=>d.classList.toggle('active', idx===i)); }, 3000);
document.getElementById('tileLogout')?.addEventListener('click', (e)=>{ e.preventDefault(); App.signOutAll(); });
onAuthStateChanged(auth, async (u)=>{
  if(!u) { location.href='index.html'; return; }
  const f = new Intl.NumberFormat('id-ID');
  let assets = 0, quant = 0;
  try{
    const us = await getDoc(doc(db,'users',u.uid));
    if(us.exists()){ quant = us.data().wallet?.quantitative || 0; assets += us.data().wallet?.balance || 0; }
    const hs = await getDocs(collection(db,'users',u.uid,'holdings'));
    hs.forEach(d=>{ const x=d.data(); if(x.status==='active') assets += (x.price||0); });
  }catch(_){}
  document.getElementById('kpiAssets').textContent = 'Rp ' + f.format(assets);
  document.getElementById('kpiQuant').textContent  = 'Rp ' + f.format(quant);
});
