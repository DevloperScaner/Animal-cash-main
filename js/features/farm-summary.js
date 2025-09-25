import { auth, db } from '../firebase-init.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { collection, getDocs, query, where, orderBy } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

const f = new Intl.NumberFormat('id-ID');

function daysBetween(a,b){ return Math.floor((b - a)/86400000); }

async function loadSummary(uid){
  // holdings
  const hSnap = await getDocs(collection(db,'users',uid,'holdings'));
  let todayIncome = 0, totalIncome = 0, accrued = 0, daysLeftSum = 0, maxLeft = 0;
  const now = new Date();

  hSnap.forEach(d=>{
    const x = d.data();
    const cycle = Number(x.cycleDays||0);
    const start = x.startAt?.toDate ? x.startAt.toDate() : (x.startAt ? new Date(x.startAt) : now);
    const end = x.endAt?.toDate ? x.endAt.toDate() : (x.endAt ? new Date(x.endAt) : now);
    const elapsed = Math.max(0, daysBetween(start, now));
    const done = Math.min(cycle, elapsed);
    const left = Math.max(0, cycle - done);

    const di = Number(x.dailyIncome||0);
    const ti = Number(x.totalIncome|| (di*cycle));

    todayIncome += left>0? di : 0;
    totalIncome += ti;
    accrued += di * done;
    daysLeftSum += left;
    maxLeft = Math.max(maxLeft, left);
  });

  // transaksi counts
  const oSnap = await getDocs(query(collection(db,'orders'), where('uid','==',uid)));
  const wSnap = await getDocs(query(collection(db,'withdrawals'), where('uid','==',uid)));
  const txCount = (oSnap.size||0) + (wSnap.size||0);

  return { todayIncome, totalIncome, accrued, daysLeftSum, maxLeft, txCount };
}

onAuthStateChanged(auth, async (u)=>{
  if(!u){ location.href='index.html'; return; }
  try{
    const s = await loadSummary(u.uid);
    document.getElementById('sum-profit').textContent = f.format(s.accrued);
    document.getElementById('sum-today').textContent = f.format(s.todayIncome);
    document.getElementById('sum-total').textContent = f.format(s.totalIncome);
    document.getElementById('sum-days').textContent = s.daysLeftSum;
    document.getElementById('sum-countdown').textContent = s.maxLeft;
    document.getElementById('sum-tx').textContent = s.txCount + ' / ' + s.txCount;
  }catch(err){
    document.getElementById('sum-error').textContent = 'Gagal memuat ringkasan: ' + (err?.message||err);
  }
});
