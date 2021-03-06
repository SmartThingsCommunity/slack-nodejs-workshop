'use strict';

const router = require('express').Router(),
      commandController = require('./commandController'),
      blockController = require('./blockController');

// Dumb hack to deal with Lambda's premature execution termination
async function route(res, promise) {
    if (process.env.EXECUTION_CONTEXT !== 'LAMBDA') {
        res.status(200).send();
    }

    try {
        await promise
    } catch (err) {
        console.error('ERROR ** Caught unhandled error in API execution:', err);
    }

    if (process.env.EXECUTION_CONTEXT === 'LAMBDA') {
        res.status(200).send();
    }
}

router.post('/cmd/thingsBot', (req, res) => {
    route(res,
        commandController.routeCommand(req, 'thingsBot')
    );
});

router.post('/receive', (req, res) => {
    route(res,
        blockController.receive(req)
    );
});

module.exports = router;
