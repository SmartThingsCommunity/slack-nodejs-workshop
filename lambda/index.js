const smartapp = require('@smartthings/smartapp')
const DynamoDBContextStore = require('@smartthings/dynamodb-context-store');

smartapp
    .contextStore(new DynamoDBContextStore('us-east-2', 'smartthings-slack-context-store'))
    .configureI18n()
    .page('mainPage', (context, page, configData) => {
        page.section('lights', section => {
            section.deviceSetting('lights').capabilities(['switch']).multiple(true).permissions('rx');
        });
    })
    .updated((context, updateData) => {
        console.log('updated', JSON.stringify(updateData));
        context.api.subscriptions.unsubscribeAll().then(() => {
              console.log('unsubscribeAll() executed');
              context.api.subscriptions.subscribeToDevices(context.config.lights, 'switch', 'switch', 'myDeviceEventHandler');
        });
    })
    .subscribedEventHandler('myDeviceEventHandler', (context, deviceEvent) => {
        const value = 'on'
        context.api.devices.sendCommands(context.config.lights, 'switch', value);
        console.log(`sendCommands(${JSON.stringify(context.config.lights)}, 'switch', '${value}')`);
    });

exports.handler = (event, context, callback) => {
    smartapp.handleLambdaCallback(event, context, callback);
};
