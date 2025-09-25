
import { db } from '../firebase-init.js';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, getDocs, deleteDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

const root = document.getElementById('root');
const nf = new Intl.NumberFormat('id-ID');
const el = (t,a={},h='')=>{ const e=document.createElement(t); for(const k in a) e.setAttribute(k,a[k]); e.innerHTML=h; return e; };
const field = (l,inp)=>{ const d=el('div',{class:'field'}); d.append(el('label',{class:'label'},l)); d.append(inp); return d; };
const row = (...cs)=>{ const r=el('div',{class:'row'}); cs.forEach(c=>r.append(c)); return r; };
const grid = (...cs)=>{ const g=el('div',{class:'grid-2'}); cs.forEach(c=>g.append(c)); return g; };

async function load(path, fallback){ const s=await getDoc(doc(db,...path.split('/'))); return s.exists()?s.data():fallback; }
async function save(path, data){ await setDoc(doc(db,...path.split('/')), data, {merge:true}); }

async function paneTheme(){
  const d = await load('settings/theme', { default:'dark', allowSwitch:true });
  const sel = el('select'); ['system','light','dark'].forEach(v=>{ const o=el('option',{},v); o.value=v; if(d.default===v) o.selected=true; sel.append(o); });
  const allow = el('select'); [['true','Izinkan user ganti'],['false','Kunci']].forEach(([v,t])=>{ const o=el('option',{},t); o.value=v; if(String(d.allowSwitch)===v) o.selected=true; allow.append(o); });
  const saveBtn = el('button',{class:'btn green'},'Simpan');
  saveBtn.onclick = async ()=>{ await save('settings/theme', { default:sel.value, allowSwitch: allow.value==='true', updatedAt: serverTimestamp() }); alert('Tersimpan'); };
  const c = el('div'); c.append(el('h3',{},'Tema'), grid(field('Default', sel), field('Kebijakan', allow)), saveBtn); return c;
}

async function paneBroadcast(){
  const d = await load('settings/broadcast', { active:false, title:'', message:'' });
  const title = el('input',{class:'input',value:d.title||''});
  const msg = el('textarea',{rows:'3'}, d.message||'');
  const active = el('select'); [['true','Aktif'],['false','Non-aktif']].forEach(([v,t])=>{ const o=el('option',{},t); o.value=v; if(String(d.active)===v) o.selected=true; active.append(o); });
  const saveBtn=el('button',{class:'btn green'},'Simpan');
  saveBtn.onclick = async ()=>{ await save('settings/broadcast', { title:title.value, message:msg.value, active:active.value==='true', updatedAt: serverTimestamp() }); alert('Tersimpan'); };
  const c = el('div'); c.append(el('h3',{},'Broadcast'), grid(field('Judul',title),field('Status',active)), field('Pesan', msg), saveBtn); return c;
}

async function paneWithdraw(){
  const d = await load('settings/withdraw', { minAmount:50000, dailyLimit:1, fee:3000, ewallet:['Dana','OVO','GoPay'], banks:['BCA','BRI','BNI','Mandiri'] });
  const min = el('input',{type:'number',class:'input',value:d.minAmount});
  const limit = el('input',{type:'number',class:'input',value:d.dailyLimit});
  const fee = el('input',{type:'number',class:'input',value:d.fee});
  const ewallet = el('input',{class:'input',value:(d.ewallet||[]).join(', ')});
  const banks = el('input',{class:'input',value:(d.banks||[]).join(', ')});
  const saveBtn=el('button',{class:'btn green'},'Simpan');
  saveBtn.onclick = async ()=>{
    await save('settings/withdraw', { minAmount:Number(min.value), dailyLimit:Number(limit.value), fee:Number(fee.value),
      ewallet: ewallet.value.split(',').map(x=>x.trim()).filter(Boolean),
      banks: banks.value.split(',').map(x=>x.trim()).filter(Boolean), updatedAt: serverTimestamp() });
    alert('Tersimpan');
  };
  const c = el('div'); c.append(el('h3',{},'Penarikan'), grid(field('Minimal (Rp)',min),field('Batas harian (x)',limit)), grid(field('Biaya admin (Rp)',fee), field('E-wallet', ewallet)), field('Bank', banks), saveBtn); return c;
}

