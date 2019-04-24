const express = require('express');
const bodyParser = require('body-parser');
const smartApp = require('smartapp-lib').smartApp;
const handleSlashCommand = require('smartapp-lib').handleSlashCommand;

const server = module.exports = express();

server.use(express.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.post('/', (req, res) => {
  console.log(req);
  console.log(`${new Date().toISOString()} ${req.method} ${req.path} ${req.body && req.body.lifecycle}`);

  smartApp.publicKey('@smartthings_rsa.pub');
  smartApp.handleHttpCallback(req, res);
});

server.post('/slashCommand', async (req, res) => {
  console.log(req);
  const responseBody = await handleSlashCommand(req.body.text);
  res.send(responseBody);
});

const port = process.env.PORT || 8080;
server.listen(port, () => console.log(`Server is up and running on port ${port}`));
