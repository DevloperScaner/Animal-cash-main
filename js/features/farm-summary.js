import { auth, db } from '../firebase-init.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
const f = new Intl.NumberFormat('id-ID');
function daysBetween(a,b){ return Math.floor((b - a)/86400000); }
async function loadSummary(uid){
  const now = new Date();
  const hSnap = await getDocs(collection(db,'users',uid,'holdings'));
  let today=0,total=0,accrued=0,daysLeftSum=0,maxLeft=0;
  hSnap.forEach(d=>{ const x=d.data(); const cycle=Number(x.cycleDays||0);
    const start = x.startAt?.toDate ? x.startAt.toDate(): new Date(); const elapsed = Math.max(0, daysBetween(start, now));
    const done = Math.min(cycle, elapsed); const left = Math.max(0, cycle - done);
    const di = Number(x.dailyIncome||0); const ti = Number(x.totalIncome|| di*cycle);
    today += left>0 ? di : 0; total += ti; accrued += di*done; daysLeftSum += left; maxLeft = Math.max(maxLeft,left);
  });
  return {today,total,accrued,daysLeftSum,maxLeft};
}
onAuthStateChanged(auth, async (u)=>{
  if(!u){ location.href='index.html'; return; }
  try{
    const s = await loadSummary(u.uid);
    document.getElementById('sum-profit').textContent = f.format(s.accrued);
    document.getElementById('sum-today').textContent = f.format(s.today);
    document.getElementById('sum-total').textContent = f.format(s.total);
    document.getElementById('sum-days').textContent = s.daysLeftSum;
    document.getElementById('sum-countdown').textContent = s.maxLeft;
  }catch(err){ document.getElementById('sum-error').textContent = 'Gagal memuat: ' + (err?.message||err); }
});
