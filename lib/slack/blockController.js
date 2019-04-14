'use strict';

const request = require('request-promise-native'),
      blockService = require('./blockService'),
      smartappService = require('../smartthings/smartappService');

const blockController = {
    receive: async function(req, res) {
        const payload = JSON.parse(req.body.payload);
        const action = payload.actions[0];

        // Action IDs map to function names on this object. If a function is missing, that action is not supported
        if (this[action.action_id]) {
            // If the action ID's function exists, execute it with the payload
            await this[action.action_id](payload, action);
        } else {
            console.error('ERROR ** Unsupported action:', action.action_id);
            await this.errorResponse(payload);
        }
        res.end();
    },

    deviceList: async function(payload, action) {
        const deviceId = action.selected_option.value,
              deviceName = action.selected_option.text.text,
              installedSmartAppId = action.block_id,
              responseUrl = payload.response_url;

        await blockService.sendDeviceCommands(deviceId, deviceName, installedSmartAppId, responseUrl)
        .catch((err) => {
            console.error(`Error sending device commands to Slack for device ${deviceId}`, err);
        });
    },

    deviceOn: async function(payload, action) {
        const deviceId = action.value,
              installedSmartAppId = action.block_id,
              responseUrl = payload.response_url;

        await smartappService.executeDeviceOn(deviceId, installedSmartAppId, responseUrl)
        .catch((err) => {
            console.error(`Error executing device on command for device ${deviceId}`, err);
        });
    },

    deviceOff: async function(payload, action) {
        const deviceId = action.value,
              installedSmartAppId = action.block_id,
              responseUrl = payload.response_url;

        await smartappService.executeDeviceOff(deviceId, installedSmartAppId, responseUrl)
        .catch((err) => {
            console.error(`Error executing device off command for device ${deviceId}`, err);
        });
    },

    deviceSetColor: async function(payload, action) {
        console.log('ACTION:', action);

        const deviceId = action.selected_option.value.split('.')[0],
              color = parseInt(action.selected_option.value.split('.')[1])/360*100, // Convert HSL Hue degree to percent
              installedSmartAppId = action.block_id,
              responseUrl = payload.response_url;

        await smartappService.executeDeviceSetColor(deviceId, color, installedSmartAppId, responseUrl)
        .catch((err) => {
            console.error(`Error executing device setColor command for device ${deviceId}`, err);
        });
    },

    errorResponse: async function(payload) {
        await request({
	        method: 'POST',
	        uri: payload.response_url,
	        json: true,
	        body: {'text': 'Uh oh, there was an error trying to handle your response. Please try again — sorry about that!'}
        }).catch((err) => {
            console.error('ERROR ** Error posting to Slack response URL in errorResponse', err);
        });
    }
};

module.exports = blockController;
