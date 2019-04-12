# SmartThings Slack Lambda Integration

## Setup

Initialize node application

```
npm init
```

Install the [SmartThings NodeJS SDK](https://github.com/SmartThingsCommunity/smartapp-sdk-nodejs/)

```bash
npm install @smartthings/smartapp --save
```

## Updating

```bash
npm install
```

## Deploying

Create zip of all files within this folder

```bash
zip -r smartthings-slack.zip *
```

Upload the respective zip to AWS either through the console UI or using the CLI

```
aws lambda update-function-code --function-name SmartThings-Slack --zip-file fileb://smartthings-slack.zip
```

## Adding SmartThings Context Storage

The NodeJS SmartApp SDK uses tokens attached to events for handling commands
triggered by subscriptions. In order to invoke commands without
receiving an event, tokens need to be stored. This can be done by implementing
your own storage that captures and persists the attached access and refresh tokens.
The simpler path is utilizing npm packages written by SmartThings for
[Firebase](https://github.com/SmartThingsCommunity/firestore-context-store-nodejs)
or (Dynamo)[https://github.com/SmartThingsCommunity/dynamodb-context-store-nodejs].

We are going to utilize the dynamodb package to store the necessary tokens, to install run the following command:

```bash
npm install @smartthings/dynamodb-context-store --save
```

In order for your lambda to persist this information a dynamodb table and policy need to be created.

[Create a table](https://console.aws.amazon.com/dynamodb/home?region=us-east-2#create-table:):
  * Name the table to `smartthings-slack-context-store`
  * Set the primary key to `installedAppId`

[Create new policy](https://console.aws.amazon.com/iam/home?region=us-east-2#/policies$new?step=edit):
  * Select the `JSON` tab
  * Copy `../etc/dynamo-policy.json` into the text field
  * Replace `{{ AWS Account Id }}` with your [AWS Account Id](https://console.aws.amazon.com/billing/home?#/account)
  * Click `Review Policy`
  * Input `SmartThingsSlackContextStore` as the name
  * Click `Create Policy`

[Add the policy above to your lambda's role](https://console.aws.amazon.com/iam/home?region=us-east-2#/roles):
  * Select role with name `SmartThings-Slack-role-*`
  * Click `Attach Policies`
  * Search for `SmartThingsSlackContextStore`
  * Select the checkbox next the found policy
  * Click `Attach Policy`

Upload your updated lambda function
