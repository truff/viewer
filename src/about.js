const { remote, shell } = require("electron");
const jetpack = require("fs-jetpack");
const app = remote.app;
const appDir = jetpack.cwd(app.getAppPath());
const manifest = appDir.read("package.json", "json");

document.querySelector("#about").style.display = "block";
document.querySelector("#productName").innerHTML = manifest.productName;
document.querySelector("#productVersion").innerHTML = manifest.productVersion;
let homepage = manifest.homepage;
document.querySelector("#homepage").innerHTML = homepage;
document.querySelector("#homepage").addEventListener('click', (event)=>{
    shell.openItem(homepage);
});
