
import { db } from '../firebase-init.js';
import { collection, query, where, orderBy, getDocs, updateDoc, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
window.renderAdminReferrals = async function(){
  const el=document.getElementById('adminView');
  el.innerHTML=`<section class='card'><h3>Referral Bonus</h3><table id='tRef'><thead><tr><th>Tanggal</th><th>Referrer</th><th>Referred</th><th>Status</th><th>Nominal</th><th>Aksi</th></tr></thead><tbody></tbody></table></section>`;
  const tb=el.querySelector('#tRef tbody');
  const qy=query(collection(db,'referrals'), where('bonusStatus','==','pending'), orderBy('createdAt','desc'));
  const snap=await getDocs(qy); tb.innerHTML='';
  for(const d of snap.docs){ const x=d.data(); const t=x.createdAt?.toDate?x.createdAt.toDate().toLocaleString('id-ID'):'-';
    const tr=document.createElement('tr'); tr.innerHTML=`<td>${t}</td><td>${x.referrerUid}</td><td>${x.referredUid||'-'}</td><td>${x.bonusStatus||'-'}</td><td><input class='input' type='number' min='0' value='5000' style='width:110px' data-amt='${d.id}'></td><td><button class='btn green' data-pay='${d.id}'>Bayar</button> <button class='btn red' data-reject='${d.id}'>Tolak</button></td>`; tb.appendChild(tr); }
  tb.addEventListener('click', async (e)=>{ const p=e.target.closest('button[data-pay]'); const r=e.target.closest('button[data-reject]'); if(p){ const id=p.dataset.pay; const amt=parseInt(tb.querySelector(`input[data-amt='${id}']`).value||'0',10); await payBonus(id,amt); window.render('referrals'); } if(r){ await updateDoc(doc(db,'referrals',r.dataset.reject), { bonusStatus:'rejected' }); window.render('referrals'); } });
};
async function payBonus(refId, amount){ const ref=doc(db,'referrals',refId); const s=await getDoc(ref); if(!s.exists()) return; const x=s.data(); const uid=x.referrerUid; if(!uid) return; const userRef=doc(db,'users',uid); const us=await getDoc(userRef); let bal=0; if(us.exists()) bal=(us.data().wallet?.balance||0)+amount; await updateDoc(userRef, { 'wallet.balance': bal }); await setDoc(doc(db,'users',uid,'bonuses',refId), { amount, fromUid:x.referredUid||'-', status:'paid', createdAt:new Date() }); await updateDoc(ref, { bonusStatus:'paid', paidAt:new Date(), amount }); }
