const express = require('express');
const smartApp = require('smartapp-lib');
const server = module.exports = express();
const PORT = process.env.PORT || 8080;

server.use(express.json());

server.post('/', function(req, res, next) {
  console.log(req);
  console.log(`${new Date().toISOString()} ${req.method} ${req.path} ${req.body && req.body.lifecycle}`);

  smartApp.publicKey('@smartthings_rsa.pub');
  smartApp.handleHttpCallback(req, res);
});

server.listen(PORT, () => console.log(`Server is up and running on port ${PORT}`));
