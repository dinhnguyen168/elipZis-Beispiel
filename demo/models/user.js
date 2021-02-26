const   Joi = require('joi');

const mongoose = require('mongoose'),
      jwt = require('jsonwebtoken'),
      config = require('config');

Joi.objectId = require('joi-objectid')(Joi);

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        min: 3,
        max: 50,
        required: true
    },
    email : {
        type: String,
        unique: true,
        min:5,
        max: 255,
        required : true
    }, 
    password : {
        type: String,
        min: 3,
        max: 255,
        required: true
    },
    isAdmin: Boolean,
});

//Information Expert Principle : an object that has enough information and is an expert in a given area,
//that object should be responsible for making decision and performing tasks. 
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id : this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('User', userSchema);

function validate(user) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(3).max(255).required().email(),
        password: Joi.string().min(3).max(255).required(),
    });

    return schema.validate(user);
}

exports.validate = validate;
exports.User = User;