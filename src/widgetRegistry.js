/**
 * This module is a registry of NITES-Next widgets.  It contains the information from
 * each widget's descriptor.html.  This file was developed for the Viewer pilot effort
 * and should problably be replaced at some point by a widget registration application
 * that can read descriptors such as the descriptor.html files and update the widget
 * registry during runtime.
 */
//IMPORTANT: Do not place boolean property values in quotes!
const env = require('./helpers/env.js');
const defaultHostUrl = env.nites_host;
const planaTerraRootContext = "/planaTerra";
const cpaRootContext = "/cpawidget";
const docRootContext = "/doc";
const gbsRootContext = "/GbsUI";
const mdtRootContext = "/mdt";
const serverManagerRootContext = "/servermanager";
const metaInfoRootContext = "/mw/metaurl";
const metadataRootContext = "/mw";
const mapDetailRootContext = "/map-detail";
const pimEditorRootContext = "/pim-editor";
const animationRootContext = "/animation";
const anftRootContext = "/cqlfilter";
const meaRootContext = "/metocEnvironmentalAnalysis";
const layerLegendRootContext = "/mw/legends";
const layerStylerRootContext = "/layereditor";
const aoiWidgetRootContext = "/aoiwidget";
const obsEntryRootContext = "/obsentry";
const pstRootContext = "/mapss";
const analysisTimeWidgetRootContext = "/analysisTimeWidget";
const metocimpactsRootContext = "/metocimpacts";
const modelSelectionRootContext = "/modelselection";
const nrdbRootContext = "/NrdbSvc";
const moveRepEditorRootContext = "/MOVREPEditor";
const slacRootContext = "/slacWidgetUI";
const metoccalcRootContext = "/metoccalc";
const userPrefsRootContext = "/userprefsvc";
const userAcctMgrRootContext = "/userAccountManager";

