let targetUrl;
let backgroundUrl;
let redirectNoLoad;
let shortcuts = [];
let frameSource;

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

chrome.storage.sync.get(
  ['targetUrl', 'backgroundUrl', 'redirectNoLoad', 'shortcuts'],
  function (options) {
    targetUrl = options.targetUrl;
    backgroundUrl = options.backgroundUrl;
    redirectNoLoad = options.redirectNoLoad;
    shortcuts = options.shortcuts;

    document.body.style.backgroundImage = `url(${backgroundUrl})`;
    document.getElementById('frame').src = targetUrl;
  },
);

class Shortcut {
  constructor(title, url, fetchIcon, icon) {
    this.title = title;
    this.url = url;
    this.fetchIcon = fetchIcon;
    this.icon = icon;
  }
}

if (shortcuts === []) {
  shortcuts = [
    new Shortcut('YouTube', 'https://www.youtube.com', true, ''),
    new Shortcut('Github', 'https://www.github.com', true, ''),
    new Shortcut('Reddit', 'https://www.reddit.com', true, ''),
    new Shortcut('Twitch', 'https://www.twitch.tv', true, ''),
    new Shortcut('Plex', 'https://app.plex.tv', true, ''),
    new Shortcut('Gmail', 'https://www.gmail.com', true, ''),
    new Shortcut('Google Calendar', 'https://www.calendar.google.com', true, ''),
    new Shortcut('Moodle', 'https://lms.monash.edu/my/', false, ''),
    new Shortcut('Nazareth', 'http://nazareth/', false, ''),
  ];
}

// Milliseconds to wait before checking if auth failed
const authTimeout = 5000;
let frameLoaded = false;
redirectNoLoad = true;
// Listens for a message from the iframe that tells the document the iframe loaded properly
if (redirectNoLoad === true) {
  addEventListener('message', (e) => {
    if (e.data === 'frameLoaded') {
      frameLoaded = true;
      frameSource = e.source;
      e.source.postMessage(shortcuts, '*');
    }
  });
  // Set a timeout to redirect to the new tab hosted page if the iframe isnt authenticated or doesn't load in the specified time
  setTimeout(() => {
    if (!frameLoaded) {
      window.location.href = targetUrl;
    }
  }, authTimeout);
}

function addShortcut() {
  chrome.storage.sync.get(['shortcuts'], function (options) {
    let shortcuts = options.shortcuts;
    shortcuts.push(new Shortcut('Reddit', 'https://www.reddit.com', true, ''));
    chrome.storage.sync.set({ shortcuts: shortcuts }, function () {
      frameSource.postMessage(shortcuts, '*');
    });
    manageShortcuts();
  });
}

function resetShortcuts() {
  const shortcuts = [
    new Shortcut('YouTube', 'https://www.youtube.com', true, ''),
    new Shortcut('Github', 'https://www.github.com', true, ''),
    new Shortcut('Reddit', 'https://www.reddit.com', true, ''),
    new Shortcut('Twitch', 'https://www.twitch.tv', true, ''),
    new Shortcut('Plex', 'https://app.plex.tv', true, ''),
    new Shortcut('Gmail', 'https://www.gmail.com', true, ''),
    new Shortcut('Google Calendar', 'https://www.calendar.google.com', true, ''),
    new Shortcut('Moodle', 'https://lms.monash.edu/my/', false, ''),
    new Shortcut('Notion', 'https://www.notion.so/', true, ''),
    new Shortcut('Unraid', 'http://nazareth/', true, ''),
  ];
  chrome.storage.sync.set({ shortcuts: shortcuts }, function () {
    const shortcuts = [
      new Shortcut('YouTube', 'https://www.youtube.com', true, ''),
      new Shortcut('Github', 'https://www.github.com', true, ''),
      new Shortcut('Reddit', 'https://www.reddit.com', true, ''),
      new Shortcut('Twitch', 'https://www.twitch.tv', true, ''),
      new Shortcut('Plex', 'https://app.plex.tv', true, ''),
      new Shortcut('Gmail', 'https://www.gmail.com', true, ''),
      new Shortcut('Google Calendar', 'https://www.calendar.google.com', true, ''),
      new Shortcut('Moodle', 'https://lms.monash.edu/my/', false, ''),
      new Shortcut('Notion', 'https://www.notion.so/', true, ''),
      new Shortcut('Unraid', 'http://nazareth/', true, ''),
    ];
    frameSource.postMessage(shortcuts, '*');
  });
}

