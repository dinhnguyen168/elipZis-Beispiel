const { getRentals, 
        postRental, 
        getRentalById} = require('../controller/rentalCtl');

const validateObjectId = require('../middleware/validateObjectId');

const   express = require('express');
const   router = express.Router();

router.get('/', getRentals);

router.post('/', postRental);

router.get('/:id', getRentalById);

module.exports = router; 