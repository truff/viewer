/**
 * This module provides functionality to replace the OWF services such as a message bus for 
 * inter-widget communication and the ability to track open widgets.  It is used by the main
 * electron (background) process.
 */
const { app, ipcMain, BrowserWindow, webContents } = require('electron');
const env = require('./helpers/env.js');
const path = require('path');
const createWindow = require("./helpers/window");
const widgetRegistry = require('./widgetRegistry.js');
const WIDGET_LAUNCHED_CM = 'Nn.WidgetLaunched';
const LAUNCH_WIDGET_CM = 'Nn.LaunchChannel';
const OWF_CHANNEL_PUBLISH = "OWF_CHANNEL_PUBLISH";
const OWF_CHANNEL_SUBSCRIBE = "OWF_CHANNEL_SUBSCRIBE";
const OWF_CHANNEL_UNSUBSCRIBE = "OWF_CHANNEL_UNSUBSCRIBE";
const OWF_CHANNEL_GET_OPEN_WIDGETS = "OWF_CHANNEL_GET_OPEN_WIDGETS";
const OWF_CHANNEL_GET_OPEN_WIDGETS_RESP = "OWF_CHANNEL_GET_OPEN_WIDGETS_RESP";
const OWF_ACTIVATE_WIDGET = "OWF_ACTIVATE_WIDGET";

/**
 * Map of all currently open widgets.  Index is BrowserWindow reference, value is
 * object with structure {widgetInstanceId, widgetLaunchData, widgetRegEntry}
 */
const openWidgetRegistry = new Map();

const generateGuid = function b(a) {
    return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b)
};

/**
 * Launch an owf widget in a new browser window and attaches a close listener that
 * will exit the app when the last non-background widget is closed.
 * 
 * @returns {BrowserWindow} reference to the launched window
 * @param {*} event 
 * @param {*} config 
 */
function launchWidget(event, config) {
    let winRegEntry = widgetRegistry.getWidgetRegistration(config.universalName);
    if(!winRegEntry) {
        //OWF throws an exception in this case inside async code and it's annoying when
        // you undeploy SMW.  Just log a warning.
        console.warn("Request to launch unknown widget failed: " + config.universalName);
        return;
    }

    let launchOnlyIfClosed = config.launchOnlyIfClosed || winRegEntry.singleton;
    let existingWidget;
    if(launchOnlyIfClosed) {
        //Find open windows with same universal name.  do nothing if found.
        //.entries() returns array with [0] = key and [1] = value of the map.
        let openWidgets = Array.from(openWidgetRegistry.entries());
        existingWidget = openWidgets.find((entry) => {
            return (entry[1].widgetRegEntry.universalName == config.universalName);
        });
        if(existingWidget && !winRegEntry.background) {
            //TODO: should we still send message back indicating success or failure?  E.g.:
            //event.sender.send(WIDGET_LAUNCHED_CM, regEntry.widgetRegEntry);
            existingWidget[0].focus();
            return existingWidget[0];
        }
    }
    if(existingWidget && winRegEntry.singleton) {
        return existingWidget[0];
    }
    //No open instance of the window. Launch by looking up the widgetURL from widget registry.
    let win = createWindow(winRegEntry.displayName || "NITES Next", {
        width: config.width || winRegEntry.width || 200,
        height: config.heigth || winRegEntry.height || 300,
        show: !winRegEntry.background,
        autoHideMenuBar: false,
        webPreferences: {
            //allowRunningInsecureContent: true,
            //webSecurity: false,
            nodeIntegration: false,
            preload: path.join(__dirname, 'ElectronOwfSPI.js')
        }
    });
    win.helpUrl = winRegEntry.helpUrl;

    win.on('close', (event) => {
        //console.info("before close: " + openWidgetRegistry.size);
        if(openWidgetRegistry.has(event.sender)) {
            openWidgetRegistry.delete(event.sender);
        }
        //remove this window from the list of subscribers for all channels
        subscriptionRegistry.forEach((subscribersForChannel, channelName, map) => {
            if(subscribersForChannel && subscribersForChannel.has(event.sender.id)) {
                // console.info("removing window from list of subscribers for channel " + channelName);
                subscribersForChannel.delete(event.sender.id);
            }
        });
        //Shutdown app when last non-background widget is closed.
        //.entries() returns array with [0] = key and [1] = value of the map.
        let openWidgets = Array.from(openWidgetRegistry.entries());
        let foregroundWidget = openWidgets.find((entry) => {
            let backgroundProp = entry[1].widgetRegEntry.background;
            if(!backgroundProp) {
                return entry[0];
            }
        });
        //If no foreground widgets are still open exit app
        if(!foregroundWidget) {
            // console.info("Last foreground widget is closing.  Exiting application.");
            app.exit();
        }
    });
    //store launched window in the registry of open windows in the main process
    let regEntry = {
        //the instanceId
        'id': generateGuid(),
        'widgetLaunchData': config,
        //Not sure this is necessary.  Could just store the universal name.
        'widgetRegEntry': winRegEntry,
    };
    openWidgetRegistry.set(win, regEntry);
    // if (env.name === 'development' && env.mode == 'debug') {
    //     win.openDevTools({mode: 'undocked'});
    // }
    //launched widget needs to know its widget instanceId
    win.instanceId = regEntry.id;
    win.loadURL(winRegEntry.widgetUrl);

    //receiver needs to link the launch request to the launch success.  do so using 
    // widget universal name.  not perfect, but should suffice.
    //When this method is called directly instead of as a result of receiving a message
    // from a renderer process there will be no event and no need to respond.
    if(event) {
        event.sender.send(WIDGET_LAUNCHED_CM, regEntry.widgetRegEntry);
    }
    return win;
}

