const createWindow = require("../helpers/window.js");
const env = require("../helpers/env.js");
const path = require("path");
const url = require("url");
const {shell} = require("electron");

const helpMenuTemplate = {
    label: "Help",
    submenu: [
        {
            //TODO: Probably good to have a window that allows viewing all help guides also
            //label: 'NITES-Next Quick Reference Guides',
            label: 'Help with current page',
            click () {
                //TODO(TPR): For now just open the map's help file.  Need to change
                // so the help doc is the one for the current window.
                let fullPath = env.nites_host + '/planaTerra/docs/Map.pdf';
                //shell.openExternal(fullPath);
                shell.openItem(fullPath);
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
            label: 'NITES-Next System Version',
            click () { 
                const win = createWindow('help_version', {
                    width: 850,
                    height: 600
                });
                win.loadURL(env.nites_host + '/owf/help/ABOUT.html');
            }
        },
        {
            label: 'About NITES-Next',
            click () { 
                const win = createWindow('help_about', {
                    width: 350,
                    height: 250,
                    alwaysOnTop: true,
                    maximizable: false,
                    closeable: false
                });
                win.setMenuBarVisibility(false);
                win.loadURL(
                    url.format({
                        pathname: path.join(__dirname, "..\\about.html"),
                        protocol: "file:",
                        slashes: false
                    })
                );
            }
        }
    ]
};
module.exports = helpMenuTemplate;