//To create widget guid run a guid generator e.g. https://www.guidgenerator.com/online-guid-generator.aspx
// or call OWF.Util.guid()
const registry = [
    {
        //planaTerra
        "universalName": "nn.planaTerra",
        "description": "View and investigate data layers.",
        "height": 550,
        "width": 850,
        "visible": true,
        //Important: to prevent caching of static html page use PlanaTerra's default homepage.
        "widgetUrl": defaultHostUrl + planaTerraRootContext,
        "singleton": false,
        "imageUrlSmall": defaultHostUrl + planaTerraRootContext + "/images/map.png",
        "imageUrlMedium": defaultHostUrl + planaTerraRootContext + "/images/map.png",
        "background": false,
        "displayName": "Map",
        "guid": "47383faa-3d32-4c59-913e-408e34a1a4da"
    }, {
        //AlphanumericFiltering & thresholding
        "universalName": "ANFT.gis.fnmoc.navy.mil",
        "displayName": "Alphanumeric Filtering & Thresholding",
        "widgetUrl": defaultHostUrl + anftRootContext + "/ANFT.html",
        "imageUrlSmall": defaultHostUrl + anftRootContext + "/images/anft-icon.png",
        "imageUrlMedium": defaultHostUrl + anftRootContext + "/images/anft-icon.png",
        "width": 600,
        "height": 400,
        "guid": "0befc501-86a9-4783-9447-dc1594c84d43"
    }, {
        //Analysis Time Widget
        "universalName": "AnalysisTimeWidget.gis.fnmoc.navy.mil",
        "displayName": "Analysis Time Widget",
        "widgetUrl": defaultHostUrl + analysisTimeWidgetRootContext + "/AnalysisTimeWidget.html",
        "imageUrlSmall": defaultHostUrl + analysisTimeWidgetRootContext + "/images/analysisTimeWidget-icon.png",
        "imageUrlMedium": defaultHostUrl + analysisTimeWidgetRootContext + "/images/analysisTimeWidget-icon.png",
        "width": 600,
        "height": 450,
        "visible": false,
        "singleton": true,
        "background": false,
        "guid": "135227e7-516e-4c7f-acde-318f0fc47823"
    }, {
        //Animation
        "universalName": "Animation.gis.fnmoc.navy.mil",
        "displayName": "Map Detail",
        "widgetUrl": defaultHostUrl + animationRootContext,
        "imageUrlSmall": defaultHostUrl + animationRootContext + "/resources/images/launch-icon.png",
        "imageUrlMedium": defaultHostUrl + animationRootContext + "/resources/images/launch-icon.png",
        "width": 375,
        "height": 375,
        "guid": "463bcfd8-8dbf-44d1-9e1d-0b7165897511"
    }, {
        //AOI Manager
        "universalName": "AOIWidget.gis.fnmoc.navy.mil",
        "displayName": "AOI",
        "widgetUrl": defaultHostUrl + aoiWidgetRootContext + "/AOI.html",
        "width": 630,
        "height": 700,
        "visible": true,
        "guid": "42dcacae-9ead-4d9d-8838-87d7943e9683"
    }, {
        //CPA
        "universalName": "CPAWidget.gis.fnmoc.navy.mil",
        "displayName": "CPA Widget",
        "widgetUrl": defaultHostUrl + cpaRootContext + "/CPA.html",
        "imageUrlSmall": defaultHostUrl + cpaRootContext + "/images/aoi-icon.png",
        "imageUrlMedium": defaultHostUrl + cpaRootContext + "/images/aoi-icon.png",
        "width": 600,
        "height": 600,
        "visible": false,
        "singleton": true,
        "background": false,
        "guid": "5b210714-7340-4792-9236-996e786b4916"
    }, {
        //DOC
        "universalName": "DataOrderingClient.gis.fnmoc.navy.mil",
        "displayName": "Data Ordering Client",
        "widgetUrl": defaultHostUrl + docRootContext + "/Selection.html",
        "imageUrlSmall": defaultHostUrl + docRootContext + "/images/doc-icon.png",
        "imageUrlMedium": defaultHostUrl + docRootContext + "/images/doc-icon.png",
        "width": 800,
        "height": 700,
        "visible": true,
        "singleton": true,
        "background": false,
        "guid": "b6d8fee6-3d1d-4f36-9e62-05484f1a2eb4"
    }, {
        //Environmental Analysis
        "universalName": "MetocEnvironmentalAnalysis.gis.fnmoc.navy.mil",
        "displayName": "Environmental Analysis",
        "widgetUrl": defaultHostUrl + meaRootContext + "/Selection.html",
        "imageUrlSmall": defaultHostUrl + meaRootContext + "/images/mea-icon.png",
        "imageUrlMedium": defaultHostUrl + meaRootContext + "/images/mea-icon.png",
        "width": 600,
        "height": 400,
        "guid": "31feff8d-6bf5-48cc-94a1-a7f84e24acd3"
    }, {
        //GBS
        "universalName": "GBS.gis.fnmoc.navy.mil",
        "displayName": "GBS",
        "widgetUrl": defaultHostUrl + gbsRootContext + "/index.html",
        "imageUrlSmall": defaultHostUrl + gbsRootContext + "/images/gbs_16.png",
        "imageUrlMedium": defaultHostUrl + gbsRootContext + "/images/gbs_16.png",
        "width": 500,
        "height": 300,
        "guid": "0fc909c5-b6be-4a32-90a1-08f53b9dbed0",
        "singleton": true,
        "visible": true,
        "background": false        
    }, {
        //Kml Manager    
        "universalName": "nn.KmlManager",
        "widgetUrl": defaultHostUrl + "/kmlManager",
        "guid": "cb614809-673a-4737-96db-d2ef8d7acce2"
    }, {
        //Layer Legend
        "universalName": "nn.legendInfo",
        "displayName": "Layer Legend",
        "widgetUrl": defaultHostUrl + layerLegendRootContext,
        "imageUrlSmall": defaultHostUrl + layerLegendRootContext + "/images/details.jpg",
        "imageUrlMedium": defaultHostUrl + layerLegendRootContext + "/images/details.jpg",
        "width": 200,
        "height": 200,
        "guid": "90aae5a9-c243-49af-b02c-e452ce0459ce"
    }, {
        //Layer Styler
        "universalName": "LayerStyler.gis.fnmoc.navy.mil",
        "displayName": "Layer Styler",
        "widgetUrl": defaultHostUrl + layerStylerRootContext + "/LayerEditor.html",
        "imageUrlSmall": defaultHostUrl + layerStylerRootContext + "/images/layereditor-icon.png",
        "imageUrlMedium": defaultHostUrl + layerStylerRootContext + "/images/layereditor-icon.png",
        "width": 600,
        "height": 450,
        "guid": "9193bb10-8b32-43f9-b0b4-f3f2f07f92fc"
    }, {
        //Map Detail
        "universalName": "MapDetail.gis.fnmoc.navy.mil",
        "displayName": "Map Detail",
        "widgetUrl": defaultHostUrl + mapDetailRootContext + "/Mapdetail.html",
        "imageUrlSmall": defaultHostUrl + mapDetailRootContext + "/images/pref-icon.png",
        "imageUrlMedium": defaultHostUrl + mapDetailRootContext + "/images/pref-icon.png",
        "width": 200,
        "height": 200,
        "singleton": true,
        "guid": "c52184a3-7104-48e0-b958-2047aa8530ab"
    }, {
        //Metadata Info
        "universalName": "nn.MetadataUrl",
        "displayName": "Metadata Info",
        //"widgetUrl": defaultHostUrl + metaInfoRootContext + "/index.html",
        "widgetUrl": defaultHostUrl + metaInfoRootContext + "/ViewerHomeStatic.html",
        "imageUrlSmall": defaultHostUrl + metaInfoRootContext + "/images/details.jpg",
        "imageUrlMedium": defaultHostUrl + metaInfoRootContext + "/images/details.jpg",
        "width": 350,
        "height": 500,
        "visible": false,
        "guid": "d4e2b444-452a-4929-9b3f-05d09e6c048c"
    }, {
        //Metadata Widget
        "universalName": "nn.wmsinfo",
        "displayName": "Metadata Widget",
        "widgetUrl": defaultHostUrl + metadataRootContext,
        "imageUrlSmall": defaultHostUrl + metadataRootContext + "/images/details.png",
        "imageUrlMedium": defaultHostUrl + metadataRootContext + "/images/details.png",
        "width": 600,
        "height": 450,
        "singleton": true,
        "guid": "97c66f36-5029-4e85-9d21-bf631119c2a5"
    }, {
        //MetOc Calculator
        "universalName": "MetocCalculator.gis.fnmoc.navy.mil",
        "displayName": "MetOc Calculator",
        "widgetUrl": defaultHostUrl + metoccalcRootContext,
        "imageUrlSmall": defaultHostUrl + metoccalcRootContext + "/images/app24x24.png",
        "imageUrlMedium": defaultHostUrl + metoccalcRootContext + "/images/app24x24.png",
        "width": 670,
        "height": 270,
        "singleton": false,
        "visible": true,
        "guid": "a2faa1ff-728c-4649-80bc-21a213d12501"
    }, {
        //MDT
        "universalName": "nn.MetocDrawingTool",
        "displayName": "MetOc Drawing Tool",
        "description": "Select annotations to display on the Map",
        "widgetVersion": "1.0",
        //IMPORTANT! Use the html version of this file because it fixes the electron module 
        // issue with jquery undefined.
        //"widgetUrl": defaultHostUrl + mdtRootContext + "/index.jsp",
        "widgetUrl": defaultHostUrl + mdtRootContext + "/index.html",
        "imageUrlSmall": defaultHostUrl + mdtRootContext + "/images/launch-icon.png",
        "imageUrlMedium": defaultHostUrl + mdtRootContext + "/images/launch-icon.png",
        "width": 160,
        "height": 260,
        "visible": true,
        //currently this widget is not a singleton but it should be.
        //"singleton": false,
        "singleton": true,
        "background": false,
        "guid": "bb75a439-a748-4da1-84ae-98c3454b4f78"
    }, {
        //MI Manager
        "universalName": "METOCImpactsManager.gis.fnmoc.navy.mil",
        "displayName": "MI Manager",
        "widgetUrl": defaultHostUrl + metocimpactsRootContext + "/MetocImpactsManager.html",
        "imageUrlSmall": defaultHostUrl + metocimpactsRootContext + "/images/metocimpacts.png",
        "imageUrlMedium": defaultHostUrl + metocimpactsRootContext + "/images/metocimpacts.png",
        "width": 310,
        "height": 650,
        "visible": true,
        "singleton": true,
        "background": false,
        "guid": "e59ab693-bae9-4c1a-8bec-e59a7fd3549c"
    }, {
        //MI Assets
        "universalName": "METOCImpactsAssets.gis.fnmoc.navy.mil",
        "displayName": "MI Assets",
        "widgetUrl": defaultHostUrl + metocimpactsRootContext + "/MetocImpactsAssets.html",
        "imageUrlSmall": defaultHostUrl + metocimpactsRootContext + "/images/asset-small.png",
        "imageUrlMedium": defaultHostUrl + metocimpactsRootContext + "/images/asset-small.png",
        "width": 400,
        "height": 650,
        "visible": false,
        "singleton": false,
        "background": false,
        "guid": "7b98822e-8acc-42bf-ab8a-dfd69fc25f2b"
    }, {
        //MI Locations
        "universalName": "METOCImpactsLocations.gis.fnmoc.navy.mil",
        "displayName": "MI Locations",
        "widgetUrl": defaultHostUrl + metocimpactsRootContext + "/MetocImpactsLocations.html",
        "imageUrlSmall": defaultHostUrl + metocimpactsRootContext + "/images/location-small.png",
        "imageUrlMedium": defaultHostUrl + metocimpactsRootContext + "/images/location-small.png",
        "width": 400,
        "height": 650,
        "visible": false,
        "singleton": false,
        "background": false,
        "guid": "84a4c0fb-d8f0-40b4-b8f5-96f18bbd2705"
    }, {
        //MI Rules
        "universalName": "METOCImpactsRules.gis.fnmoc.navy.mil",
        "displayName": "MI Rules",
        "widgetUrl": defaultHostUrl + metocimpactsRootContext + "/MetocImpactsRules.html",
        "imageUrlSmall": defaultHostUrl + metocimpactsRootContext + "/images/rule-small.png",
        "imageUrlMedium": defaultHostUrl + metocimpactsRootContext + "/images/rule-small.png",
        "width": 400,
        "height": 650,
        "visible": false,
        "singleton": false,
        "background": false,
        "guid": "c3da362d-e898-4ef0-8479-6f3905cad96b"
    }, {
        //MI Summary
        "universalName": "METOCImpactsSummary.gis.fnmoc.navy.mil",
        "displayName": "MI Summary",
        "widgetUrl": defaultHostUrl + metocimpactsRootContext + "/MetocImpactsSummary.html",
        "imageUrlSmall": defaultHostUrl + metocimpactsRootContext + "/images/summary-small.png",
        "imageUrlMedium": defaultHostUrl + metocimpactsRootContext + "/images/summary-small.png",
        "width": 400,
        "height": 650,
        "visible": false,
        "singleton": false,
        "background": false,
        "guid": "a7485106-e28d-4445-92ab-306a4df90ec2"
    }, {
        //Model Selection
        "universalName": "ModelSelection.gis.fnmoc.navy.mil",
        "displayName": "Model Selection",
        "widgetUrl": defaultHostUrl + modelSelectionRootContext + "/ModelSelection.html",
        "imageUrlSmall": defaultHostUrl + modelSelectionRootContext + "/images/modelselection.png",
        "imageUrlMedium": defaultHostUrl + modelSelectionRootContext + "/images/modelselection.png",
        "width": 310,
        "height": 650,
        "visible": true,
        "singleton": true,
        "background": false,
        "guid": "60d38a97-cf1f-4c54-a182-1c9c636de243"
    }, {
        //MOVREPEditor
        "universalName": "MOVREPEditor.gis.fnmoc.navy.mil",
        "displayName": "MOVREP Editor",
        "widgetUrl": defaultHostUrl + moveRepEditorRootContext + "/index.html",
        "imageUrlSmall": defaultHostUrl + moveRepEditorRootContext + "/images/movrepeditor.png",
        "imageUrlMedium": defaultHostUrl + moveRepEditorRootContext + "/images/movrepeditor.png",
        "width": 600,
        "height": 600,
        "visible": true,
        "singleton": true,
        "background": false,
        "guid": "c735ad08-4390-404b-801d-6ae9787ac489"
    }, {
        //NRDB
        "universalName": "NRDB.gis.fnmoc.navy.mil",
        "displayName": "NRDB",
        "widgetUrl": defaultHostUrl + nrdbRootContext + "/index.html",
        "imageUrlSmall": defaultHostUrl + nrdbRootContext + "/images/nrdb_16.png",
        "imageUrlMedium": defaultHostUrl + nrdbRootContext + "/images/nrdb_16.png",
        "width": 500,
        "height": 300,
        "visible": true,
        "singleton": true,
        "background": false,
        "guid": "7989d6e5-0c86-4f31-aa2b-8233d4347f85"
    }, {
        //ObsEntry
        "universalName": "ObsEntry.gis.fnmoc.navy.mil",
        "displayName": "Obs Entry",
        "widgetVersion": "1.0",
        "widgetUrl": defaultHostUrl + obsEntryRootContext + "/index.jsp",
        "imageUrlSmall": defaultHostUrl + obsEntryRootContext + "/resources/images/launch-icon.png",
        "imageUrlMedium": defaultHostUrl + obsEntryRootContext + "/resources/images/launch-icon.png",
        "width": 700,
        "height": 500,
        "visible": true,
        "singleton": true,
        "background": false,
        "guid": "e69772f3-7518-4efb-846c-13a2118bb08b"
    }, {
        //PIM
        "universalName": "PIMEditor.gis.fnmoc.navy.mil",
        "displayName": "PIM Editor",
        "widgetUrl": defaultHostUrl + pimEditorRootContext + "/PIMEditor.html",
        "imageUrlSmall": defaultHostUrl + pimEditorRootContext + "/images/pimeditor.png",
        "imageUrlMedium": defaultHostUrl + pimEditorRootContext + "/images/pimeditor.png",
        "width": 600,
        "height": 450,
        "singleton": true,
        "guid": "f15896ce-4310-4fb1-bc4f-9fc0fab1ed98"
    }, {
        //PST
        "universalName": "ProductSelectionTool.gis.fnmoc.navy.mil",
        "displayName": "Product Selection",
        "widgetVersion": "1.0",
        "widgetUrl": defaultHostUrl + pstRootContext + "/Selection.html",
        "imageUrlSmall": defaultHostUrl + pstRootContext + "/images/mapss-icon.png",
        "imageUrlMedium": defaultHostUrl + pstRootContext + "/images/mapss-icon.png",
        "width": 750,
        "height": 700,
        "visible": true,
        "singleton": true,
        "background": false,
        "guid": "73c84770-39dc-44af-8c79-75e7bb8bcdf1"
    }, {
        //Server Manager Widget
        "universalName": "ServerManager.gis.fnmoc.navy.mil",
        "displayName": "Server Manager",
        "widgetUrl": defaultHostUrl + serverManagerRootContext + "/ServerManager.html",
        "imageUrlSmall": defaultHostUrl + serverManagerRootContext + "/images/srvmgr-icon.png",
        "imageUrlMedium": defaultHostUrl + serverManagerRootContext + "/images/srvmgr-icon.png",
        "width": 960,
        "height": 320,
        "visible": true,
        "singleton": true,
        "background": false,
        "guid": "217e486e-9700-4f09-8166-6dd2486fde34"
    }, {
        //Solar Lunar Almanac Prediction
        "universalName": "slac.fnmoc.navy.mil",
        "displayName": "Solar Lunar Almanac Prediction",
        "widgetUrl": defaultHostUrl + slacRootContext + "/viewerStartPage.jsp",
        "imageUrlSmall": defaultHostUrl + slacRootContext + "/images/owf/icon.png",
        "imageUrlMedium": defaultHostUrl + slacRootContext + "/images/owf/icon.png",
        "width": 300,
        "height": 500,
        "visible": true,
        "singleton": true,
        "background": false,
        "guid": "f7cd9c35-10ab-4591-887c-3798145d2542"
    }, {
        //User Acct Mgr
        "universalName": "nn.userAccountManager",
        "displayName": "User Account Manager",
        "widgetUrl": defaultHostUrl + userAcctMgrRootContext,
        "imageUrlSmall": defaultHostUrl + userAcctMgrRootContext + "/images/launch-icon.png",
        "imageUrlMedium": defaultHostUrl + userAcctMgrRootContext + "/images/launch-icon.png",
        "width": 400,
        "height": 500,
        "visible": true,
        "singleton": false,
        "background": false,
        "guid": "c575e433-5bb1-46df-b123-ca1a241fd190"
    }, {
        //UserPrefs Svc
        "universalName": "UserPreferences.gis.fnmoc.navy.mil",
        "displayName": "User Preferences",
        "widgetUrl": defaultHostUrl + userPrefsRootContext + "/UserPreferenceSvc.html",
        "imageUrlSmall": defaultHostUrl + userPrefsRootContext + "/images/pref-icon.png",
        "imageUrlMedium": defaultHostUrl + userPrefsRootContext + "/images/pref-icon.png",
        "width": 500,
        "height": 700,
        "visible": true,
        "singleton": true,
        "background": false,
        "guid": "457fdd38-52a3-41c0-a813-37f23eca11b9"
    }
];

function getWidgetRegistration(uname) {
    return registry.find((element) => {
        return uname == element.universalName;
    });
}

module.exports = {
    getWidgetRegistration: getWidgetRegistration
}
