
import { auth, db } from './firebase-init.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { collection, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

const nf = new Intl.NumberFormat('id-ID');

const banners = [
  { title:'Fish — Bonus 10%', subtitle:'Panen cepat' },
  { title:'Buffalo — Bonus 12%', subtitle:'Tahan banting' },
  { title:'Sheep — Bonus 15%', subtitle:'Stabil & aman' }
];
let idx=0;
function renderBanner(){
  const el = document.getElementById('bannerTitle'); const dots = document.getElementById('bannerDots');
  el.textContent = banners[idx].title; dots.innerHTML = banners.map((_,i)=>`<span class="${i===idx?'active':''}"></span>`).join('');
  idx=(idx+1)%banners.length;
}
setInterval(renderBanner, 3000); renderBanner();

onAuthStateChanged(auth, async (u)=>{
  if(!u){ location.href='index.html'; return; }
  localStorage.setItem('uid', u.uid);
  // contoh total aset dari holdings user (price dijumlah)
  let total=0, qty=0;
  try{
    const snap = await getDocs(query(collection(db,'orders'), where('uid','==',u.uid), where('status','==','approved')));
    snap.forEach(d=>{ const x=d.data(); total += Number(x.price||0); qty += Number(x.price||0); });
  }catch(_){}
  document.getElementById('totalAsset').textContent = 'Rp ' + nf.format(total);
  document.getElementById('qtyAsset').textContent = 'Rp ' + nf.format(qty);
});
