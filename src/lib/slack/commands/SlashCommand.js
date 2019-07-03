'use strict';

const request = require('request-promise-native');

const SlashCommand = {
    initSlashCommand(body = {}) {
        const validated = requireParams(body, ['response_url', 'channel_id', 'user_id']);
        if (!validated) { return; }

        // Required params
        this.responseUrl = body.response_url;
        this.channelId = body.channel_id;
        this.userId = body.user_id;

        // Optional params
        this.text = body.text;
        this.triggerId = body.trigger_id;
        this.command = body.command;
        this.userName = body.user_name;
        this.teamId = body.team_id;
        this.teamDomain = body.team_domain;
        this.enterpriseId = body.enterprise_id;
        this.enterpriseName = body.enterprise_name;

        return this;
    },

    sendResponse: async function(block) {
        try {
            await request({
                method: 'POST',
                uri: this.responseUrl,
                json: true,
                body: block
            })
        } catch {
            console.error('ERROR ** Error posting to Slack response URL for slash command', err);
        }
    }
};

function requireParams(body, params) {
    for (const param of params) {
        if (!body[param]) {
            console.error(`ERROR ** Unable to init SlashCommand, no ${param} param found in body:`, body);
            return false;
        }
    }
    return true;
}

module.exports = SlashCommand;
