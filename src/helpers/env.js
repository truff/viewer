const fs = require('fs');
let file;
let env = {};

function isDev() {
    let isDev = false;
    process.argv.forEach(function (val, index, array) {
        if(val == "dev") {
            //console.log("setting dev mode");
            isDev = true;
        }
    });
    return isDev;
}

if(isDev()) {
    file = '../../config/env_development.json';
} else {
    file = '../../config/env_production.json';
}
//let configObj = JSON.parse(fs.readFileSync(file, 'utf8'));
let configObj = require(file);
for(let prop in configObj) {
    env[prop] = configObj[prop];
    //console.info(prop + ": " + env[prop]);
}
//console.info("Serving NITES-Next from: " + env.nites_host);
module.exports = env;