
import { auth, db, App } from '../firebase-init.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { addDoc, collection, query, where, orderBy, getDocs, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
import { defaults } from '../config.js';

const wdFormEl = document.getElementById('wdForm');
const wdTable  = document.querySelector('#wdTable tbody');
const wdQuota  = document.getElementById('wdQuota');
const settings = defaults;

const PROVIDERS = {
  ewallet: [{id:'dana',name:'Dana',logo:'img/dana.png'},{id:'ovo',name:'OVO',logo:'img/ovo.png'},{id:'gopay',name:'GoPay',logo:'img/gopay.png'}],
  bank: [{id:'mandiri',name:'Mandiri',logo:'img/mandiri.png'},{id:'bca',name:'BCA',logo:'img/bca.png'},{id:'bri',name:'BRI',logo:'img/bri.png'},{id:'bni',name:'BNI',logo:'img/bni.png'}]
};

function renderForm(tab){
  const items = PROVIDERS[tab];
  wdFormEl.innerHTML = `
    <div class="selector">
      ${items.map(x=>`<label class="opt"><input type="radio" name="provider" value="${x.id}" required><img src="${x.logo}" class="logo" alt="Logo ${x.name}"><span>${x.name}</span></label>`).join('')}
    </div>
    <input class="input" id="accName" placeholder="Atas nama" required>
    <input class="input" id="accNo" placeholder="${tab==='ewallet'?'No. E-Wallet':'No. Rekening'}" required>
    <input class="input" id="amount" type="number" min="${settings.withdraw.min}" placeholder="Jumlah (min Rp ${new Intl.NumberFormat('id-ID').format(settings.withdraw.min)})" required>
    <div class="small">Min Rp ${new Intl.NumberFormat('id-ID').format(settings.withdraw.min)} · Maks ${settings.withdraw.maxPerDay}x/hari · Biaya Rp ${new Intl.NumberFormat('id-ID').format(settings.withdraw.fee)} · Estimasi 15 menit</div>
    <button class="btn" id="sendWd" type="button">Kirim</button>
  `;
  document.getElementById('sendWd')?.addEventListener('click', submitWd);
}
let currentTab = 'ewallet'; renderForm(currentTab);
document.getElementById('wdTabs')?.addEventListener('click', (e)=>{
  const btn = e.target.closest('button[data-tab]'); if(!btn) return;
  currentTab = btn.dataset.tab; renderForm(currentTab);
});

let currentUser=null;
onAuthStateChanged(auth, (u)=>{ if(!u){ location.href='index.html'; return; } currentUser=u; loadHistory(); updateQuota(); });

async function submitWd(){
  const provider = document.querySelector('input[name="provider"]:checked')?.value;
  const accName  = document.getElementById('accName').value.trim();
  const accNo    = document.getElementById('accNo').value.trim();
  const amount   = parseInt(document.getElementById('amount').value,10);
  if(!provider || !accName || !accNo || !amount){ App.toast('Lengkapi data'); return; }
  if(amount < settings.withdraw.min){ App.toast('Minimal penarikan Rp '+settings.withdraw.min); return; }
  // 1x/day check
  const day = new Date(); day.setHours(0,0,0,0);
  const q = query(collection(db,'withdrawals'), where('uid','==',currentUser.uid), where('createdDay','==',day.getTime()));
  const snap = await getDocs(q); if(snap.size >= settings.withdraw.maxPerDay){ App.toast('Kamu sudah melakukan penarikan hari ini. Coba lagi besok.'); return; }
  // block if pending
  const q2 = query(collection(db,'withdrawals'), where('uid','==',currentUser.uid), where('status','==','pending'));
  const pend = await getDocs(q2); if(pend.size > 0){ App.toast('Pengajuan sebelumnya masih menunggu persetujuan admin. Tunggu approve admin dulu.'); return; }
  const fee = settings.withdraw.fee;
  await addDoc(collection(db,'withdrawals'), { uid: currentUser.uid, method: currentTab, provider, accName, accNo, amount, fee, netAmount: amount - fee, status:'pending', createdAt: serverTimestamp(), createdDay: day.getTime() });
  App.toast('Pengajuan berhasil. Mohon tunggu hingga 15 menit. Jika belum masuk, hubungi admin di Contact.'); loadHistory(); updateQuota();
}

async function loadHistory(){
  const q = query(collection(db,'withdrawals'), where('uid','==',currentUser.uid), orderBy('createdAt','desc'));
  const snap = await getDocs(q); wdTable.innerHTML='';
  snap.forEach(d=>{ const x=d.data(); const t=x.createdAt?.toDate?x.createdAt.toDate().toLocaleString('id-ID'):'-';
    const tr=document.createElement('tr'); tr.innerHTML=`<td>${t}</td><td>${x.method}</td><td>${x.provider}</td><td>Rp ${new Intl.NumberFormat('id-ID').format(x.amount)}</td><td>${x.status}</td>`; wdTable.appendChild(tr); });
}

async function updateQuota(){
  const day = new Date(); day.setHours(0,0,0,0);
  const q = query(collection(db,'withdrawals'), where('uid','==',currentUser.uid), where('createdDay','==',day.getTime()));
  const snap = await getDocs(q);
  const left = Math.max(0, settings.withdraw.maxPerDay - snap.size);
  wdQuota.textContent = `Sisa kesempatan hari ini: ${left}/${settings.withdraw.maxPerDay}`;
}
