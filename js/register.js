(function(){
  if(!window.FB) return;
  FB.auth.onAuthStateChanged(u=>{
    if(u){ location.replace("index.html"); }
  });
})();

document.addEventListener('DOMContentLoaded',()=>{
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const pass  = document.getElementById('password');
  document.getElementById('registerBtn').addEventListener('click', async ()=>{
    if(!name.value || !email.value || !pass.value) return alert('Lengkapi semua kolom');
    if(pass.value.length<6) return alert('Sandi minimal 6 karakter');
    try{
      const cred = await FB.auth.createUserWithEmailAndPassword(email.value.trim(), pass.value);
      await FB.db.collection('users').doc(cred.user.uid).set({
        displayName: name.value.trim(),
        email: email.value.trim(),
        role: 'user',
        createdAt: new Date()
      }, {merge:true});
      const ov = document.getElementById('loading'); ov.classList.add('show');
      setTimeout(()=> location.replace('index.html'), 5000);
    }catch(e){ alert(e.message); }
  });
});