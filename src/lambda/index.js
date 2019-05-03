'use strict';

const awsServerlessExpress = require('aws-serverless-express'),
      awsServerlessExpressMiddleware = require('aws-serverless-express/middleware'),
      bodyParser = require('body-parser'),
      express = require('express'),
      smartapp = require('../lib/smartApp'),

      api = express(),
      server = awsServerlessExpress.createServer(api);

api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: true }));
// Add middleware to pass Lambda payloads through standard express routing framework
api.use(awsServerlessExpressMiddleware.eventContext());

// Pass all traffic to our API Gateway's base path to our routers
api.use('/SmartThings-Slack', require('../lib/api'));

exports.handler = async (event, context, callback) => {
    // Proxy Slack events to our routers, SmartThings events to our SmartApp
    if (event.resource) { // Incoming from API Gateway (Slack event)
        return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise;

    } else { // Direct Lambda invocation from SmartThings
        return smartapp.handleLambdaCallback(event, context, callback);
    }
}
