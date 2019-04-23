# Library

## Move SmartApp Code into this Library
* Create a file `smartApp.js`
    * `touch smartApp.js`
* Copy `const smartapp = ...` from your lambda into `smartApp.js`
    * Dependencies declared at the top also need to be copied
* Export this const to be used in other projects
  * `module.exports = smartApp;`
* Copy over locales directory
  * `cp -r ../lambda/locale .`
* Set Library to use copied directory
  * ``.configureI18n({directory: `${__dirname}/locales`})``
 
### Initialize NPM Project
```bash
cd lib
npm init
```

Enter the following information:
```bash
package name: (lib) smartapp-lib
version: (1.0.0) 
description: Shared Interaction with SmartThings
entry point: (smartApp.js) 
test command: 
git repository: 
keywords: 
author: 
license: (ISC)
```

### Add Dependencies
```bash
npm install @smartthings/smartapp --save
npm install @smartthings/dynamodb-context-store --save
npm install request@2.88.0 --save
npm install request-promise-native@1.0.7 --save
```

## Update Lambda
* Switch to lambda's directory
    * `cd ../lambda`
* Import library `npm install ../lib`
    * `const smartApp = require('smartapp-lib')`
* Delete copied code from earlier
* Delete locales folder
    * `rm -r locales`
* Uninstall unused libraries
```bash
npm uninstall @smartthings/smartapp
npm uninstall @smartthings/dynamodb-context-store
npm uninstall request
npm uninstall request-promise-native
```
* Bundling library to include for deployment
    * `npm pack ../lib`
    * `npm install smartapp-lib-1.0.0.tgz`
    
## Updating Library
* Make sure you repack in the respective project after updating this library
    * `npm pack ../lib`

[cd ../webhook](../webhook/README.md)
