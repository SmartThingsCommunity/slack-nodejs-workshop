'use strict';

const commandService = require('./commandService');

const commandController = {
    thingsbot: async function(req, res) {
        const installedSmartAppId = req.query.installedSmartAppId;
        const devices = await commandService.getDevices(installedSmartAppId);
        if (!devices || !Array.isArray(devices)) {
            console.error('ERROR ** Failed to pull valid device list in commandController:', devices)
            res.send({
                "response_type": "ephemeral",
                "text": "Uh oh, there was a problem pulling your device list. Please try again."
            });
            return;
        } else if (devices.length == 0) {
            res.send({
                "response_type": "ephemeral",
                "text": "Oops, looks like you don't have any devices on your SmartThings account! Please add a device and then try again."
            });
            return;
        }

        res.send({
            // `ephemeral` response type is only visible to the user running the slash command
            // `in_channel` response type will be shown to the entire channel
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
                    "block_id": installedSmartAppId,
                    "elements": [
                        {
                            "type": "static_select",
                            "placeholder": {
                                "type": "plain_text",
                                "text": "Devices",
                                "emoji": true
                            },
                            "action_id": "deviceList",
                            "options": devices.map((device) => {
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
        });
    }
};

module.exports = commandController;
