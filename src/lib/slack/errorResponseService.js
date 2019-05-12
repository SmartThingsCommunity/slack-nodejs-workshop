'use strict';

const request = require('request-promise-native');

const errorResponseService = {
    sendErrorResponse: async function(responseUrl) {
        if (!responseUrl) {
            console.error('ERROR ** No response URL passed to errorResponseService, unable to deliver error message to user');
            return;
        }

        await request({
	        method: 'POST',
	        uri: responseUrl,
	        json: true,
	        body: {
                text: 'Uh oh, there was an unexpected error while attempting to execute your command. Please try again.'
            }
        }).catch((err) => {
            console.error('ERROR ** Error posting to Slack response URL', err);
        });
    }
}

module.exports = errorResponseService;
