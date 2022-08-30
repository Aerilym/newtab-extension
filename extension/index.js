let targetUrl;
let backgroundUrl;
let redirectNoLoad;
let shortcuts = [];
let frameSource;

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

document.getElementById('add').addEventListener('click', addShortcut);
document.getElementById('reset').addEventListener('click', resetShortcuts);
