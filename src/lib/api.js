'use strict';

const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('Hello, world!');
});

router.use('/slack', require('./slack'));

module.exports = router;
