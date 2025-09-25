// Minimal i18n reader (optional)
(function(){
  const lang = localStorage.getItem('lang') || 'id';
  document.documentElement.setAttribute('lang', lang);
})();
