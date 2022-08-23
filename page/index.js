window.addEventListener('message', function (event) {
  loadShortcuts(event.data);
});

window.parent.postMessage('frameLoaded', '*');
