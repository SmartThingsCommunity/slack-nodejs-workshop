# WebHooks Integration

## Code Changes

* [Break Lambda into Library](../README.md)
* Initial npm project `npm init`
* Add [our library](../lib/README.md) as dependency
    * `npm pack ../lib && npm install smartapp-lib-1.0.0.tgz`
* Use [express](https://expressjs.com/) to [handle requests with the sdk](https://github.com/SmartThingsCommunity/smartapp-sdk-nodejs/#running-it-as-a-web-service) exposed through the library
    * `npm install express --save`
    * `npm install body-parser --save`
* Create a `server.js`
```javascript
const express = require('express');
const bodyParser = require('body-parser');
const smartApp = require('smartapp-lib').smartApp;
const handleSlashCommand = require('smartapp-lib').handleSlashCommand;

const server = module.exports = express();

server.use(express.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.post('/', (req, res) => {
  console.log(req);
  smartApp.handleHttpCallback(req, res);
});

server.post('/slack', async (req, res) => {
  console.log(req);
  const responseBody = await handleSlashCommand(req.body.text);
  res.send(responseBody);
});

server.listen(8080, () => console.log(`Server is up and running on port 8080`));
```

## Running

* `npm start`
* Install [localtunnel](https://localtunnel.github.io/www/) or [ngrok](https://ngrok.com/download)
    * Forward to the port your local server is listening on
    * LocalTunnel: `lt --port 8080 --subdomain {{ pick a name }}`

## SmartThings Configuration

* [Create a new Project](https://smartthings.developer.samsung.com/workspace/projects/new) or reuse your existing project
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
        * Configure `SmartApp`
        ```javascript
        smartApp.publicKey('@smartthings_rsa.pub');
        ```
    * Click `Go To Project Overview`
    * Click `Deploy to test`
    * Click `Got it`

### Environment Configuration

* Key: `SMARTTHINGS_SLACK_CLIENT_ID` 
    * `export SMARTTHINGS_SLACK_CLIENT_ID=*`
    * Found in `Client ID` from the [SmartApp `Automation` page](https://smartthings.developer.samsung.com/workspace/projects) under `Develop`
* Key: `SMARTTHINGS_SLACK_CLIENT_SECRET`
    * `export SMARTTHINGS_SLACK_CLIENT_SECRET=*`
    * Found in `Client Secret` from the [SmartApp `Automation` page](https://smartthings.developer.samsung.com/workspace/projects) under `Develop`
        * Regenerate if needed
* Restart app

## Installation

* Navigate to `Automations` with your SmartThings Mobile App
* Select the `+`
* Scroll down and tap `Slack Webhook`
* Select your Simulated Device(s)
* Tap save

### Environment Configuration

* Key: `SMARTTHINGS_SLACK_INSTALLED_SMARTAPP_ID`
    * `export SMARTTHINGS_SLACK_INSTALLED_SMARTAPP_ID=*`   
    * Found in Live Logs for your SmartApp in the
    [Developer Workspace](https://smartthings.developer.samsung.com/workspace/projects)
    or [Dynamo](https://console.aws.amazon.com/dynamodb/home?region=us-east-2#tables:selected=smartthings-slack-context-store;tab=items)
* Key: `SLACK_SMARTTHINGS_WEBHOOK`
    * `export SLACK_SMARTTHINGS_WEBHOOK=*`
    * Found at [your Slack Apps](https://api.slack.com/apps) or [lambda function](https://console.aws.amazon.com/lambda/home?region=us-east-2#/functions/SmartThings-Slack?tab=graph)
* Restart app

### Slack Configuration

* Navigate to your [slack apps](https://api.slack.com/apps)
    * Click `Slash Commands` under `Features`
    * Click `Create New Command`
    * Click the edit button to the right of `/thingsbot`
    * Update the `Request URL`
        * Input your localtunnel or ngork URL with `/SmartThings-Slack/slack/cmd/thingsbot`
        * eg: `https://smartthings-slack.localtunnel.me/SmartThings-Slack/slack/cmd/thingsbot`
    * Click `Save`

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
    * Add the block to `package.json` with the version returned from `node -v`
    ```json
      "engines": {
        "node": "11.9.0"
      }
    ```
* Add Environment Variables
    ```
    heroku config:set SMARTTHINGS_SLACK_CLIENT_ID=$SMARTTHINGS_SLACK_CLIENT_ID
    heroku config:set SMARTTHINGS_SLACK_CLIENT_SECRET=$SMARTTHINGS_SLACK_CLIENT_SECRET
    heroku config:set SMARTTHINGS_SLACK_INSTALLED_SMARTAPP_ID=$SMARTTHINGS_SLACK_INSTALLED_SMARTAPP_ID
    heroku config:set SLACK_SMARTTHINGS_WEBHOOK=$SLACK_SMARTTHINGS_WEBHOOK
    ````
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