//only do this once
function initOwfLauncher() {
    ipcMain.on(LAUNCH_WIDGET_CM, launchWidget);

    let GET_LAUNCH_DATA = "getLaunchData";
    //meant to be called synchronously
    ipcMain.on(GET_LAUNCH_DATA, (event) => {
        //lookup sender in openWidgetRegistry and reply synchronously with widget launch data
        let senderEntry = openWidgetRegistry.get(event.sender.getOwnerBrowserWindow());
        //Returning 'undefined' throws an exception but it's ok to return null
        event.returnValue = senderEntry == null? null : senderEntry.widgetLaunchData.data || null;
    });
}
function initOwfMessageBus() {
    ipcMain.on(OWF_CHANNEL_UNSUBSCRIBE, unsubscribeHandler);
    ipcMain.on(OWF_CHANNEL_SUBSCRIBE, subscribeHandler);
    ipcMain.on(OWF_CHANNEL_PUBLISH, publishHandler);
    ipcMain.on(OWF_CHANNEL_GET_OPEN_WIDGETS, getOpenWidgets);
    ipcMain.on(OWF_ACTIVATE_WIDGET, activateWidget);
}
function initOwf() {
    initOwfLauncher();
    initOwfMessageBus();
}

/**
 * Map of channelNames to Set of subscriberIds.  E.g.,
 * [
 *  {"channel1", [subscriberWinId1, subscriberWinId2, subscriberWinId3]},
 *  {"channel2", [subscriberWinId2, subscriberWinId5]}
 * ]
 */
var subscriptionRegistry = new Map();
/**
 * @dest is optional destination widget.  If null send to all subscribed widgets.  See 
 *  OWF APIs.  Currently dest is ignored.
 * @param srcWidget has form {id: <publishing widget's instanceId>}
 */
function publishHandler(event, channelName, payload, dest, srcWidget) {
    let subscriptionsForChannel = subscriptionRegistry.get(channelName);
    if(subscriptionsForChannel) {
        subscriptionsForChannel.forEach((webContentsId) => {
            //get win ref from winId
            let wc = webContents.fromId(webContentsId);
            //If window is no longer open, don't send it a message.  instead remove
            //it from subscribers list for the channel.  For Sets, unlike with arrays, 
            // each element will be visited once even if you delete an element during iteration.
            if( wc == null) {
                // console.info("attempt to send message to a closed window.  Removing subscription.");
                subscriptionsForChannel.delete(webContentsId);
            } else {
                let sender = BrowserWindow.fromWebContents(wc);
                sender.send(channelName, payload, srcWidget, channelName);
            }
        });
    }
}
//event.sender is a WebContents, not a browser window.
function subscribeHandler(event, channelName) {
    //Don't keep a reference to the window because it will prevent garbage collection 
    // if the window is closed.  Use window id instead.
    let subscriptionsForChannel = subscriptionRegistry.get(channelName);
    if(!subscriptionsForChannel) {
        //array based approach
        //subscriptionRegistry.set(channelName, [event.sender.id]);
        //The event.sender is a WebContents, not a window id, so can't use 
        // this in a call to BrowserWindow.fromId()
        subscriptionRegistry.set(channelName, new Set([event.sender.id]));
    } else {
        //array based approach
        //subscriptionsForChannel.push(event.sender.id);
        subscriptionsForChannel.add(event.sender.id);
    }
}
//TPR: would be easier with a set instead of array: set.delete().  
function unsubscribeHandler(event, channelName) {
    let subscriptionsForChannel = subscriptionRegistry.get(channelName);
    if(subscriptionsForChannel) {
        subscriptionsForChannel.delete(event.sender.id);
    }
}

function getOpenWidgets(event) {
    //Could use a remote interface to call BrowserWindow.getAllWindows(), but
    // then you only have access to the browser window, not the other info in
    // the openedWindows registry that is stored in the main process hashmap.
    //.entries() returns array with [0] = key and [1] = value of the map.
    let openWidgets = Array.from(openWidgetRegistry.entries());

    //for each openWidget add an entry to the openWidgets array.
    let openWidgetsResponseArray = [];
    openWidgets.forEach(function(widget) {
        openWidgetsResponseArray.push(
            {
                id: widget[1].id,
                //widgets don't occupy iframes in electron
                frameId: null,
                widgetGuid: widget[1].widgetRegEntry.guid,
                url: widget[1].widgetRegEntry.widgetUrl,
                name: widget[1].widgetRegEntry.displayName,
                universalName: widget[1].widgetRegEntry.universalName
            }
        );
    });
    // console.info("sending openWidgets response to render window with following open widgets");
    // console.info(openWidgetsResponseArray);
    event.sender.send(OWF_CHANNEL_GET_OPEN_WIDGETS_RESP, openWidgetsResponseArray);
}
/**
 * @param {object} cfg - @see owf.state.activateWidget in owf documentation
 */
function activateWidget(event, widgetId) {
    //console.info("activateWidget called with widget guid: " + widgetId);
    //
    let widget;
    let openWidgets = Array.from(openWidgetRegistry.entries());
    widget = openWidgets.find((entry) => {
        return (entry[1].id == widgetId);
    });
    //Activate the widget
    if(widget) {
        widget[0].focus();
    } else {
        console.warn("attempt to activate a widget with an unregistered widget instanceId");
    }
}

module.exports = {
    LAUNCH_WIDGET_CM: LAUNCH_WIDGET_CM,
    WIDGET_LAUNCHED_CM: WIDGET_LAUNCHED_CM,
    initOwf: initOwf,
    launchWidget: launchWidget,
    //consider encapsulating this better
    getOpenWidgetRegistry: () => {return openWidgetRegistry;}
}