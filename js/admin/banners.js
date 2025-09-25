
import { db } from '../firebase-init.js';
import { collection, query, orderBy, getDocs, addDoc, updateDoc, doc, serverTimestamp, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
window.renderAdminBanners = async function(){
  const el=document.getElementById('adminView');
  el.innerHTML=`<section class='card'><h3>Banners & Promo</h3>
    <form id='fAdd' class='form'>
      <input class='input' id='title' placeholder='Judul' required>
      <input class='input' id='subtitle' placeholder='Bonus/Subjudul'>
      <input class='input' id='img' placeholder='URL Gambar (atau pakai /img/xxx.png)'>
      <label class='selector opt'><input type='checkbox' id='active' checked> Aktif</label>
      <button class='btn' type='submit'>Tambah Banner</button>
    </form>
    <table id='tBan' style='margin-top:12px'><thead><tr><th>Judul</th><th>Gambar</th><th>Aktif</th><th>Aksi</th></tr></thead><tbody></tbody></table>
  </section>`;
  const tb=el.querySelector('#tBan tbody');
  const qy=query(collection(db,'banners'), orderBy('createdAt','desc'));
  const snap=await getDocs(qy); tb.innerHTML='';
  for(const d of snap.docs){ const x=d.data(); const tr=document.createElement('tr'); tr.innerHTML=`<td>${x.title||'-'}<div class='small'>${x.subtitle||''}</div></td><td><code>${x.img||''}</code></td><td>${x.active? 'Ya':'Tidak'}</td><td><button class='btn' data-toggle='${d.id}'>Toggle</button> <button class='btn red' data-del='${d.id}'>Hapus</button></td>`; tb.appendChild(tr); }
  el.querySelector('#fAdd')?.addEventListener('submit', async (e)=>{
    e.preventDefault(); const title=el.querySelector('#title').value.trim(); const subtitle=el.querySelector('#subtitle').value.trim(); const img=el.querySelector('#img').value.trim(); const active=el.querySelector('#active').checked; await addDoc(collection(db,'banners'), { title, subtitle, img, active, createdAt: serverTimestamp() }); window.render('banners');
  });
  tb.addEventListener('click', async (e)=>{ const t=e.target.closest('button[data-toggle]'); const d=e.target.closest('button[data-del]'); if(t){ const id=t.dataset.toggle; const ref=doc(db,'banners',id); const s=await (await import('https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js')).getDoc(ref); if(s.exists()){ await updateDoc(ref, { active: !s.data().active }); } window.render('banners'); } if(d){ await deleteDoc(doc(db,'banners',d.dataset.del)); window.render('banners'); } });
};
