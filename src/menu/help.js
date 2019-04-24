const createWindow = require("../helpers/window.js");
const path = require("path");
const url = require("url");
const {shell, dialog, BrowserWindow} = require("electron");

const helpMenuTemplate = {
    label: "Help",
    submenu: [
        {
            label: 'Help with current page',
            click () {
                let win = BrowserWindow.getFocusedWindow();
                let fullPath = win.helpUrl;
                if(fullPath) {
                    //shell.openItem(fullPath);
                    shell.openExternal(fullPath);
                } else {
                    dialog.showMessageBox(win, {type: "info", title: "Help unavailable", message: "No help is available for the current page"});
                }
                //TODO: Electron native support for PDF is planned to be fixed in version 4
                // or 5.  Once that happens evaluate whether it is satisfactory and revert
                // the above to this previous behavior:
                /*
                const win = createWindow('help_doc', {
                    width: 850,
                    height: 600,
                    icon: './some.png',
                    webPreferences: {
                        plugins: true
                    }
                });
                win.loadURL(fullPath);
                */
            }
        },
        {
            label: 'About NITES-Next',
            click () { 
                const win = new BrowserWindow({
                    width: 500,
                    height: 200,
                    alwaysOnTop: true,
                    maximizable: false,
                    resizable: false
                });
                win.setMenuBarVisibility(false);
                win.loadURL(
                    url.format({
                        pathname: path.join(__dirname, "../about.html"),
                        protocol: "file:",
                        slashes: false
                    })
                );
            }
        },
        {
            role: 'toggledevtools',
            accelerator: 'F12',
            visible: false
        }
    ]
};
module.exports = helpMenuTemplate;