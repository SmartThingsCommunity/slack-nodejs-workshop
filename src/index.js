'use strict';

const bodyParser = require('body-parser'),
      express = require('express'),
      smartApp = require('./lib/smartApp'),
      fs = require('fs'),

      port = process.env.PORT || 8080,
      api = express();

api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: true }));

api.use('/SmartThings-Slack', require('./lib/api'));

api.post('/smartapp', (req, res) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path} ${req.body && req.body.lifecycle}`);

  smartApp.publicKey('@smartthings_rsa.pub');
  smartApp.handleHttpCallback(req, res);
});

api.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
