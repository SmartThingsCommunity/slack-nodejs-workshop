'use strict';

const request = require('request-promise-native'),
      blockService = require('./blockService'),
      errorResponseService = require('./errorResponseService'),
      smartappService = require('../smartthings/smartappService');

const blockController = {
    receive: async function(req) {
        const payload = JSON.parse(req.body.payload),
              responseUrl = payload.response_url,
              action = payload.actions[0],
              command = action.action_id;

        // Action IDs map to function names on the `commands` object below
        // If a function is missing, that action is not supported
        if (this[command]) {
            try {
                await this[command](action, responseUrl);
            } catch (err) {
                console.error('ERROR ** Unexpected error receiving block command', err);
                await errorResponseService.sendErrorResponse(responseUrl);
            }
        } else {
            console.error('ERROR ** Unsupported command:', command);
            await errorResponseService.sendErrorResponse(responseUrl);
        }
    }
};

const commands = {
    listCommands: async function(action, responseUrl) {
        const deviceId = action.selected_option.value,
              deviceName = action.selected_option.text.text,
              installedSmartAppId = action.block_id;

        await blockService.sendDeviceCommands(deviceId, deviceName, installedSmartAppId, responseUrl);
    },

    deviceOn: async function(action, responseUrl) {
        const deviceId = action.value,
              installedSmartAppId = action.block_id;

        await smartappService.deviceOn(deviceId, installedSmartAppId, responseUrl);
    },

    deviceOff: async function(action, responseUrl) {
        const deviceId = action.value,
              installedSmartAppId = action.block_id;

        await smartappService.deviceOff(deviceId, installedSmartAppId, responseUrl);
    },

    deviceSetColor: async function(action, responseUrl) {
        console.log('ACTION:', action);

        const deviceId = action.selected_option.value.split('.')[0],
              color = parseInt(action.selected_option.value.split('.')[1])/360*100, // Convert HSL Hue degree to percent
              installedSmartAppId = action.block_id;

        await smartappService.deviceSetColor(deviceId, color, installedSmartAppId, responseUrl);
    }
};

Object.setPrototypeOf(blockController, commands);
module.exports = blockController;
