const qs = require('qs');
const smartApp = require('smartapp-lib').smartApp;
const handleSlashCommand = require('smartapp-lib').handleSlashCommand;

exports.handler = async (event, context, callback) => {
    if (event.resource === '/SmartThings-Slack') {
        const text = qs.parse(event.body).text;
        const response = await handleSlashCommand(text);
        context.succeed({
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": response
        });
    } else {
        smartApp.handleLambdaCallback(event, context, callback);
    }
};
