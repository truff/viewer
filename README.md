# Quick start
Make sure you have [Node.js](https://nodejs.org) installed, then type the following commands
from the project root directory to build and launch:
```
npm install
npm start
```

# Debugging
To start with debugging enabled:
```
npm start dev
```

# Distribution
To package for distribution on Windows:
```
npm run dist
```

# Environments
Environmental variables are done in a bit different way (not via `process.env`). Env files are 
plain JSONs in `config` directory, and build process dynamically links one of them as an `env` 
module. You can import it wherever in code you need access to the environment.
```js
import env from "env";
console.log(env.name);
```

# Upgrading Electron version
To do so edit `package.json`:
```json
"devDependencies": {
  "electron": "1.7.9"
}
```
*Side note:* [Electron authors recommend](http://electron.atom.io/docs/tutorial/electron-versioning/) 
to use fixed version here.

# Adding npm modules to your app
Remember to respect the split between `dependencies` and `devDependencies` in `package.json` file. 
Your distributable app will contain modules listed in `dependencies` after running the release script.

*Side note:* If the module you want to use in your app is a native one (not pure JavaScript but
compiled binary) you should first  run `npm install name_of_npm_module` and then `npm run postinstall`
to rebuild the module for Electron. You need to do this once after you're first time installing the
module. Later on, the postinstall script will fire automatically with every `npm install`.

# Launching
To run without debugging: 
npm start


