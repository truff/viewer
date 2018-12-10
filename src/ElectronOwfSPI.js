//const electron = require('electron');
const { ipcRenderer } = require('electron');
//const { BrowserWindow } = require('electron').remote;
//debugger

let OWF = {};
let Ozone = {};
process.once('loaded', () => {
    global.OWF = OWF;
    global.Ozone = Ozone;
});


//for loading as local file
//const registry = require('./widgetRegistry.js');
//const appPath = remote.app.getAppPath();
//const registryScript = require.resolve(appPath + '/src/widgetRegistry.js');
//console.log('registry path: ' + registryScript);
//const registry = require(registryScript);
//const createWindow = require(appPath + '/src/helpers/window.js');

//Launch widget channel message
const WIDGET_LAUNCHED_CM = "Nn.WidgetLaunched";
const LAUNCH_WIDGET_CM = "Nn.LaunchChannel";
const OWF_CHANNEL_PUBLISH = "OWF_CHANNEL_PUBLISH";
const OWF_CHANNEL_SUBSCRIBE = "OWF_CHANNEL_SUBSCRIBE";
const OWF_CHANNEL_UNSUBSCRIBE = "OWF_CHANNEL_UNSUBSCRIBE";
var generateGuid = function b(a) {
    return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b)
};

//For some reason the default limit of 10 is being exceeded for 
// Nn.WidgetLaunched even though we only register one time handlers 
// for that message.  For now up to 25 and watch for this error to return:
// (node:10260) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 Nn.WidgetLaunched listeners added. Use emitter.setMaxListeners() to increase limit
ipcRenderer.setMaxListeners(25);

/**
 * @see OWF APIs
 */
let instanceId = generateGuid();
let widgetLaunchData = null;

//Add all OWF namespaces
function addNamespace(obj, namespace) {
    obj[namespace] = obj.namespace || {};
    return obj[namespace];
}
addNamespace(OWF, "Launcher");
addNamespace(OWF, "Eventing");
addNamespace(OWF, "Preferences");
addNamespace(OWF, "Util");
//addNamespace(OWF, "Internal");

addNamespace(Ozone, "launcher");
addNamespace(Ozone, "util");
addNamespace(Ozone, "eventing");
addNamespace(Ozone, "pref");
addNamespace(Ozone, "state");

/**
 * Should be called by main process after launching to set the widget launch data.
 */
//OWF.Internal.setLaunchData = function(launchData) {
//    widgetLaunchData = launchData;
//};
//OWF.Internal.setInstanceId = function(id) {
//    instanceId = id;
//};

/**
 * OWF API Methods
 */
OWF.runningInElectron = true;
OWF.test = function() {
    console.info("ElectronOwfSPI loaded");
};
OWF.getIframeId = function() {
    return { "id": instanceId };
};
OWF.getInstanceId = function() {
    //Used by eventing, e.g., communicated to receiving widget when publishing a channel
    // message or when a channel message is sent to one widget only.
    return instanceId;
};
/**
 * @returns {string} guid for the widget definition, shared across all instances of the
 *  widget.
 */