function refreshIframe() {
  const frameUrl = document.getElementById('frame').src;
  document.getElementById('frame').src = frameUrl;
}

function toggleOptions() {
  const optionsContainer = document.getElementById('options-container');
  if (optionsContainer.style.display === 'none') {
    optionsContainer.style.display = 'block';
  } else {
    optionsContainer.style.display = 'none';
  }
  manageShortcuts();
}

function filterUrl(url) {
  url = url.replace(/^https?:\/\//, '');
  return url;
}

function manageShortcuts() {
  chrome.storage.sync.get(['shortcuts'], function (options) {
    let shortcuts = options.shortcuts;
    console.log(shortcuts);
    const shortcutsContainer = document.getElementById('options-shortcut-list');
    removeAllChildNodes(shortcutsContainer);
    shortcuts.forEach((shortcut) => {
      const shortcutContainer = document.createElement('div');
      shortcutContainer.className = 'shortcut-list-item';
      shortcutContainer.innerHTML = `
      <div class="shortcut-title">${shortcut.title}</div>
      <input class="shortcut-title" type="text" value="${
        shortcut.title
      }" style="display: none;"></input>

      <div class="shortcut-url">${filterUrl(shortcut.url)}</div>
      <input class="shortcut-url" type="text" value="${
        shortcut.url
      }" style="display: none;"></input>

      <div class="shortcut-save" style="display: none;">
        <img src="assets/icons/save.svg">
      </div>

      <div class="shortcut-discard" style="display: none;">
        <img src="assets/icons/discard.svg">
      </div>

      <div class="shortcut-edit">
        <img src="assets/icons/edit.svg">
      </div>

      <div class="shortcut-delete">
        <img src="assets/icons/delete.svg">
      </div>
    `;
      shortcutContainer.getElementsByClassName('shortcut-edit')[0].addEventListener('click', () => {
        const shortcutEdit = shortcutContainer.getElementsByClassName('shortcut-edit')[0];
        const shortcutDelete = shortcutContainer.getElementsByClassName('shortcut-delete')[0];

        shortcutEdit.style.display = 'none';
        shortcutDelete.style.display = 'none';

        const shortcutTitles = shortcutContainer.getElementsByClassName('shortcut-title');
        const shortcutUrls = shortcutContainer.getElementsByClassName('shortcut-url');

        const titleText = shortcutTitles[0];
        const titleInput = shortcutTitles[1];

        const urlText = shortcutUrls[0];
        const urlInput = shortcutUrls[1];

        titleText.style.display = 'none';
        titleInput.style.display = 'block';
        urlText.style.display = 'none';
        urlInput.style.display = 'block';

        const shortcutSave = shortcutContainer.getElementsByClassName('shortcut-save')[0];
        const shortcutDiscard = shortcutContainer.getElementsByClassName('shortcut-discard')[0];

        shortcutSave.style.display = 'block';
        shortcutDiscard.style.display = 'block';

        shortcutSave.addEventListener('click', () => {
          const title = titleInput.value;
          const url = urlInput.value;
          const index = shortcuts.indexOf(shortcut);
          shortcuts[index].title = title;
          shortcuts[index].url = url;
          chrome.storage.sync.set({ shortcuts: shortcuts }, function () {
            frameSource.postMessage(shortcuts, '*');

            // Resets the options container
            manageShortcuts();
          });
        });
      });

      shortcutContainer
        .getElementsByClassName('shortcut-delete')[0]
        .addEventListener('click', () => {
          deleteShortcut(shortcuts.indexOf(shortcut));
        });
      shortcutsContainer.appendChild(shortcutContainer);
    });
  });
}

async function deleteShortcut(index) {
  chrome.storage.sync.get(['shortcuts'], function (options) {
    let shortcuts = options.shortcuts;
    shortcuts.splice(index, 1);
    chrome.storage.sync.set({ shortcuts: shortcuts }, function () {
      frameSource.postMessage(shortcuts, '*');
    });
    manageShortcuts();
  });
}

document.getElementById('options-toggle').addEventListener('click', toggleOptions);
document.getElementById('add-shortcut').addEventListener('click', addShortcut);
document.getElementById('reset-shortcuts').addEventListener('click', resetShortcuts);
