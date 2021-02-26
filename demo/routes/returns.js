const {postReturn} = require('../controller/returnCtl');

const authorize = require('../middleware/authorize');

const express = require('express');
const router = express.Router();

router.post('/', authorize, postReturn);

module.exports = router;