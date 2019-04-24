'use strict';

const request = require('request-promise-native');

const blockService = {
    sendDeviceCommands: async function(deviceId, deviceName, installedSmartAppId, responseUrl) {
        await request({
	        method: 'POST',
	        uri: responseUrl,
	        json: true,
	        body: {
                // `ephemeral` response type is only visible to the user running the slash command
                // `in_channel` response type will be shown to the entire channel
                "response_type": "ephemeral",
                "text": `Select a command to send to ${deviceName}:`,
                "blocks": [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": `Select a command to send to ${deviceName}:`
                        }
                    },
                    {
                        "type": "actions",
                        "block_id": installedSmartAppId,
                        "elements": [
                            {
                                "type": "button",
                                "action_id": "deviceOn",
                                "text": {
                                    "type": "plain_text",
                                    "text": "Turn On",
                                    "emoji": true
                                },
                                "value": deviceId
                            },
                            {
                                "type": "button",
                                "action_id": "deviceOff",
                                "text": {
                                    "type": "plain_text",
                                    "text": "Turn Off",
                                    "emoji": true
                                },
                                "value": deviceId
                            },
                            {
                                "type": "static_select",
                                "placeholder": {
                                    "type": "plain_text",
                                    "text": "Colors",
                                    "emoji": true
                                },
                                "action_id": "deviceSetColor",
                                "options": [
                                    {
                                        "text": {
                                            "type": "plain_text",
                                            "text": "Red",
                                            "emoji": true
                                        },
                                        "value": `${deviceId}.0`
                                    },
                                    {
                                        "text": {
                                            "type": "plain_text",
                                            "text": "Orange",
                                            "emoji": true
                                        },
                                        "value": `${deviceId}.39`
                                    },
                                    {
                                        "text": {
                                            "type": "plain_text",
                                            "text": "Green",
                                            "emoji": true
                                        },
                                        "value": `${deviceId}.120`
                                    },
                                    {
                                        "text": {
                                            "type": "plain_text",
                                            "text": "Cyan",
                                            "emoji": true
                                        },
                                        "value": `${deviceId}.180`
                                    },
                                    {
                                        "text": {
                                            "type": "plain_text",
                                            "text": "Blue",
                                            "emoji": true
                                        },
                                        "value": `${deviceId}.240`
                                    },
                                    {
                                        "text": {
                                            "type": "plain_text",
                                            "text": "Pink",
                                            "emoji": true
                                        },
                                        "value": `${deviceId}.350`
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        }).catch((err) => {
            console.error('Error posting to Slack response URL in deviceList', err);
        });
    }
}

module.exports = blockService;
