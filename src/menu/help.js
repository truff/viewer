const createWindow = require("../helpers/window.js");
const env = require("../helpers/env.js");
const path = require("path");
const url = require("url");

const helpMenuTemplate = {
    label: "Help",
    submenu: [
        {
            label: 'NITES-Next Quick Reference Guides',
            // https://nites-vm-6.sd.spawar.navy.mil/owf/helpFiles
            click () { 
                const win = createWindow('help_qrg', {
                    width: 850,
                    height: 600
                });
                win.loadURL(env.nites_host + '/owf/help/ABOUT.html');
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
                        pathname: path.join(__dirname, "about.html"),
                        protocol: "file:",
                        slashes: false
                    })
                );
            }
        }
    ]
};
module.exports = helpMenuTemplate;