const fs = require("fs-jetpack");
const viewMenuTemplate = {
    label: 'View',
    submenu: [
      {
        label: 'Toggle Auto-hide Menu',
        click (menuItem, browserWindow, event) {
          browserWindow.setAutoHideMenuBar(!browserWindow.isMenuBarAutoHide());
        }
      },
      { role: 'reload'},
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
        label: 'Capture Page',
        click(menuItem, browserWindow, event) {
          browserWindow.capturePage( (img) => {
            const saveTo = "screenCapture.png";
            fs.writeAsync(saveTo, img.toPNG());
          })
        }
      }
    ]
};
module.exports = viewMenuTemplate;