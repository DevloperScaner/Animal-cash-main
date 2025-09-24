import { auth, db, App } from './firebase-init.js';
import { onAuthStateChanged, getIdTokenResult } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { collection, getDocs, query, orderBy, limit, updateDoc, doc } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

const tbody = document.querySelector('#usersTable tbody');

onAuthStateChanged(auth, async (u)=>{
  if(!u){ location.href='../index.html'; return; }
  if(!(await isAdmin(u))){ App.toast('Akses admin diperlukan'); location.href='../dashboard.html'; return; }

  const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(50));
  const snap = await getDocs(q);
  tbody.innerHTML = '';
  snap.forEach(d=>{
    const data = d.data();
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${data.email ?? ''}</td>
                    <td>${data.displayName ?? ''}</td>
                    <td><span class="badge">${data.role ?? 'user'}</span></td>
                    <td>
                      <button class="btn" data-uid="${d.id}" data-role="admin">Jadikan admin</button>
                      <button class="btn" data-uid="${d.id}" data-role="user">Jadikan user</button>
                    </td>`;
    tbody.appendChild(tr);
  });

  tbody.addEventListener('click', async (e)=>{
    const btn = e.target.closest('button[data-uid]');
    if(!btn) return;
    const uid = btn.dataset.uid, role = btn.dataset.role;
    await updateDoc(doc(db,'users',uid), { role });
    App.toast('Role diperbarui: ' + role);
    btn.closest('tr').querySelector('.badge').textContent = role;
  });
});

async function isAdmin(user){
  try{
    const token = await getIdTokenResult(user);
    if(token.claims && token.claims.admin === true) return true;
  }catch{}
  return false; // client only uses claim here; rules allow role field, but UI hides admin panel w/o claim
}
