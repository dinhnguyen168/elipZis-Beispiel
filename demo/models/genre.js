const mongoose = require('mongoose');
const Joi = require('joi'); 
Joi.objectId = require('joi-objectid')(Joi); // validating ObjectIds

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        minLength: 3,   
        maxLength: 50
    }
});

const Genre = mongoose.model('Genre', genreSchema);

function validate(genre){
    const schema = Joi.object({
        name : Joi.string().min(3).max(50).required()
    });
    return schema.validate(genre);  
};

exports.Genre = Genre;
exports.validate = validate;
exports.genreSchema = genreSchema;
