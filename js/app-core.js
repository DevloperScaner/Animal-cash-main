// Minimal App core (toast)
export const App = window.App || {};
(function(){
  const toast = document.getElementById('toast');
  App.toast = (msg)=>{
    if(!toast){ alert(msg); return; }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(()=>toast.classList.remove('show'), 2000);
  };
  window.App = App;
})();
