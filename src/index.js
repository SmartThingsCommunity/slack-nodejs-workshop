'use strict';

const bodyParser = require('body-parser'),
      express = require('express'),
      smartApp = require('./lib/smartApp').publicKey('@smartthings_rsa.pub'),

      port = process.env.PORT || 8080,
      api = express();

api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: true }));

api.use('/SmartThings-Slack', require('./lib/api'));

api.post('/', (req, res) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path} ${req.body && req.body.lifecycle}`);
  smartApp.handleHttpCallback(req, res);
});

api.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
