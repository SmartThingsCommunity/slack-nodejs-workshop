# WebHooks Integration

## Code Changes
* [Break SmartApp into Library](../README.md)
* Add [our library](../lib/README.md) as dependency
    * `npm install ../lib --save`
    * `const smartApp = require('smartapp-lib');`
* Use [express](https://expressjs.com/) to [handle requests with the sdk](https://github.com/SmartThingsCommunity/smartapp-sdk-nodejs/#running-it-as-a-web-service) exposed through the library
    * `npm install express --save`
* Run server `npm start`
* Install [localtunnel](https://localtunnel.github.io/www/) or [ngrok](https://ngrok.com/download)
    * Forward to the port your local server is listening on

## SmartThings Configuration
* [Create a new Project](https://smartthings.developer.samsung.com/workspace/projects/new)
    * Click `CONTINUE` under `Automation for the SmartThings App`
    * Enter `Slack-Webhook` under `Give this project a name`
    * Click `Create Project`
* Project Configuration
    * Click `Automation` under `Developer` on the `Project`'s sidebar
    * Select `WebHook Endpoint`
    * Enter LocalTunnel or ngrok URL
    * Select `r:devices:*` and `x:devices:*`
    * Enter `Slack Webhook` into `Automation Display Name`
    * Click `Save`
    * Copy key to clipboard
        * Paste key into `webhook/@smartthings_rsa.pub`
    * Click `Go To Project Overview`
    * Click `Deploy to test`
    * Click `Got it`

## Installation
* Navigate to `Automations` with your SmartThings Mobile App
* Select the `+`
* Scroll down and tap `Slack Webhook`
* Select your Simulated Devices
* Tap save
