const   { postUserToLogin } = require('../controller/authCtl');

const   express = require('express');
const   router = express.Router();

router.post('/', postUserToLogin);

module.exports = router;