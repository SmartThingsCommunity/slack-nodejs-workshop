const SmartApp = require('@smartthings/smartapp');
const DynamoDBContextStore = require('@smartthings/dynamodb-context-store');
const request = require('request-promise-native');
const qs = require("qs");

const subscriptionHandlerName = 'subscriptionHandler';

const smartApp = new SmartApp({
  clientId: process.env.SMARTTHINGS_SLACK_CLIENT_ID,
  clientSecret: process.env.SMARTTHINGS_SLACK_CLIENT_SECRET
});

smartApp.contextStore(new DynamoDBContextStore('us-east-2', 'smartthings-slack-context-store'))
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

    const payload = {"text": `${device.label} emitted ${deviceEvent.value} for ${deviceEvent.attribute}`};
    const response = await request({
      method: 'POST',
      uri: process.env.SLACK_SMARTTHINGS_WEBHOOK,
      json: true,
      body: payload
    });
    console.log(subscriptionHandlerName, 'slack-webhook', response);
  });

async function handleSlashCommand(text) {
  console.log('handleSlashCommand', 'text', text);
  const parts = text.split(" ");
  const deviceDescription = parts[0];
  const command = parts[1];

  const smartAppContext = await smartApp.withContext(process.env.SMARTTHINGS_SLACK_INSTALLED_SMARTAPP_ID);
  console.log('handleSlashCommand', 'context', smartAppContext);
  console.log('handleSlashCommand', 'context-config', smartAppContext.config);

  const devices = (await smartAppContext.api.devices.listAll()).items;
  console.log('handleSlashCommand', 'api-device-list', devices);

  const apiDevices = devices.filter((device) => {
    return device.label.includes(deviceDescription);
  });
  console.log('handleSlashCommand', 'api-devices', apiDevices);

  const configDevices = apiDevices.map((device) => {
    return smartAppContext.config.lights.find((configured) => {
      return configured.deviceConfig.deviceId === device.deviceId;
    });
  });
  console.log('handleSlashCommand', 'context-config-devices', configDevices, command);

  await smartAppContext.api.devices.sendCommands(configDevices, 'switch', command);
  console.log('handleSlashCommand', 'command-complete');

  const responseText = `Sent ${command} to ${apiDevices.map((device) => device.label)}`;
  return {
    "text": "Device Commands",
    "attachments": [{
      "text": responseText
    }]
  }
}

module.exports = {
  smartApp: smartApp,
  handleSlashCommand: handleSlashCommand
};
