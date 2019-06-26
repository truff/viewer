const { app } = require("electron");
const owfService = require("../owfService.js");
const widgetRegistry = require('../widgetRegistry.js');

//List of nites widget unames in the order they are to appear in the Nites widget launch menu
const widgetMenuItems = [
    "nn.planaTerra",
    "AOIWidget.gis.fnmoc.navy.mil",
    "DataOrderingClient.gis.fnmoc.navy.mil",
    "GBS.gis.fnmoc.navy.mil",
    "MetocCalculator.gis.fnmoc.navy.mil",
    "nn.MetocDrawingTool",
    "MetocEnvironmentalAnalysis.gis.fnmoc.navy.mil",
    "METOCImpactsManager.gis.fnmoc.navy.mil",
    "ModelSelection.gis.fnmoc.navy.mil",
    "MOVREPEditor.gis.fnmoc.navy.mil",
    "NRDB.gis.fnmoc.navy.mil",
    "ObsEntry.gis.fnmoc.navy.mil",
    "PIMEditor.gis.fnmoc.navy.mil",
    "ProductSelectionTool.gis.fnmoc.navy.mil",
    "ServerManager.gis.fnmoc.navy.mil",
    "slac.fnmoc.navy.mil",
    "UserPreferences.gis.fnmoc.navy.mil"
    //for training environment only
    //,"nn.userAccountManager"
];

//TODO: whenever widgets are launched they should be added to the widget registry.
// To do that send message to widgetLaunch channel of main process with a widget
// config object.
function createWidgetMenuItem(uname) {
    let regEntry = widgetRegistry.getWidgetRegistration(uname);
    return {
        label: regEntry.displayName,
        click () {
            owfService.launchWidget(null, {universalName: uname});
        }
    }
}

const nitesSubMenuTemplate = widgetMenuItems.map(x => createWidgetMenuItem(x));
nitesSubMenuTemplate.push( 
    { type: 'separator' },
    {
        //role: 'quit'
        label: "Exit",
        accelerator: "Alt+F4",
        click: () => {
            app.quit();
        }
    }
);
const nitesMenuTemplate = {
    label: 'NITES-Next',
    submenu: nitesSubMenuTemplate
};

// const old_nitesMenuTemplate = {
//     label: 'NITES-Next',
//     submenu: [
//         {
//             label: 'Map',
//             click () {
//                 owfService.launchWidget(null, {universalName: "nn.planaTerra"});
//             }
//         },
//         {
//             label: 'AOI Manager',
//             click () {
//                 owfService.launchWidget(null, {universalName: "AOIWidget.gis.fnmoc.navy.mil"});
//             }
//         },
//         {
//             label: 'Data Ordering',
//             click () {
//                 owfService.launchWidget(null, {universalName: "DataOrderingClient.gis.fnmoc.navy.mil"});
//             }
//         },
//         {
//             label: 'GBS',
//             click () {
//                 owfService.launchWidget(null, {universalName: "GBS.gis.fnmoc.navy.mil"});
//             }
//         },
//         {
//             label: 'METOC Drawing Tool',
//             click () {
//                 owfService.launchWidget(null, {universalName: "nn.MetocDrawingTool"});
//             }
//         },
//         {
//             label: 'METOC Environmental Analysis',
//             click () {
//                 owfService.launchWidget(null, {universalName: "MetocEnvironmentalAnalysis.gis.fnmoc.navy.mil"});
//             }
//         },
//         {
//             label: 'METOC Impacts Manager',
//             click () {
//                 owfService.launchWidget(null, {universalName: "METOCImpactsManager.gis.fnmoc.navy.mil"});
//             }
//         },
//         {
//             label: 'METOC Calculator',
//             click () {
//                 owfService.launchWidget(null, {universalName: "MetocCalculator.gis.fnmoc.navy.mil"});
//             }
//         },
//         {
//             label: 'Model Selection',
//             click () {
//                 owfService.launchWidget(null, {universalName: "ModelSelection.gis.fnmoc.navy.mil"});
//             }
//         },
//         {
//             label: 'MOVREP Editor',
//             click () {
//                 owfService.launchWidget(null, {universalName: "MOVREPEditor.gis.fnmoc.navy.mil"});
//             }
//         },
//         {
//             label: 'NRDB',
//             click () {
//                 owfService.launchWidget(null, {universalName: "NRDB.gis.fnmoc.navy.mil"});
//             }
//         },
//         {
//             label: 'Observation Entry',
//             click () {
//                 owfService.launchWidget(null, {universalName: "ObsEntry.gis.fnmoc.navy.mil"});
//             }
//         },
//         {
//             label: 'Product Selection',
//             click () {
//                 owfService.launchWidget(null, {universalName: "ProductSelectionTool.gis.fnmoc.navy.mil"});
//             }
//         },
//         {
//             label: 'PIM Editor',
//             click () {
//                 owfService.launchWidget(null, {universalName: "PIMEditor.gis.fnmoc.navy.mil"});
//             }
//         },
//         {
//             label: 'Server Manager',
//             click () {
//                 owfService.launchWidget(null, {universalName: "ServerManager.gis.fnmoc.navy.mil"});
//             }
//         },
//         {
//             label: 'Solar Lunar Almanac Prediction',
//             click () {
//                 owfService.launchWidget(null, {universalName: "slac.fnmoc.navy.mil"});
//             }
//         },
//         {
//             label: 'User Preferences',
//             click () {
//                 owfService.launchWidget(null, {universalName: "UserPreferences.gis.fnmoc.navy.mil"});
//             }
//         },
//         //TPR: only list UAM for training environment
//         // {
//         //     label: 'User Account Manager',
//         //     click () {
//         //         owfService.launchWidget(null, {universalName: "nn.userAccountManager"});
//         //     }
//         // },
//         {
//             type: 'separator'
//         },
//         {
//             //role: 'quit'
//             label: "Exit",
//             accelerator: "Alt+F4",
//             click: () => {
//                 app.quit();
//             }
//         }
//     ]
// };

module.exports = nitesMenuTemplate;
