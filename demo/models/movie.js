const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi); // validating ObjectIds
const mongoose = require('mongoose');

const {genreSchema, Genre} = require('./genre');

const movieSchema = new mongoose.Schema({
    title:{
        type: String,
        minLength: 3,
        trim: true,
        required: true,
    }, 
    genre:{
        type: genreSchema,
        required: true
    },
    numberInStock:{
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate:{
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
});

const Movie = mongoose.model('Movie', movieSchema);

function validate(movie) {
    const schema = Joi.object({
        title : Joi.string().min(3).required(),
        numberInStock : Joi.number(),
        dailyRentelRate : Joi.number(),
        genreId: Joi.objectId().required()
    });
    return schema.validate(movie);
}

exports.Movie = Movie;
exports.validate = validate;