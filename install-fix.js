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

  function hideInstallControls(){
    document.getElementById('installBox')?.classList.remove('show');
    document.querySelector('.installFab')?.remove();
  }

  window.installApp=async function(){
    if(standalone()){
      hideInstallControls();
      return;
    }

    for(let i=0;i<20&&!nativePrompt&&!window.__e10InstallPrompt;i++){
      await new Promise(resolve=>setTimeout(resolve,100));
    }

    const promptEvent=nativePrompt||window.__e10InstallPrompt;
    if(!promptEvent){
      hideInstallControls();
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