async function paneBanners(){
  const wrap = el('div'); wrap.append(el('h3',{},'Banner'));
  const list = el('div',{class:'table big'},'<table class="wide"><thead><tr><th>Urut</th><th>Judul</th><th>Subjudul</th><th>Bonus</th><th>Gambar</th><th>Status</th><th>Aksi</th></tr></thead><tbody id="rows"></tbody></table>');
  const rows = list.querySelector('#rows');
  (await getDocs(collection(db,'banners'))).forEach(d=>{
    const x=d.data();
    rows.insertAdjacentHTML('beforeend', `<tr data-id="${d.id}"><td>${x.order||0}</td><td>${x.title||''}</td><td>${x.subtitle||''}</td><td>${x.bonus||''}</td><td>${x.imageUrl?`<a class='btn small' target='_blank' href='${x.imageUrl}'>Lihat</a>`:'-'}</td><td>${x.active? 'Aktif':'-'}</td><td><button class='btn small' data-act='edit'>Edit</button><button class='btn small red' data-act='del'>Hapus</button></td></tr>`);
  });
  const form = el('div'); form.innerHTML = `<div class="grid-2">
  <div class="field"><label class="label">Urut</label><input id="bo" class="input" type="number" value="0"/></div>
  <div class="field"><label class="label">Judul</label><input id="bt" class="input"/></div>
  <div class="field"><label class="label">Subjudul</label><input id="bs" class="input"/></div>
  <div class="field"><label class="label">Bonus</label><input id="bb" class="input"/></div>
  <div class="field"><label class="label">Gambar URL</label><input id="bi" class="input"/></div>
  <div class="field"><label class="label">Status</label><select id="ba" class="input"><option value="true">Aktif</option><option value="false">Non-aktif</option></select></div></div>
  <button class="btn green" id="saveB">Simpan</button>`;

  rows.addEventListener('click', async (e)=>{
    const b = e.target.closest('button[data-act]'); if(!b) return;
    const tr = b.closest('tr'); const id = tr.dataset.id;
    if(b.dataset.act==='del'){ await deleteDoc(doc(db,'banners',id)); tr.remove(); }
    if(b.dataset.act==='edit'){ const x=(await getDoc(doc(db,'banners',id))).data(); form.dataset.id=id; form.querySelector('#bo').value=x.order||0; form.querySelector('#bt').value=x.title||''; form.querySelector('#bs').value=x.subtitle||''; form.querySelector('#bb').value=x.bonus||''; form.querySelector('#bi').value=x.imageUrl||''; form.querySelector('#ba').value=String(!!x.active); }
  });
  form.querySelector('#saveB').onclick = async ()=>{
    const payload = { order:Number(form.querySelector('#bo').value||0), title:form.querySelector('#bt').value, subtitle:form.querySelector('#bs').value, bonus:form.querySelector('#bb').value, imageUrl:form.querySelector('#bi').value, active: form.querySelector('#ba').value==='true', updatedAt: serverTimestamp() };
    if(form.dataset.id){ await updateDoc(doc(db,'banners', form.dataset.id), payload); } else { await addDoc(collection(db,'banners'), payload); }
    location.reload();
  };
  wrap.append(list, form); return wrap;
}

