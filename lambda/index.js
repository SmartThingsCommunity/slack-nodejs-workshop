'use strict';
const awsServerlessExpress = require('aws-serverless-express'),
      awsServerlessExpressMiddleware = require('aws-serverless-express/middleware'),
      bodyParser = require('body-parser'),
      express = require('express'),
      smartapp = require('smartapp-lib').smartApp,

      api = express(),
      server = awsServerlessExpress.createServer(api);

api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: true }));
// Add middleware to pass Lambda payloads through standard express routing framework
api.use(awsServerlessExpressMiddleware.eventContext());

// Pass all traffic to our API Gateway's base path to our routers
api.use('/SmartThings-Slack', require('smartapp-lib').api);

exports.handler = async (event, context, callback) => {
    // Proxy Slack events to our routers, SmartThings events to our SmartApp
    if (event.resource) {
        return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise;
    } else {
        return smartapp.handleLambdaCallback(event, context, callback);
    }
}
