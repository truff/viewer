import "./stylesheets/main.css";

// ----------------------------------------------------------------------------
// Everything below is just to show you how it works. You can delete all of it.
// ----------------------------------------------------------------------------

import { remote } from "electron";
import jetpack from "fs-jetpack";
//import { greet } from "./hello_world/hello_world";
import env from "env";

const app = remote.app;
const appDir = jetpack.cwd(app.getAppPath());

// Holy crap! This is browser window with HTML and stuff, but I can read
// files from disk like it's node.js! Welcome to Electron world :)
const manifest = appDir.read("package.json", "json");

const osMap = {
  win32: "Windows",
  darwin: "macOS",
  linux: "Linux"
};

document.querySelector("#about").style.display = "block";
document.querySelector("#productName").innerHTML = manifest.productName;
document.querySelector("#productVersion").innerHTML = manifest.productVersion;
document.querySelector("#env").innerHTML = env.name;
document.querySelector("#os").innerHTML = osMap[process.platform];
document.querySelector("#copyright").innerHTML = manifest.copyright;
document.querySelector("#homepage").innerHTML = manifest.homepage;


