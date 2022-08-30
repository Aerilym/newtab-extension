// Saves options to chrome.storage
function save_options() {
  const targetUrl = document.getElementById('targetUrl').value;
  const backgroundUrl = document.getElementById('backgroundUrl').value;
  const redirectNoLoad = document.getElementById('redirectNoLoad').checked;

  chrome.storage.sync.set(
    {
      targetUrl: targetUrl,
      backgroundUrl: backgroundUrl,
      redirectNoLoad: redirectNoLoad,
    },
    function () {
      // Update status to let user know options were saved.
      var status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(function () {
        status.textContent = '';
      }, 750);
    },
  );
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get(
    {
      targetUrl: 'http://localhost:8080/',
      backgroundUrl: 'assets/backgrounds/jwst.jpg',
      redirectNoLoad: true,
      shortcuts: [],
    },
    function (items) {
      document.getElementById('targetUrl').value = items.targetUrl;
      document.getElementById('backgroundUrl').value = items.backgroundUrl;
      document.getElementById('redirectNoLoad').checked = items.redirectNoLoad;
    },
  );
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
