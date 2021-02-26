const { getCustomers, 
        getCustomerById, 
        postCustomer,
        putCustomerById, 
        deleteCustomerById } = require('../controller/customerCtl');

const express = require('express');
const router = express.Router();

router.get('/', getCustomers);

router.get('/:id', getCustomerById);

router.post('/', postCustomer);

router.put('/:id', putCustomerById);

router.delete('/:id', deleteCustomerById);

module.exports = router;