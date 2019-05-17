'use strict';

const SlashCommand = require('./SlashCommand'),
      smartAppService = require('../../smartthings/smartAppService');

const ThingsBotCommand = {
    init(installedSmartAppId, body = {}) {
        if (!installedSmartAppId) {
            console.error(`ERROR ** Unable to init ThingsBotCommand, no installedSmartAppId passed in`);
            return;
        }
        this.installedSmartAppId = installedSmartAppId;

        return this.initSlashCommand(body);
    },

    get deviceCommandsBlock() {
        return (async() => {
            const deviceList = await getDeviceList(this.installedSmartAppId);

            if (!deviceList) {
                console.error('ERROR ** Failed to pull valid device list in deviceCommandsBlock getter');
                return {
                    "response_type": "ephemeral",
                    "text": "Uh oh, there was a problem pulling your device list. Please try again."
                };
            } else if (deviceList.length === 0) {
                return {
                    "response_type": "ephemeral",
                    "text": "Oops, looks like you don't have any devices on your SmartThings account! Please add a device and then try again."
                };
            }

            return {
                "response_type": "ephemeral",
                "text": "Select a device to send a command to:",
                "blocks": [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "Select a device to send a command to:"
                        }
                    },
                    {
                        "type": "actions",
                        "block_id": this.installedSmartAppId,
                        "elements": [
                            {
                                "type": "static_select",
                                "placeholder": {
                                    "type": "plain_text",
                                    "text": "Devices",
                                    "emoji": true
                                },
                                "action_id": "listCommands",
                                "options": (deviceList).map((device) => {
                                    return {
                                        "text": {
                                            "type": "plain_text",
                                            "text": device.name,
                                            "emoji": true
                                        },
                                        "value": device.deviceId
                                    };
                                })
                            }
                        ]
                    }
                ]
            };
        })();
    }
};

async function getDeviceList(installedSmartAppId) {
    const smartAppContext = await smartAppService.getSmartAppContext(installedSmartAppId);
    const deviceList = await smartAppService.getDeviceList(smartAppContext);

    return deviceList ? deviceList.items : [];
}

Object.setPrototypeOf(ThingsBotCommand, SlashCommand);
module.exports = ThingsBotCommand;
