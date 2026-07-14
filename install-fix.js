(()=>{
  function standalone(){
    return window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;
  }

  function samsungBrowser(){
    return /SamsungBrowser/i.test(navigator.userAgent);
  }

  function isInstallButton(target){
    return !!target.closest?.('[onclick*="installApp"]');
  }

  function hideInstallControls(){
    document.getElementById('installBox')?.classList.remove('show');
    document.querySelector('.installFab')?.remove();
  }

  function openCurrentPageInChrome(){
    const cleanUrl=location.href.replace(/^https?:\/\//,'');
    location.href=`intent://${cleanUrl}#Intent;scheme=https;package=com.android.chrome;end`;
  }

  if(standalone())hideInstallControls();

  document.addEventListener('click',event=>{
    if(!isInstallButton(event.target))return;
    if(standalone()){
      event.preventDefault();
      event.stopImmediatePropagation();
      hideInstallControls();
      return;
    }
    if(samsungBrowser()){
      event.preventDefault();
      event.stopImmediatePropagation();
      openCurrentPageInChrome();
    }
  },true);

  window.addEventListener('appinstalled',hideInstallControls);
})();