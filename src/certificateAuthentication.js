/**
 * This module sets up application life cycle listeners and custom events on the main 
 * process that support client certificate authentication.  It exports nothing.
 */
const { app, ipcMain, BrowserWindow } = require('electron');
const path = require('path');
let certSelector;

app.on('select-client-certificate', (event, webContents, url, list, callback) => {
    // list.forEach((li) => {
    //     console.info('Subject: ' + li.subjectName + '\nIssuer: ' + li.issuerName);
    // });
    if (list.length == 1) {
        //perform default behavior of supplying the first certificate in the list.
        return;
    }
    event.preventDefault();

    //Not sure what causes it, but I have seen multiple cert selection dialogs
    //ala TR OWF behavior, but on RDT&E in electron.
    if(certSelector != null) {
        console.error('Ignoring duplicative select-client-certificate messages.  This may be an ActiveClient error.');
        return;
    }

    /**
     * Called by certificate select dialog when user selects a cert and clicks submit.
     */
    ipcMain.once('client-certificate-selected', (event, item) => {
        event.sender.session.item = item;
        setCurrentUser(item.subjectName);
        callback(item);
    });

    //create window to display certificates and allow user to select one
    certSelector = new BrowserWindow({
        show: false,
        width: 370,
        height: 330,
        resizable: false,
        alwaysOnTop: true
    });
    certSelector.once('ready-to-show', () => {
        certSelector.setMenuBarVisibility(false);
        certSelector.show();
        //TODO: send message to renderer process so ElectronOwfSPI can call Ready?
    });
    certSelector.webContents.once('did-finish-load', () => {
        certSelector.webContents.send('displayCertificateList', list);
    });

    // if(env.name === 'development' && env.mode == 'debug') {
    //     certSelector.openDevTools();
    // }
    const certSelectorPath = path.join('file://', __dirname, '/certSelector.html');
    certSelector.on('closed', () => {
        certSelector = null;
    });
    certSelector.loadURL(certSelectorPath);

    //for development only, just choose first cert in list.
    //callback(list[0]);
});

app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    console.log('certificate-error', url, certificate, error);
    //if you choose to trust the cert anyway, call event.preventDefault() and return true
    //const result = true|false - do your validation here, call callback with bool isTrusted arg
    //event.preventDefault();
    //callback(result);
});

//OWF state
var currentUser;
function setCurrentUser(user) {
    currentUser = user;
}
ipcMain.on('setCurrentUser', (event, userName) => {
    setCurrentUser(userName);
});

ipcMain.on('getCurrentUser', (event, arg) => {
    event.sender.send('getCurrentUserResp', currentUser);
});

//Currently no exports are necessary, but may want to export the currentAuthenticatedUser
// at some point in the future.