async function paneProducts(){
  const wrap = el('div'); wrap.append(el('h3',{},'Produk Ternak'));
  const list = el('div',{class:'table big'},'<table class="wide"><thead><tr><th>Nama</th><th>Harga</th><th>Siklus</th><th>Pendapatan/Hari</th><th>Total</th><th>Status</th><th>Aksi</th></tr></thead><tbody id="rows"></tbody></table>');
  const rows = list.querySelector('#rows');
  (await getDocs(collection(db,'products'))).forEach(d=>{
    const x=d.data();
    rows.insertAdjacentHTML('beforeend', `<tr data-id="${d.id}"><td>${x.name||''}</td><td>Rp ${nf.format(x.price||0)}</td><td>${x.cycleDays||0}</td><td>Rp ${nf.format(x.dailyIncome||0)}</td><td>Rp ${nf.format(x.totalIncome||0)}</td><td>${x.active?'Aktif':'-'}</td><td><button class='btn small' data-act='edit'>Edit</button><button class='btn small red' data-act='del'>Hapus</button></td></tr>`);
  });
  const form = el('div'); form.innerHTML = `<div class="grid-2">
  <div class="field"><label class="label">Nama</label><input id="pn" class="input"/></div>
  <div class="field"><label class="label">Harga</label><input id="pp" class="input" type="number"/></div>
  <div class="field"><label class="label">Siklus (hari)</label><input id="pc" class="input" type="number"/></div>
  <div class="field"><label class="label">Pendapatan/Hari</label><input id="pd" class="input" type="number"/></div>
  <div class="field"><label class="label">Total Pendapatan</label><input id="pt" class="input" type="number"/></div>
  <div class="field"><label class="label">Status</label><select id="pa" class="input"><option value="true">Aktif</option><option value="false">Non-aktif</option></select></div></div>
  <button class="btn green" id="saveP">Simpan</button>`;

  rows.addEventListener('click', async (e)=>{
    const b = e.target.closest('button[data-act]'); if(!b) return;
    const id = b.closest('tr').dataset.id;
    if(b.dataset.act==='del'){ await deleteDoc(doc(db,'products', id)); b.closest('tr').remove(); }
    if(b.dataset.act==='edit'){ const x=(await getDoc(doc(db,'products',id))).data(); form.dataset.id=id; form.querySelector('#pn').value=x.name||''; form.querySelector('#pp').value=x.price||0; form.querySelector('#pc').value=x.cycleDays||0; form.querySelector('#pd').value=x.dailyIncome||0; form.querySelector('#pt').value=x.totalIncome||0; form.querySelector('#pa').value=String(!!x.active); }
  });
  form.querySelector('#saveP').onclick = async ()=>{
    const payload = { name: form.querySelector('#pn').value, price:Number(form.querySelector('#pp').value||0), cycleDays:Number(form.querySelector('#pc').value||0), dailyIncome:Number(form.querySelector('#pd').value||0), totalIncome:Number(form.querySelector('#pt').value||0), active: form.querySelector('#pa').value==='true', updatedAt: serverTimestamp() };
    if(form.dataset.id){ await updateDoc(doc(db,'products', form.dataset.id), payload); } else { await addDoc(collection(db,'products'), payload); }
    location.reload();
  };
  wrap.append(list, form); return wrap;
}

async function renderSettings(){
  const tabs = el('div',{class:'row'},`
    <button class="btn" data-s="theme">Tema</button>
    <button class="btn" data-s="broadcast">Broadcast</button>
    <button class="btn" data-s="banners">Banner</button>
    <button class="btn" data-s="withdraw">Penarikan</button>
    <button class="btn" data-s="products">Produk Ternak</button>`);
  const pane = el('div'); root.replaceChildren(tabs, pane);
  async function pick(x){ pane.innerHTML='Memuat…'; if(x==='theme') pane.replaceChildren(await paneTheme()); if(x==='broadcast') pane.replaceChildren(await paneBroadcast()); if(x==='banners') pane.replaceChildren(await paneBanners()); if(x==='withdraw') pane.replaceChildren(await paneWithdraw()); if(x==='products') pane.replaceChildren(await paneProducts()); }
  tabs.addEventListener('click',(e)=>{ const b=e.target.closest('[data-s]'); if(b) pick(b.dataset.s); });
  pick('theme');
}
renderSettings();
