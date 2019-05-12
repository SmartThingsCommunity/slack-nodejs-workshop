'use strict';

const commandService = require('./commandService'),
      errorResponseService = require('./errorResponseService');

const commandController = {
    routeCommand: async function(req, command) {
        if (this[command]) {
            try {
                await this[command](req);
            } catch (err) {
                console.error('ERROR ** Unexpected error routing slash command', err);
                await errorResponseService.sendErrorResponse(req.body.response_url);
            }
        } else {
            console.error('ERROR ** Unsupported slash command:', command);
            await errorResponseService.sendErrorResponse(req.body.response_url);
        }
    }
}

const commands = {
    thingsbot: async function(req) {
        const installedSmartAppId = req.query.installedSmartAppId;

        return await commandService.thingsbotCommand(installedSmartAppId, req.body);
    }
}

Object.setPrototypeOf(commandController, commands);
module.exports = commandController;