OWF.getWidgetGuid = function() {
    //TODO: The widget must know it's own universal name to lookup its own widgetGuid
};
OWF.getContainerName = function() {
    //In OWF this returns undefined, but we'll set it anyway
    return "Electron";
};
OWF.getContainerUrl = function() {
    //the container is an executable on the local file system, not a web app
    return null;
};
OWF.getContainerVersion = function() {
    return "1.0";
};
OWF.getCurrentTheme = function() {
    return {};
};
OWF.getDashboardLayout = function() {
    return "desktop";
};
OWF.notifyWidgetReady = function() {
    //Move along. Nothing to see here.
};
OWF.ready = function(handler, scope) {
    //synchronously request our widgetInstanceId and launchData from main process
    //let GET_LAUNCH_DATA_RESPONSE = "getLaunchDataResponse";
    let GET_LAUNCH_DATA = "getLaunchData";
    //TPR: doesn't get called for sync messaging
    //ipcRenderer.once(GET_LAUNCH_DATA_RESPONSE, (event, widgetRegEntry) => {
    //    console.info("setting launch data in launched widget");
    //    if(callback) {
    //        callback();
    //    }
    //});
    //request launch data
    widgetLaunchData = ipcRenderer.sendSync(GET_LAUNCH_DATA);
    //console.info("onReady retrieved widgetLaunchData: " + widgetLaunchData);

    //This change makes this function async, which ensures that its behavior
    // more closely matches the real OWF.ready function behavior.  For most
    // users this doesn't make a difference but there are edge cases that 
    // depend on it (e.g., the metadata metaurl widget's angular framework
    // doesn't initialize correctly without this change.)
    //handler.bind(scope)();
    setTimeout(handler.bind(scope), 0);
};
/**
 * @async
 * callback will be called with an array of objects with the below structure:
 *  {
 *      id: 'instance guid of widget',
 *      frameId: 'iframe id of widget',
 *      widgetGuid: 'widget guid of the widget',
 *      url: 'url of the widget',
 *      name: 'name of the widget',
 *      universalName: 'universal name of the widget'
 *  }
 */
OWF.getOpenedWidgets = function(callback) {
    //TODO: Mdt calls this method in paletteWindow.js.
    //Could use a remote interface to call BrowserWindow.getAllWindows(), but
    // then you only have access to the browser window, not the other info in
    // the openedWindows registry that is stored in the main process hashmap.
    //Query the main process for a list of open widgets. for testing
    // use this:
    if(typeof callback == "function") {
        let openWidgets = [
            {
                id: 'instance guid of widget',
                frameId: 'iframe id of widget',
                widgetGuid: 'widget guid of the widget',
                url: 'url of the widget',
                name: 'name of the widget',
                universalName: 'universal name of the widget'
            }
        ];
        callback(openWidgets);
    }
};
OWF.getPanes = function(callback) {
    if(typeof callback == "function") {
        callback({
            id: 'desktop',
            type: 'desktoppane',
            x: 0, y: 0,
            height: 1024,
            width: 1280,
            widgets: []
        });
    }
};
/**
 * OWF.Eventing Methods
 */
let subscriptions = new Set();
OWF.Eventing.publish = function(channelName, message, dest) {
    //TODO: need to make sure ipcMain uses dest as per OWF spec.  electron doesn't have 
    // this concept built-in to its messaging bus.
    let srcWidget = { id: instanceId };
    ipcRenderer.send(OWF_CHANNEL_PUBLISH, channelName, message, dest, srcWidget);
};

//adaptor to map electron subscribeHandler to OWF subscribe handler
subscribeHandlerProxy = function(handler, event, payload, srcWidget, channelName) {
    //must call the OWF handler function with params sender, msg, channel
    handler(JSON.stringify(srcWidget), payload, channelName);
};

OWF.Eventing.subscribe = function(channelName, handler) {
    //OWF doesn't allow multiple subscriptions to the same channel from a widget.
    // To emulate that behavior keep track of the channels we've subscribed to.
    if(!subscriptions.has(channelName)) {
        ipcRenderer.on(channelName, subscribeHandlerProxy.bind(null, handler));
        ipcRenderer.send(OWF_CHANNEL_SUBSCRIBE, channelName);
        subscriptions.add(channelName);
    }
};

OWF.Eventing.unsubscribe = function(channelName) {
    ipcRenderer.send(OWF_CHANNEL_UNSUBSCRIBE, channelName);
    ipcRenderer.removeAllListeners(channelName);
    subscriptions.delete(channelName);
};

/**
 * OWF.Launcher Methods
 */
OWF.Launcher.getLaunchData = function() {
    return widgetLaunchData;
};
/**
 * Launches a widget.
 * @param {*} config @see owf API
 * @param {*} callback @see owf API
 */
