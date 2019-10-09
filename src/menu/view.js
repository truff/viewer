const fs = require("fs-jetpack");
const { app, dialog, session } = require('electron');
const path = require("path");

const viewMenuTemplate = {
    label: 'View', 
    submenu: [
      { role: 'reload', accelerator: 'F5'},
      { 
        label: 'Force Reload', accelerator: 'Ctrl+F5',
        click: (menuItem, browserWindow, event) => {
          let ses = session.defaultSession;
          ses.clearCache(
            () => {
              console.info("Cache cleared by user");
              browserWindow.reload();
            }
          );
        }
      },
      { type: 'separator' },
      { role: 'resetzoom' },
      { 
          role: 'zoomin',
          accelerator: 'CmdOrCtrl+='
      },
      {
          role: 'zoomout',
          accelerator: 'CmdOrCtrl+-'
       },
      { type: 'separator' },
      { role: 'togglefullscreen' },
      { 
          label: 'Screen Capture',
          click(menuItem, browserWindow, event) {
              browserWindow.capturePage( (img) => {
                  const saveTo = path.join(app.getPath('downloads'), 'screenCapture.png');
                  fs.writeAsync(saveTo, img.toPNG()).then( ()=> {
                      dialog.showMessageBox(browserWindow, {title: "Screen capture", message: 'Your image has been saved to ' + saveTo});
                  });
              });
          }
      }
    ]
};
module.exports = viewMenuTemplate;