'use strict';

const DeviceCommand = {
    init(deviceId, deviceName, installedSmartAppId) {
        this.deviceId = deviceId;
        this.deviceName = deviceName;
        this.installedSmartAppId = installedSmartAppId;

        return this;
    },

    get commandsBlock() {
        return {
            "response_type": "ephemeral",
            "text": `Select a command to send to ${this.deviceName}:`,
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `Select a command to send to ${this.deviceName}:`
                    }
                },
                {
                    "type": "actions",
                    "block_id": this.installedSmartAppId,
                    "elements": [
                        {
                            "type": "button",
                            "action_id": "deviceOn",
                            "text": {
                                "type": "plain_text",
                                "text": "Turn On",
                                "emoji": true
                            },
                            "value": this.deviceId
                        },
                        {
                            "type": "button",
                            "action_id": "deviceOff",
                            "text": {
                                "type": "plain_text",
                                "text": "Turn Off",
                                "emoji": true
                            },
                            "value": this.deviceId
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
                                    "value": `${this.deviceId}.0`
                                },
                                {
                                    "text": {
                                        "type": "plain_text",
                                        "text": "Orange",
                                        "emoji": true
                                    },
                                    "value": `${this.deviceId}.39`
                                },
                                {
                                    "text": {
                                        "type": "plain_text",
                                        "text": "Green",
                                        "emoji": true
                                    },
                                    "value": `${this.deviceId}.120`
                                },
                                {
                                    "text": {
                                        "type": "plain_text",
                                        "text": "Cyan",
                                        "emoji": true
                                    },
                                    "value": `${this.deviceId}.180`
                                },
                                {
                                    "text": {
                                        "type": "plain_text",
                                        "text": "Blue",
                                        "emoji": true
                                    },
                                    "value": `${this.deviceId}.240`
                                },
                                {
                                    "text": {
                                        "type": "plain_text",
                                        "text": "Purple",
                                        "emoji": true
                                    },
                                    "value": `${this.deviceId}.280`
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
}

module.exports = DeviceCommand;
