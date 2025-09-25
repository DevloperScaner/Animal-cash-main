
import { App, auth, db } from '../firebase-init.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { addDoc, collection, serverTimestamp, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
import { cloudinary } from '../config.js';

const MARKET=[
 {id:'cow',name:'COW',price:160000,daily:17000,total:1530000,cycleDays:90,img:'img/cow.png'},
 {id:'chicken',name:'CHICKEN',price:90000,daily:6000,total:360000,cycleDays:60,img:'img/chicken.png'},
 {id:'fish',name:'FISH',price:120000,daily:9000,total:540000,cycleDays:60,img:'img/fish.png'},
 {id:'goat',name:'GOAT',price:140000,daily:12000,total:960000,cycleDays:80,img:'img/goat.png'},
 {id:'duck',name:'DUCK',price:100000,daily:7000,total:420000,cycleDays:60,img:'img/duck.png'},
 {id:'buffalo',name:'BUFFALO',price:180000,daily:20000,total:1800000,cycleDays:90,img:'img/buffalo.png'}
];
const fmt=(n)=>new Intl.NumberFormat('id-ID').format(n);
const list=document.getElementById('marketList');
function render(){ list.innerHTML=''; MARKET.forEach(p=>{ const el=document.createElement('div'); el.className='card'; el.innerHTML=`
  <div style="display:flex;gap:12px;align-items:center">
    <img src="${p.img}" alt="${p.name}" style="width:56px;height:56px;border-radius:12px;object-fit:contain;background:#0002">
    <div><div style="font-weight:800">${p.name}</div><div class="small">Harga: <b>Rp ${fmt(p.price)}</b></div></div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px">
    <div><div class="small">Harian</div><div>Rp ${fmt(p.daily)}</div></div>
    <div><div class="small">Total</div><div>Rp ${fmt(p.total)}</div></div>
    <div><div class="small">Siklus</div><div>${p.cycleDays} hari</div></div>
  </div>
  <div style="display:flex;justify-content:flex-end"><button class="btn" data-buy="${p.id}">Beli</button></div>`; list.appendChild(el); }); }
render();
const modal=document.getElementById('buyModal'); const desc=document.getElementById('mDesc'); const fileEl=document.getElementById('proofFile'); const mPay=document.getElementById('mPay'); const mClose=document.getElementById('mClose');
let P=null,U=null;
function open(p){ P=p; fileEl.value=''; desc.innerHTML=`Pesanan: <b>${p.name}</b> — Harga <b>Rp ${fmt(p.price)}</b>`; modal.style.display='block'; }
function close(){ modal.style.display='none'; P=null; }
mClose?.addEventListener('click', close);
list?.addEventListener('click', (e)=>{ const b=e.target.closest('button[data-buy]'); if(!b)return; const p=MARKET.find(x=>x.id===b.dataset.buy); if(p) open(p); });
async function uploadProof(file){ const url=`https://api.cloudinary.com/v1_1/${cloudinary.cloudName}/image/upload`; const fd=new FormData(); fd.append('file',file); fd.append('upload_preset', cloudinary.uploadPreset); const r=await fetch(url,{method:'POST',body:fd}); if(!r.ok) throw new Error('Upload gagal'); const j=await r.json(); return j.secure_url; }
mPay?.addEventListener('click', async ()=>{ try{ if(!U||!P) return; const file=fileEl.files?.[0]; if(!file){ App.toast('Pilih gambar bukti'); return; } mPay.disabled=true; mPay.textContent='Mengunggah...'; const proofUrl = await uploadProof(file); await addDoc(collection(db,'orders'),{ uid:U.uid, productId:P.id, productName:P.name, price:P.price, dailyIncome:P.daily, totalIncome:P.total, cycleDays:P.cycleDays, proofUrl, status:'pending', createdAt:serverTimestamp() }); App.toast('Bukti terkirim. Menunggu verifikasi admin.'); close(); }catch(err){ App.toast(err.message||'Gagal'); } finally{ mPay.disabled=false; mPay.textContent='Kirim Bukti'; } });
onAuthStateChanged(auth, async (u)=>{ if(!u){location.href='index.html';return;} U=u; disableOwned(u); });
async function disableOwned(u){ const snap = await getDocs(collection(db,'users',u.uid,'holdings')); const active = new Set(); snap.forEach(d=>{ const x=d.data(); if(x.status==='active') active.add(x.productId); }); document.querySelectorAll('button[data-buy]').forEach(b=>{ if(active.has(b.dataset.buy)){ b.disabled = true; b.textContent='Terkunci'; } }); }
