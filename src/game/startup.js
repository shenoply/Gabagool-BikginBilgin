
let startupFailureShown68=false;
function startupFailure55(message){if(startupFailureShown68)return;startupFailureShown68=true;const status=document.getElementById('pipLoading'),retry=document.getElementById('pipRetry');if(status)status.textContent=message;if(retry){retry.textContent='Retry loading';retry.style.display='block';}}
window.addEventListener('error',e=>{if(document.getElementById('start')?.disabled)startupFailure55('The game could not start. '+(e.message||'A required file failed to load.')+' Tap Retry loading.');});