OWF.Launcher.launch = function(config, callback) {
    //TODO: the widget launch data must be stored and made available to the launched widget
    // so it can query its launch data.  The launched widget also needs info from it's 
    // registry entry, esp its universal name.
    config = config || {};
    ipcRenderer.once(WIDGET_LAUNCHED_CM, (event, widgetRegEntry) => {
        console.info("successfully launched widget");
        if(callback) {
            callback();
        }
    });
    ipcRenderer.send(LAUNCH_WIDGET_CM, config);
};

/**
 * OWF.Preferences Methods
 */
//TPR: Not sure NN uses most of these Prefs API methods.
OWF.Preferences.deleteUserPreference = function(cfg) {
    //TODO: impl
};
OWF.Preferences.doesUserPreferenceExist = function(cfg) {
    //TODO: impl
};

/**
     * @description retrieves the current user logged into the system
     * @param {Object} cfg config object see below for properties
     * @param {Function} cfg.onSuccess The callback function that is called for a successful retrieval of the user logged in.
     * This method is passed an object having the following properties:<br>
     * <br>
     *     {String} currentUserName: user name<br>
     *     {String} currentUser: user real name<br>
     *     {Date} currentUserPrevLogin: previous login date<br>
     *     {Number} currentId: database pk index<br>
     * <br>
     * @param {Function} cfg.[onFailure] The callback function that is called when the system is unable to retrieve the current user logged in. Callback parameter is an error string.
     * @example
     *
     * var onSuccess = function(obj) {
     *     if (obj) {
     *         alert(obj.currentUser);
     *     }
     * };
     *
     * var onFailure = function(error) {
     *     alert(error);
     * };
     *
     * Ozone.pref.PrefServer.getCurrentUser({
     *     onSuccess:onSuccess,
     *     onFailure:onFailure
     * });
     */
OWF.Preferences.getCurrentUser = function(cfg) {
    //cfg.onSuccess({ currentUserName: 'Thomas.Ruff' });
    //let user = ipcRenderer.sendSync('getCurrentUser');
    //cfg.onSuccess({ currentUserName: user });
    //TODO: need to ensure that request/response are linked.
    ipcRenderer.once('getCurrentUserResp', function(evt, name) {
        //console.info("processing getCurrentUserResp event for " + name);
        cfg.onSuccess({ currentUserName: name });
    });
    ipcRenderer.send('getCurrentUser');
};

OWF.Preferences.getUrl = function() {
    //TODO: impl
};
OWF.Preferences.getUserPreference = function(cfg) {
    //TODO: impl
};
OWF.Preferences.getWidget = function(cfg) {
    //TODO: impl
};
OWF.Preferences.setUserPreference = function(cfg) {
    //TODO: impl
};

/**
 * OWF.Utils Methods
 */
OWF.Util.guid = function() {
    return generateGuid();
};
//Currently most NN Widgets just exit if they don't think they are running in NN.
OWF.Util.isRunningInOWF = function() {
    return true;
};
OWF.Util.isInContainer = function() {
    return true;
};

/**
 * functions in Ozone namespace
 */
var noop = function() { };
Ozone.state.WidgetState = function() {
    return {
        version: '1',
        //TODO(TPR): bring window to front
        activateWidget: noop,
        //used by PST
        addStateEventListeners: noop,
        //used by PST
        addStateEventOverrides: noop,
        //used by PST
        closeWidget: noop,
        //used by PST
        //getInstance: function() { return Ozone.state.WidgetState },
        getRegisteredStateEvents: noop,
        getWidgetState: noop,
        init: noop,
        onStateEventReceived: noop,
        //used by PST
        removeStateEventListeners: noop,
        //used by PST
        removeStateEventOverrides: noop
        //TODO: add the rest of the Ozone.state.WidgetState methods
    };
};
var widgetStateInstance = null;
//used by PST
Ozone.state.WidgetState.getInstance = function(cfg) {
    if(!widgetStateInstance) {
        widgetStateInstance = new Ozone.state.WidgetState();
    }
    return widgetStateInstance;
};
//TODO(TPR): there are other methods in the Ozone.state namespace that could be implemented

Ozone.util.isRunningInOWF = OWF.Util.isRunningInOWF;
Ozone.util.parseJson = function(json) {
    return JSON.parse(json);
};

