# Lambda Integration

## Setup

Initialize node application

```
npm init
```

Install the [SmartThings NodeJS SDK](https://github.com/SmartThingsCommunity/smartapp-sdk-nodejs/)

```bash
npm install @smartthings/smartapp --save
```

### AWS Configuration

* Navigate to [Lambda Creation in AWS Console](https://console.aws.amazon.com/lambda/home?region=us-east-2#/create)
    * Select `Author from Scratch`
    * Enter `SmartThings-Slack` for `Function Name`
    * Select `Node.js 8.10` for `Runtime`
    * Expand `Choose or create an execution role` and name the role `SmartThings-Slack`
    * Click `Create function`
    * Keep this tab open

### SmartThings Configuration

* Create SmartApp (SmartThings Integration)
    * Navigate to the [SmartThings developer portal](https://smartthings.developer.samsung.com/workspace/projects)
    * Click `Log in With Samsung Account`
        * Sign into your Samsung account or create one
    * Create a new project
        * Select `Automation for the SmartThings App`
        * Enter `Slack Lambda`
        * Select `Register Automation SmartApp`
        * Select `AWS Lambda`
        * Enter the ARN from the top right corner of your Lambda function configuration page, then click Next
        * Select device read (`r:devices:*`) and device execute (`x:devices:*`) for scopes, then click Next
        * Enter `Slack Lambda` for Automation Display Name
        * Click Save
        * Keep this tab open

### Lambda Configuration

* Navigate to your [`SmartThings-Slack` Function page](https://console.aws.amazon.com/lambda/home?region=us-east-2#/functions/SmartThings-Slack?tab=graph)
* Add Environment Variables
    * Key: `SMARTTHINGS_SLACK_CLIENT_ID` 
        * `Client ID` from the SmartApp `Automation` page under `Develop`
        * _This page should be open from the previous step_
    * Key: `SMARTTHINGS_SLACK_CLIENT_SECRET`
        * `Client Secret` from the SmartApp `Automation` page under `Develop`
        * Regenerate if needed

### Coding
Add the following code to `index.js`
```javascript
const SmartApp = require('@smartthings/smartapp');

const smartApp = new SmartApp({
    clientId: process.env.SMARTTHINGS_SLACK_CLIENT_ID,
    clientSecret: process.env.SMARTTHINGS_SLACK_CLIENT_SECRET
});

smartApp.configureI18n()
  .page('mainPage', (context, page, configData) => {
    page.section('lights', section => {
      section.deviceSetting('lights').capabilities(['switch']).multiple(true).permissions('rx');
    });
  })

exports.handler = async (event, context, callback) => {
    smartApp.handleLambdaCallback(event, context, callback);
};
```
## Deploying

* Create zip of all files within this folder
```bash
zip -r smartthings-slack.zip *
```
* Under `Function Code` select `Upload a .zip file` for `Code entry type`
* Upload a `.zip` of the contents in `lambda`
* Click `Save` in the top right corner

### Updating

Upload the respective zip to AWS either through the console UI or using the CLI

```
aws lambda update-function-code --function-name SmartThings-Slack --zip-file fileb://smartthings-slack.zip
```

## Installation
* Navigate to `Automations` with your SmartThings Mobile App
* Select the `+`
* Scroll down and tap `Slack Lambda`
* Select your Simulated Device(s)
* Tap save

## Adding SmartThings Context Storage

The NodeJS SmartApp SDK uses tokens attached to events for handling commands
triggered by subscriptions. In order to invoke commands without
receiving an event, tokens need to be stored. This can be done by implementing
your own storage that captures and persists the attached access and refresh tokens.
The simpler path is utilizing npm packages written by SmartThings for
[Firebase](https://github.com/SmartThingsCommunity/firestore-context-store-nodejs)
or [Dynamo](https://github.com/SmartThingsCommunity/dynamodb-context-store-nodejs).

We are going to utilize the dynamodb package to store the necessary tokens, to install run the following command:

```bash
npm install @smartthings/dynamodb-context-store --save
```

In order for your lambda to persist this information a dynamodb table and policy need to be created.

* [Create a table](https://console.aws.amazon.com/dynamodb/home?region=us-east-2#create-table:):
    * Name the table to `smartthings-slack-context-store`
    * Set the primary key to `installedAppId`
* [Create new policy](https://console.aws.amazon.com/iam/home?region=us-east-2#/policies$new?step=edit):
    * Select the `JSON` tab
    * Copy `../etc/dynamo-policy.json` into the text field
    * Replace `{{ AWS Account Id }}` with your [AWS Account Id](https://console.aws.amazon.com/billing/home?#/account)
    * Click `Review Policy`
    * Input `SmartThingsSlackContextStore` as the name
    * Click `Create Policy`
* [Add the policy above to your lambda's role](https://console.aws.amazon.com/iam/home?region=us-east-2#/roles):
    * Select role with name `SmartThings-Slack-role-*`
    * Click `Attach Policies`
    * Search for `SmartThingsSlackContextStore`
    * Select the checkbox next the found policy
    * Click `Attach Policy`

Upload your updated lambda function

## Exposing API Gateway Endpoint

### Configure AWS
* Navigate to your Lambda Function in the AWS Console
    * Create API Gateway
        * Select API Gateway from the Designer in the `Add triggers` section
            * Select `Create a new API` for `API`
            * Select `Open` for `Security`
               * The open security setting allows us to handle authentication within our app code rather than passing it off to the API Gateway
        * Click `Add`
        * Click `Save`
    * Add Request Proxying
        * Select the `API Gateway` Leaf
        * Click `SmartThings-Slack-API`
            * This should forward you to the API Gateway configuration
        * Click `Actions`
        * Select `Create Resource` under `Resource Actions`
        * Check `Configure as proxy resource`
        * Click `Create Resource`
        * Type `SmartThings-Slack` in for `Lambda Function`
        * Click `Save`
        * Click `Ok` on the popup
* Add the Installed SmartApp ID as an environment variable to your [Lambda](https://console.aws.amazon.com/lambda/home?region=us-east-2#/functions/SmartThings-Slack?tab=graph)
    * key: `SMARTTHINGS_SLACK_INSTALLED_SMARTAPP_ID`
        * Your InstalledSmartAppId can be found by viewing [your DynamoDB table](https://console.aws.amazon.com/dynamodb/home?region=us-east-2#tables:selected=smartthings-slack-context-store;tab=items)
        * Installed SmartApp IDs can be captured through events which are viewable under Live Logging section of the [Workspace](https://smartthings.developer.samsung.com/workspace/projects)
        
### Configure Slack
* Navigate to your [slack apps](https://api.slack.com/apps)
    * Click `Slash Commands` under `Features`
    * Click `Create New Command`
    * Name the command `/thingsbot`
    * For the Request URL, input your Lambda's API endpoint
        * API endpoint is the API Gateway URL that configured in the prior section.
        * The API endpoint can be found on your Lambda's settings page by selecting the API Gateway trigger
        * eg
         ```
         https://*.execute-api.us-east-2.amazonaws.com/default/SmartThings-Slack
         ```
    * For `Short Description`, input `Interact with SmartThings`
    * Click `Save`
    
### Coding
* Update your Lambda Function
    * Install `qs` to handle parsing the url encoded payloads from slack
        * `npm install qs@6.5.2 --save`
        * This package can be used to parse the payload being emitted by slack
    * In order to handle requests a stored context needs to be retrieved. This will contain the necessary tokens for invoking SmartThings functionality.
        * This context can be retrieved using 
        ```javascript
        exports.handler = async (event, context, callback) => {
          console.log('request', 'event', event);
          if (event.resource === '/SmartThings-Slack') {
            const smartAppContext = smartApp.withContext(process.env.SMARTTHINGS_SLACK_INSTALLED_SMARTAPP_ID);
            context.succeed({
                "statusCode": 200,
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": JSON.stringify({
                    "text": "Device Commands",
                    "attachments": [
                        {
                            "text": `Sent ${command} to ${apiDevices.map((device) => device.label)}`
                        }
                    ]
                })
            });
        } else {
            smartApp.handleLambdaCallback(event, context, callback);
        }
        console.log('request', 'event', event);
        ```
    * A device API is exposed from the context `smartAppContext.api.devices`
        * Can be used to retrieve devices and invoke commands on configured devices (`smartAppContext.config.lights`).
    * Example command `/thingsbot switch on`

## Pushing Events via Webhook

* Navigate to your [slack apps](https://api.slack.com/apps)
    * Select `ThingsBot`
    * Click `Incoming Webhooks` under `Features`
    * Click the toggle to the left of `Activate Incoming Webhooks` to enable 
    * Click `Add New Webhook to Workspace` at the bottom
    * Select the Slack Channel you want to send events to
    * Copy the generated URL
        * Add this as an environment variable for
        [your lambda function](https://console.aws.amazon.com/lambda/home?region=us-east-2#/functions/SmartThings-Slack?tab=graph)
        with the key `SLACK_SMARTTHINGS_WEBHOOK`
        * eg `https://hooks.slack.com/services/*/*/*` 
    * This URL can be hit with an HTTP POST request to generate a message using your bot
        * Try the example message under `Sample curl request to post to a channel:`
    * Use this URL to post event data from your subscription into slack
        * Events only contain deviceIds which can be consumed by the API to retrieve the entire object
* Update your Lambda Function
    * Install `request` to do HTTP Requests from your function
        * `npm install request@2.88.0 --save`
        * `npm install request-promise-native@1.0.7 --save`
    * Add device subscriptions to SmartApp
    ```javascript
    smartApp.updated( async (context, updateData) => {
        console.log('updated', JSON.stringify(updateData));
        await context.api.subscriptions.unsubscribeAll();
        console.log('updated', 'unsubscribeAll() executed');
        context.api.subscriptions.subscribeToDevices(context.config.lights, 'switch', 'switch', 'lightsSubscription');
    }).subscribedEventHandler('lightsSubscription', async (context, deviceEvent) => {
       console.log('lightsSubscription', 'context', context);
       console.log('lightsSubscription', 'event', deviceEvent);
   
       const device = await context.api.devices.get(deviceEvent.deviceId);
       console.log('lightsSubscription', 'device', device);
   
       const body = {'text': "Hello, I'm ThingsBot"};
       const response = await request({
         method: 'POST',
         uri: process.env.SLACK_SMARTTHINGS_WEBHOOK,
         json: true,
         body: body
       });
       console.log('lightsSubscription', 'slack-webhook', response);
     });
    ```
    * Update the text of that response to show the state of the device
    * Example message: `Simulated RGB Bulb emitted on for switch`

[cd ../lib](../lib/README.md)
