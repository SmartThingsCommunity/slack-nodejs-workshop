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

## Deploying to Heroku

>  Heroku will charge $20 a month for SSL, so only do this if you are
planning on continuing to develop in the future.

* Create Git Repo
    * `git init`
* Bundling Library
    * `npm pack ../lib`
    * `npm install smartapp-lib-1.0.0.tgz`
* Setup [Heroku CLI](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up)
    * An SSL Endpoint is needed
        * [Add credit card information to Heroku](https://dashboard.heroku.com/account/billing)
            * Having SSL endpoints cost per month so take this down after the workspace is over
        * `heroku addons:create ssl:endpoint`
* [Specify an a node version to use in Heroku](https://devcenter.heroku.com/articles/nodejs-support#specifying-a-node-js-version)
    * Add the block to package.json
    ```json
      "engines": {
        "node": "11.9.0"
      }
    ```
* Commit
    * `git add .`
    * `git commit -m "Initial Heroku"`
* Look for Heroku Specified Port
    * `process.env.PORT || 8080`
* [Deploy to Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs#deploy-the-app)
    * Create Heroku App
        * `heroku create`
    * Push Application to Heroku App
        * `git push heroku master`
    * Verify Application Booted Correctly
        * `heroku logs`
* [Configure SmartThings](https://smartthings.developer.samsung.com/workspace/projects)
    * Select your WebHook app
    * Click `Automation` under `Develop`
    * Update the URL to the Heroku provided one
        * Can be found using `heroku info` command
    * Click `Next`
    * Click `Next`
    * Click `Save`
