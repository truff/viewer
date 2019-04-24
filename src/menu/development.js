const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const devMenuTemplate = {
  label: "Development",
  submenu: [
    { role: 'forcereload', accelerator: 'Shift+F5'},
    { role: 'toggledevtools'}
  ]
};
module.exports = devMenuTemplate;