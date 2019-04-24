'use strict';

const smartappService = require('../smartthings/smartappService');

const commandService = {
    getDevices: async function(installedSmartAppId) {
        const [ contextError, smartappContext ] = await smartappService.getSmartAppContext(installedSmartAppId);
        if (contextError) { return; };

        var deviceListError;
        const deviceList = await smartappContext.api.devices.listAll()
        .catch((err) => {
            console.error(`Error listing devices for InstalledSmartApp ${installedSmartAppId}`, err);
            deviceListError = err;
        });
        if (deviceListError) { return; }
        
        return deviceList.items;
    }
};

module.exports = commandService;
