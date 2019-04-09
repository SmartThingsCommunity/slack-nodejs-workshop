# SmartThings Slack Lambda Integration

## Setup

Initialize node application

```
npm init
```

Install the SmartThings node sdk

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

Reference:
https://github.com/SmartThingsCommunity/smartapp-sdk-nodejs/

