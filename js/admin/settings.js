
import { db } from '../firebase-init.js';
import { doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
window.renderAdminSettings = async function(){
  const el=document.getElementById('adminView'); const ref=doc(db,'appSettings','_root'); const snap=await getDoc(ref);
  const s = snap.exists()? snap.data(): { withdraw:{min:50000, fee:3000, maxPerDay:1}, loading:{durationMs:10000, mode:'fixed'}, theme:{default:'system', accent:'#59d1ff', seasonalActive:false, seasonalName:''} };
  el.innerHTML=`<section class='card'><h3>Settings</h3>
    <h4>Withdraw</h4>
    <div class='form'><input class='input' id='min' type='number' value='${s.withdraw.min||50000}' placeholder='Min (Rp)'><input class='input' id='fee' type='number' value='${s.withdraw.fee||3000}' placeholder='Fee (Rp)'><input class='input' id='max' type='number' value='${s.withdraw.maxPerDay||1}' placeholder='Max per day'></div>
    <h4 style='margin-top:12px'>Loading Screen</h4>
    <div class='form'><input class='input' id='dur' type='number' value='${s.loading.durationMs||10000}' placeholder='Durasi (ms)'><select class='input' id='mode'><option value='fixed' ${s.loading.mode==='fixed'?'selected':''}>Fixed</option><option value='auto' ${s.loading.mode==='auto'?'selected':''}>Auto-ready</option></select></div>
    <h4 style='margin-top:12px'>Theme</h4>
    <div class='form'><select class='input' id='def'><option value='system' ${s.theme.default==='system'?'selected':''}>Ikuti Sistem</option><option value='light' ${s.theme.default==='light'?'selected':''}>Terang</option><option value='dark' ${s.theme.default==='dark'?'selected':''}>Gelap</option></select><input class='input' id='accent' value='${s.theme.accent||'#59d1ff'}' placeholder='Accent hex'><label class='selector opt'><input type='checkbox' id='seasonal' ${s.theme.seasonalActive?'checked':''}> Seasonal Active</label><input class='input' id='sname' value='${s.theme.seasonalName||''}' placeholder='Nama Seasonal (mis. Ramadan)'></div>
    <div style='margin-top:12px'><button class='btn' id='save'>Simpan</button></div></section>`;
  el.querySelector('#save')?.addEventListener('click', async ()=>{
    const payload={ withdraw:{ min:parseInt(el.querySelector('#min').value||'50000',10), fee:parseInt(el.querySelector('#fee').value||'3000',10), maxPerDay:parseInt(el.querySelector('#max').value||'1',10) }, loading:{ durationMs:parseInt(el.querySelector('#dur').value||'10000',10), mode:el.querySelector('#mode').value }, theme:{ default:el.querySelector('#def').value, accent:el.querySelector('#accent').value||'#59d1ff', seasonalActive:el.querySelector('#seasonal').checked, seasonalName:el.querySelector('#sname').value||'' } };
    await setDoc(ref,payload,{merge:true}); alert('Settings disimpan');
  });
};
