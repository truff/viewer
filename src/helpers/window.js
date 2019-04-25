// This helper remembers the size and position of your windows (and restores
// them in that place after app relaunch).
// Can be used for more than one window, just construct many
// instances of it and give each different name.
const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const shell = electron.shell;

let screen;
app.on('ready', () => {
    screen = electron.screen
})
const jetpack = require("fs-jetpack");

module.exports = function(name, options) {
  const userDataDir = jetpack.cwd(app.getPath("userData"));
  const stateStoreFile = `window-state-${name}.json`;
  const defaultSize = {
    width: options.width,
    height: options.height
  };
  let state = {};
  let win;

  const restore = () => {
    let restoredState = {};
    try {
      restoredState = userDataDir.read(stateStoreFile, "json");
    } catch (err) {
      // For some reason json can't be read (might be corrupted).
      // No worries, we have defaults.
    }
    return Object.assign({}, defaultSize, restoredState);
  };

  const getCurrentPosition = () => {
    const position = win.getPosition();
    const size = win.getSize();
    return {
      x: position[0],
      y: position[1],
      width: size[0],
      height: size[1]
    };
  };

  const windowWithinBounds = (windowState, bounds) => {
    return (
      windowState.x >= bounds.x &&
      windowState.y >= bounds.y &&
      windowState.x + windowState.width <= bounds.x + bounds.width &&
      windowState.y + windowState.height <= bounds.y + bounds.height
    );
  };

  const resetToDefaults = () => {
    const bounds = screen.getPrimaryDisplay().bounds;
    return Object.assign({}, defaultSize, {
      x: (bounds.width - defaultSize.width) / 2,
      y: (bounds.height - defaultSize.height) / 2
    });
  };

  const ensureVisibleOnSomeDisplay = windowState => {
    const visible = screen.getAllDisplays().some(display => {
      return windowWithinBounds(windowState, display.bounds);
    });
    if (!visible) {
      // Window is partially or fully not visible now.
      // Reset it to safe defaults.
      return resetToDefaults();
    }
    return windowState;
  };

  const saveState = () => {
    if (!win.isMinimized() && !win.isMaximized()) {
      Object.assign(state, getCurrentPosition());
    }
    try {
      userDataDir.write(stateStoreFile, state, { atomic: true });
    } catch(err) {
      //make best effort to write state, but when exiting it may sometimes fail
    }
  };

  state = ensureVisibleOnSomeDisplay(restore());

  win = new BrowserWindow(Object.assign({}, options, state));

  //don't allow files dropped from os to load in browser
  win.webContents.on('will-navigate', ev => {
    event.preventDefault();
    shell.openExternal(url);
  });

  //Open pdfs in system registered viewer.  Would be better to also check the MIME type of the 
  // reponse but electron APIs don't appear to support that.  May be necessary to first execute
  // a HEAD request and then check the Content-type entity header.
  win.webContents.on('new-window', (event, url) => {
    if(url.toLowerCase().endsWith('.pdf')) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  win.on("close", saveState);

  return win;
};
