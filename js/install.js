'use strict';

console.log('init');

window.addEventListener('load', function installLoad(evt) {
  function install() {
    var manifestUrl = window.location + 'manifest.webapp';
    var request = window.navigator.mozApps.installPackage(manifestUrl);
    request.onsuccess = function() {
      getSelf();
    };
    request.onerror = function() {
      // Display the error information from the DOMError object
      log('Install failed, error: ' + this.error.name);
    };
  }

  function check() {
   app.checkForUpdate(); 
  }

  function addEvents(app) {
   app.ondownloadavailable = handleDownloadAvailable;
   app.ondownloadsuccess = handleDownloadSuccess;
   app.ondownloadapplied = handleDownloadApplied;
   app.onprogress = handleProgress;
  }

  function handleDownloadAvailable() {
   console.log('download available');
   downloadButton.disabled = false;
   noUpdateText.classList.remove('show');
   updateAvailableText.classList.add('show');
  }

  var cnt = 0,
      progressChars = '|/-\\';

  function handleProgress() {
    progress.classList.add('show');
    progress.textContent = progressChars.charAt(cnt++);
    if (cnt >= progressChars.length) {
      cnt = 0;
    }
    downloadButton.disabled = true;
  }

  function handleDownload() {
    app.download();
    downloadButton.disabled = true;
   updateAvailableText.classList.remove('show');
  }

  function handleDownloadSuccess() {
   downloadsuccess = true;
   console.log('download success');
   progress.classList.remove('show');
   reloadText.classList.add('show');
  }

  function handleDownloadApplied() {
   console.log('download applied');
   if (downloadsuccess) {
	downloadsuccess = false;
	console.log('download was applied');
   } else {
	console.log('no download is available');
	noUpdateText.classList.add('show');
   }
  }

  if (!navigator.mozApps || !navigator.mozApps.installPackage) {
    return;
  }

  document.body.classList.remove('nomozapps');
  var app;
  var updateButton = document.getElementById('update-button'),
      downloadButton = document.getElementById('download-button'),
      installButton = document.getElementById('install-app'),
      closeButton = document.getElementById('close-button'),
      reloadText = document.getElementById('reload-text'),
      noUpdateText = document.getElementById('no-update-text'),
      updateAvailableText = document.getElementById('update-available-text'),
      progress = document.getElementById('progress');
  var downloadsuccess;

updateButton.addEventListener('click', check);
downloadButton.addEventListener('click', handleDownload);
installButton.addEventListener('click', install);
closeButton.addEventListener('click', function() { window.close(); });

function getSelf() {
  var request = navigator.mozApps.getSelf();
  request.onsuccess = function() {
	app = this.result;
	if (app) {
		addEvents(app);
		installButton.disabled = true;
		updateButton.disabled = false;
		app.downloadAvailable && handleDownloadAvailable();
	}

  };
  request.onerror = function() {
    log('Error checking installation status: ' + this.error.message);
  };
}

  getSelf();
});
