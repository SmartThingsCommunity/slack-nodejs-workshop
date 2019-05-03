'use strict';

const router = require('express').Router(),
      commandController = require('./commandController'),
      blockController = require('./blockController');

router.post('/cmd/thingsbot', (req, res) => {
    commandController.thingsbot(req, res);
});

router.post('/receive', async (req, res) => {
    res.write('');
    await blockController.receive(req, res);
});

module.exports = router;
