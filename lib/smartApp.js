const SmartApp   = require('@smartthings/smartapp');
const DynamoDBContextStore = require('@smartthings/dynamodb-context-store');
const request = require('request-promise-native');

const subscriptionHandlerName = 'subscriptionHandler';

const smartApp = new SmartApp()
  .contextStore(new DynamoDBContextStore('us-east-2', 'smartthings-slack-context-store'))
  .configureI18n({directory: `${__dirname}/locales`})
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

module.exports = smartApp;
