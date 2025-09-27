(function(){
  if(!window.FB) return;
  FB.auth.onAuthStateChanged(u=>{
    if(u){ location.replace("index.html"); }
  });
})();

document.addEventListener('DOMContentLoaded',()=>{
  const email = document.getElementById('email');
  const pass  = document.getElementById('password');
  document.getElementById('loginBtn').addEventListener('click', async ()=>{
    if(!email.value || !pass.value) return alert('Isi email & sandi');
    try{
      await FB.auth.signInWithEmailAndPassword(email.value.trim(), pass.value);
      const ov = document.getElementById('loading'); ov.classList.add('show');
      setTimeout(()=> location.replace('index.html'), 5000); // spinner 5 detik
    }catch(e){ alert(e.message); }
  });
  document.getElementById('forgot').addEventListener('click', async (e)=>{
    e.preventDefault();
    if(!email.value) return alert('Masukkan email dulu');
    try{ await FB.auth.sendPasswordResetEmail(email.value.trim()); alert('Link reset terkirim'); }catch(e){ alert(e.message); }
  });
});