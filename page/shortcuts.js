function loadShortcuts(shortcuts) {
  let shortcutContainer = document.getElementById('shortcuts');
  let rows = Math.sqrt(shortcuts.length) - 1;
  if (rows < 1) {
    rows = 1;
  }
  const itemsPerRow = shortcuts.length / rows;

  let rowContainer = document.createElement('div');
  rowContainer.className = 'row';

  let itemNumber = 0;

  for (let i = 0; i < shortcuts.length; i++) {
    if (itemNumber >= itemsPerRow) {
      itemNumber = 0;
      shortcutContainer.appendChild(rowContainer);
      rowContainer = document.createElement('div');
      rowContainer.className = 'row';
    }

    let shortcut = shortcuts[i];
    let shortcutItem = document.createElement('div');
    shortcutItem.className = 'neo sc-holder';
    let shortcutLink = document.createElement('a');
    shortcutLink.className = 'sc-link';

    shortcutLink.name = shortcut.title;
    shortcutLink.href = shortcut.url;
    shortcutLink.target = '_parent';

    const image = document.createElement('img');

    if (shortcut.fetchIcon) {
      image.src = `https://simpleicons.org/icons/${shortcut.title
        .replace(' ', '')
        .toLowerCase()}.svg`;
    } else if (shortcut.icon !== '') {
      image.src = `${shortcut.icon}`;
    } else {
      image.src = `assets/icons/${shortcut.title.toLowerCase()}.png`;
    }

    image.className = 'icon';
    shortcutLink.appendChild(image);
    shortcutItem.appendChild(shortcutLink);
    rowContainer.appendChild(shortcutItem);

    itemNumber++;
  }
  shortcutContainer.appendChild(rowContainer);
}
