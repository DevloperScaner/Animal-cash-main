
import { auth, db } from './firebase-init.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

onAuthStateChanged(auth, async (u)=>{
  if(!u){ location.href='index.html'; return; }
  let accrued=0, today=0, total=0, days=0, countdown=0;
  try{
    const snap = await getDocs(query(collection(db,'users',u.uid,'holdings')));
    const now = Date.now();
    snap.forEach(d=>{
      const x=d.data();
      const st = (x.startAt?.toDate?x.startAt.toDate():x.startAt)||null;
      const en = (x.endAt?.toDate?x.endAt.toDate():x.endAt)||null;
      const cycle = Number(x.cycleDays||0);
      accrued += Number(x.price||0);
      today += Number(x.dailyIncome||0);
      total += Number(x.totalIncome||0);
      days += cycle;
      if(en) countdown += Math.max(0, Math.ceil( (en.getTime()-now)/86400000 ));
    });
  }catch(_){}
  document.getElementById('assetProfit').textContent = accrued.toFixed(2);
  document.getElementById('incomeToday').textContent = today.toFixed(0);
  document.getElementById('incomeTotal').textContent = total.toFixed(2);
  document.getElementById('daysCount').textContent = days.toString();
  document.getElementById('countdown').textContent = countdown.toString();
});
