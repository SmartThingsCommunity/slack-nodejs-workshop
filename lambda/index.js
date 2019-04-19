const SmartApp = require('@smartthings/smartapp');
const DynamoDBContextStore = require('@smartthings/dynamodb-context-store');
const qs = require('qs');
const request = require('request-promise-native');

const subscriptionHandlerName = 'subscriptionHandler';

const smartapp = new SmartApp()
    .contextStore(new DynamoDBContextStore('us-east-2', 'smartthings-slack-context-store'))
    .configureI18n()
    .page('mainPage', (context, page, configData) => {
        page.section('lights', section => {
            section.deviceSetting('lights').capabilities(['switch']).multiple(true).permissions('rx');
        });
    })
    .updated( async (context, updateData) => {
        console.log('updated', JSON.stringify(updateData));
        await context.api.subscriptions.unsubscribeAll();
        console.log('updated', 'unsubscribeAll() executed');
        context.api.subscriptions.subscribeToDevices(context.config.lights, 'switch', 'switch', subscriptionHandlerName);
    })
    .subscribedEventHandler(subscriptionHandlerName, async (context, deviceEvent) => {
        console.log(subscriptionHandlerName, 'context', context);
        console.log(subscriptionHandlerName, 'event', deviceEvent);

        const device = await context.api.devices.get(deviceEvent.deviceId);
        console.log(subscriptionHandlerName, 'device', device);

        const slackWebHookUrl = 'https://hooks.slack.com/services/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';
        const payload = {"text": `${device.label} emitted ${deviceEvent.value} for ${deviceEvent.attribute}`};
        const response = await request({
            method: 'POST',
            uri: slackWebHookUrl,
            json: true,
            body: payload
        });
        console.log(subscriptionHandlerName, 'slack-webhook', response);
    });

exports.handler = async (event, context, callback) => {
    if (event.resource === '/SmartThings-Slack') {
        console.log('request', 'event', event);
        const text = qs.parse(event.body).text.split(" ");
        const deviceDescription = text[0];
        const command = text[1];

        const installedSmartAppId = event.queryStringParameters.installedSmartAppId;
        const smartAppContext = await smartapp.withContext(installedSmartAppId);
        console.log('request', 'context', smartAppContext);
        console.log('request', 'context-config', smartAppContext.config);

        const devices = (await smartAppContext.api.devices.listAll()).items;
        console.log('request', 'api-device-list', devices);

        const apiDevices = devices.filter((device) => {
            return device.label.includes(deviceDescription);
        });
        console.log('request', 'api-devices', apiDevices);

        const configDevices = apiDevices.map((device) => {
            return smartAppContext.config.lights.find((configured) => {
                return configured.deviceConfig.id === device.id;
            });
        });
        console.log('request', 'context-config-devices', configDevices);

        await smartAppContext.api.devices.sendCommands(configDevices, 'switch', command);
        console.log('request', 'command-complete');

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
        smartapp.handleLambdaCallback(event, context, callback);
    }
};
