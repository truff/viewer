/**
 * This is main background Electron process.  It launches the main window
 * and runs through the entire life of the application.
 */
const { app, Menu } = require('electron');

//this allows us to see any error dialog displayed internally by Electron
const { dialog } = require('electron');

//Don't allow application to be launched if it is already running.
//'second-instance' will be signaled in running app.
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
    //Calling .quit causes an internal electron error in a dialog.  can eliminate
    //the dlg by removing the require for dialog module, but that's just hiding it
    //and you still see an error when the second instance closes if you launch
    //from the command line.  Use exit until the the bug is fixed in electron.
    app.exit();
}
//Electron throws on second instance close if you listen to this event
// when the lock wasn't received.
app.on('second-instance', (event, commandLine, workingDirectory) => {
    //TODO: read univeralName of widget to launch from commandLine
    owfService.launchWidget(null, {
        universalName: "nn.planaTerra"
    });
});

const env = require('./helpers/env.js');
const owfService = require('./owfService.js');
//const certModule = require('./certificateAuthentication.js');
require('./certificateAuthentication.js');

// menu templates must end in exactly 'Template'
const nitesMenuTemplate = require('./menu/nites');
//const editMenuTemplate = require('./menu/edit');
const viewMenuTemplate = require('./menu/view');
const helpMenuTemplate = require('./menu/help');
const devMenuTemplate = require('./menu/development');

const setApplicationMenu = () => {
    const menus = [nitesMenuTemplate, viewMenuTemplate];
    if (env.name !== 'prod') {
        menus.push(devMenuTemplate);
    }
    menus.push(helpMenuTemplate);
    Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

//Don't use the roaming profile for purposes e.g. chromium cache.  It is a network
// share and suffers from performance and reliability issues.
const path = require("path");
//app.setPath("appData", process.env.LOCALAPPDATA);
// Allow separate userData for development and production builds
let userData = path.join(process.env.LOCALAPPDATA, app.getName());
//let userData = path.join(app.getPath("appData"), app.getName());

if (env.name !== 'production') {
    app.setPath('userData', `${userData}-${env.name}`);
} else {
    app.setPath('userData', userData);
}

let mainWindow;

//const url = require('url');
//const createWindow = require('./helpers/window.js');
app.on('ready', (launchInfo) => {
    setApplicationMenu();
    owfService.initOwf();

    mainWindow = owfService.launchWidget(null, {
        universalName: "nn.planaTerra"
    });

    //This is annoying
    //const child = createWindow('dialog', {
    //    width: 350,
    //    height: 250,
    //    parent: mainWindow,
    //    alwaysOnTop: true,
    //    maximizable: false,
    //    closeable: false,
    //    show: false
    //});
    //child.loadURL(
    //    url.format({
    //        pathname: path.join(__dirname, 'app.html'),
    //        protocol: 'file:',
    //        slashes: false
    //    })
    //);
    //child.once('ready-to-show', () => {
    //    child.setMenuBarVisibility(false);
    //    child.show()
    //});
    //TODO: call OWF ready() ?
});
