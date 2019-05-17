'use strict';

const request = require('request-promise-native'),
      smartApp = require('../smartApp');

const smartAppService = {
    getSmartAppContext: async function(installedSmartAppId) {
        try {
            return await smartApp.withContext(installedSmartAppId)
        } catch (err) {
            console.error(`Error creating SmartApp context for InstalledSmartApp ${installedSmartAppId}`, err);
            throw err
        }
    },

    getDeviceList: async function(smartAppContext) {
        try {
            return await smartAppContext.api.devices.listAll()
        } catch (err) {
            console.error(`ERROR ** Error listing devices for ${smartAppContext ? "InstalledSmartApp" + smartAppContext.installedAppId : "No Context"}`, err);
            throw err
        }
    },

    sendCommandSuccess: async function(responseUrl, command) {
        try {
            return await request({
                method: 'POST',
                uri: responseUrl,
                json: true,
                body: { "text": `Device command sent :thumbsup:` }
            })
        } catch (err) {
            console.error(`ERROR ** Error posting to Slack response URL in ${command} command after a successful sendCommand`, err);
        }
    },

    sendCommandError: async function(responseUrl, deviceId, command) {
        try {
            return await request({
                method: 'POST',
                uri: responseUrl,
                json: true,
                body: { "text": `Uh oh, there was an error trying to send the ${command} command to your device with ID ${deviceId}. Please try again.` }
            })
        } catch (err) {
            console.error(`ERROR ** Error posting to Slack response URL for ${command} command after a failed sendCommand`, err);
        }
    },

    configNotFoundErrorResponse: async function(responseUrl, deviceId, command) {
        try {
            return await request({
                method: 'POST',
                uri: responseUrl,
                json: true,
                body: { "text": `Oops, I wasn't able to find a device with the ID you specified for that command. Double check that the device with ID ${deviceId} was not deleted and then try again.` }
            })
        } catch (err) {
            console.error(`ERROR ** Error posting to Slack response URL for ${command} command`, err);
        }
    }
};

const executableCommands = {
    deviceOn: async function(deviceId, installedSmartAppId, responseUrl) {
        const smartAppContext = await this.getSmartAppContext(installedSmartAppId);

        const deviceConfig = smartAppContext.config.lights.find(device => device.deviceConfig.deviceId == deviceId);
        if (!deviceConfig) {
            await this.configNotFoundErrorResponse(responseUrl, deviceId, 'on');
            return;
        }

        try {
            await smartAppContext.api.devices.sendCommand(deviceConfig, 'switch', 'on')
        } catch (err) {
            console.error(`Error sending on command to device ${deviceId}`, err);
            await this.sendCommandError(responseUrl, deviceId, 'on');
            return;
        }
        await this.sendCommandSuccess(responseUrl, 'on');
    },

    deviceOff: async function(deviceId, installedSmartAppId, responseUrl) {
        const smartAppContext = await this.getSmartAppContext(installedSmartAppId);

        const deviceConfig = smartAppContext.config.lights.find(device => device.deviceConfig.deviceId == deviceId);
        if (!deviceConfig) {
            await this.configNotFoundErrorResponse(responseUrl, deviceId, 'off');
            return;
        }

        try {
            await smartAppContext.api.devices.sendCommand(deviceConfig, 'switch', 'off')
        } catch (err) {
            console.error(`Error sending off command to device ${deviceId}`, err);
            await this.sendCommandError(responseUrl, deviceId, 'off');
            return;
        }
        await this.sendCommandSuccess(responseUrl, 'off');
    },

    deviceSetColor: async function(deviceId, color, installedSmartAppId, responseUrl) {
        const smartAppContext = await this.getSmartAppContext(installedSmartAppId);

        const deviceConfig = smartAppContext.config.lights.find(device => device.deviceConfig.deviceId === deviceId);
        if (!deviceConfig) {
            await this.configNotFoundErrorResponse(responseUrl, deviceId, 'setColor');
            return;
        }

        try {
            await smartAppContext.api.devices.sendCommand(
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
            );
        } catch (err) {
            console.error(`Error sending setColor command to device ${deviceId}`, err);
            await this.sendCommandError(responseUrl, deviceId, 'setColor');
            return;
        }
        await this.sendCommandSuccess(responseUrl, 'setColor');
    }
};

Object.setPrototypeOf(smartAppService, executableCommands);
module.exports = smartAppService;
