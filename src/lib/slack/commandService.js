'use strict';

const ThingsBotCommand = require('./commands/ThingsBotCommand');

const commandService = {
    thingsbotCommand: async function(installedSmartAppId, payload) {
        const command = Object.create(ThingsBotCommand).init(installedSmartAppId, payload);

        if (!command) {
            return Promise.reject('Failed to initialize new ThingsBotCommand Object');
        }

        await command.sendResponse(await command.deviceCommandsBlock)
    }
};

module.exports = commandService;
