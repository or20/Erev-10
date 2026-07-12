(()=>{
  let nativePrompt=null;

  window.addEventListener('beforeinstallprompt',event=>{
    event.preventDefault();
    nativePrompt=event;
    window.__e10InstallPrompt=event;
  });

  function standalone(){
    return window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;
  }

  function samsungBrowser(){
    return /SamsungBrowser/i.test(navigator.userAgent);
  }

  function hideInstallControls(){
    document.getElementById('installBox')?.classList.remove('show');
    document.querySelector('.installFab')?.remove();
  }

  function openCurrentPageInChrome(){
    const cleanUrl=location.href.replace(/^https?:\/\//,'');
    location.href=`intent://${cleanUrl}#Intent;scheme=https;package=com.android.chrome;end`;
  }

  window.installApp=async function(){
    if(standalone()){
      hideInstallControls();
      return;
    }

    if(samsungBrowser()&&!nativePrompt&&!window.__e10InstallPrompt){
      openCurrentPageInChrome();
      return;
    }

    for(let i=0;i<25&&!nativePrompt&&!window.__e10InstallPrompt;i++){
      await new Promise(resolve=>setTimeout(resolve,100));
    }

    const promptEvent=nativePrompt||window.__e10InstallPrompt;
    if(!promptEvent){
      openCurrentPageInChrome();
      return;
    }

    nativePrompt=null;
    window.__e10InstallPrompt=null;
    await promptEvent.prompt();
    await promptEvent.userChoice;
    hideInstallControls();
  };

  window.addEventListener('appinstalled',hideInstallControls);
})();