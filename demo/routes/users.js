const   {postUserToRegister, getCurrentUser} = require('../controller/userCtl');

const   authorize = require('../middleware/authorize');

const   express = require('express');
const   router = express.Router();

router.get('/me', authorize, getCurrentUser)

router.post('/', postUserToRegister);

module.exports = router;