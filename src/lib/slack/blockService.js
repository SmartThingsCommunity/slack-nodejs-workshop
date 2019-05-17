'use strict';

const request = require('request-promise-native'),
      DeviceCommand = require('./commands/DeviceCommand');

const blockService = {
    sendDeviceCommands: async function(deviceId, deviceName, installedSmartAppId, responseUrl) {
        const deviceCommand = Object.create(DeviceCommand).init(deviceId, deviceName, installedSmartAppId);

        try {
          await request({
            method: 'POST',
            uri: responseUrl,
            json: true,
            body: deviceCommand.commandsBlock
          })
        } catch (err) {
          console.error('Error posting to Slack response URL in deviceList', err);
        }
    }
};

module.exports = blockService;
