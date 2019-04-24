'use strict';

const request = require('request-promise-native'),
      smartapp = require('../smartApp');

const smartappService = {
    getSmartAppContext: async function(installedSmartAppId) {
        var contextError;
        const smartAppContext = await smartapp.withContext(installedSmartAppId)
        .catch((err) => {
            console.error(`Error creating SmartApp context for InstalledSmartApp ${installedSmartAppId}`, err);
            contextError = err;
        });
        return [ contextError, smartAppContext ];
    },

    executeDeviceOn: async function(deviceId, installedSmartAppId, responseUrl) {
        const [ contextError, smartappContext ] = await this.getSmartAppContext(installedSmartAppId);
        if (contextError) { return; };

        const deviceConfig = smartappContext.config.lights.find(device => device.deviceConfig.deviceId == deviceId);
        if (!deviceConfig) {
            await this.configNotFoundErrorResponse(responseUrl, deviceId, 'on');
            return;
        }

        var sendCommandError;
        await smartappContext.api.devices.sendCommand(deviceConfig, 'switch', 'on')
        .catch((err) => {
            console.error(`Error sending on command to device ${deviceId}`, err);
            sendCommandError = err;
        });
        if (sendCommandError) {
            await this.sendCommandError(responseUrl, deviceId, 'on');
            return;
        } else {
            await this.sendCommandSuccess(responseUrl, 'on');
        }
    },

    executeDeviceOff: async function(deviceId, installedSmartAppId, responseUrl) {
        const [ contextError, smartappContext ] = await this.getSmartAppContext(installedSmartAppId);
        if (contextError) { return; };

        const deviceConfig = smartappContext.config.lights.find(device => device.deviceConfig.deviceId == deviceId);
        if (!deviceConfig) {
            await this.configNotFoundErrorResponse(responseUrl, deviceId, 'off');
            return;
        }

        var sendCommandError;
        await smartappContext.api.devices.sendCommand(deviceConfig, 'switch', 'off')
        .catch((err) => {
            console.error(`Error sending off command to device ${deviceId}`, err);
            sendCommandError = err;
        });
        if (sendCommandError) {
            await this.sendCommandError(responseUrl, deviceId, 'off');
            return;
        } else {
            await this.sendCommandSuccess(responseUrl, 'off');
        }
    },

    executeDeviceSetColor: async function(deviceId, color, installedSmartAppId, responseUrl) {
        const [ contextError, smartappContext ] = await this.getSmartAppContext(installedSmartAppId);
        if (contextError) { return; };

        const deviceConfig = smartappContext.config.lights.find(device => device.deviceConfig.deviceId == deviceId);
        if (!deviceConfig) {
            await this.configNotFoundErrorResponse(responseUrl, deviceId, 'setColor');
            return;
        }

        var sendCommandError;
        await smartappContext.api.devices.sendCommand(
            deviceConfig,
            'colorControl',
            'setColor',
            [
                {
                    'hue': color,
                    'saturation': 100,
                    'level': 100,
                    'switch': 'on'
                }
            ]
        )
        .catch((err) => {
            console.error(`Error sending setColor command to device ${deviceId}`, err);
            sendCommandError = err;
        });
        if (sendCommandError) {
            await this.sendCommandError(responseUrl, deviceId, 'setColor');
            return;
        } else {
            await this.sendCommandSuccess(responseUrl, 'setColor');
        }
    },

    sendCommandSuccess: async function(responseUrl, command) {
        await request({
            method: 'POST',
            uri: responseUrl,
            json: true,
            body: { "text": `Device command sent :thumbsup:` }
        }).catch((err) => {
            console.error(`ERROR ** Error posting to Slack response URL in ${command} command after a successful sendCommand`, err);
        });
    },

    configNotFoundErrorResponse: async function(responseUrl, deviceId, command) {
        await request({
            method: 'POST',
            uri: responseUrl,
            json: true,
            body: { "text": `Oops, I wasn't able to find a device with the ID you specified for that command. Double check that the device with ID ${deviceId} was not deleted and then try again.` }
        }).catch((err) => {
            console.error(`ERROR ** Error posting to Slack response URL for ${command} command`, err);
        });
    },

    sendCommandError: async function(responseUrl, deviceId, command) {
        await request({
            method: 'POST',
            uri: responseUrl,
            json: true,
            body: { "text": `Uh oh, there was an error trying to send the ${command} command to your device with ID ${deviceId}. Please try again.` }
        }).catch((err) => {
            console.error(`ERROR ** Error posting to Slack response URL for ${command} command after a failed sendCommand`, err);
        });
    }
}

module.exports = smartappService;
