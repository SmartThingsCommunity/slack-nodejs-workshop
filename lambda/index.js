const smartApp = require('smartapp-lib');
const qs = require('qs');

exports.handler = async (event, context, callback) => {
    if (event.resource === '/SmartThings-Slack') {
        console.log('request', 'event', event);
        const text = qs.parse(event.body).text.split(" ");
        const deviceDescription = text[0];
        const command = text[1];

        const installedSmartAppId = process.env.SMARTTHINGS_SLACK_INSTALLED_SMARTAPP_ID;
        const smartAppContext = await smartApp.withContext(installedSmartAppId);
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
                return configured.deviceConfig.deviceId === device.deviceId;
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
        smartApp.handleLambdaCallback(event, context, callback);
    }
};
