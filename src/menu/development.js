const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const devMenuTemplate = {
  label: "Development",
  submenu: [
    { role: 'forcereload'},
    { role: 'toggledevtools'}
  ]
};
module.exports = devMenuTemplate;