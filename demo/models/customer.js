const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi); // validating ObjectIds
const mongoose = require('mongoose');

const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: {
        type: String,
        require: true,
        minLength: 3,
        maxLength: 50
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        require: true,
        minLength: 3,
        maxlength: 15
    }
}));

function validate(customer) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        isGold: Joi.boolean().required(),
        phone: Joi.string().min(8).required()
    });
    return schema.validate(customer);
}

exports.Customer = Customer;
exports.validate = validate;