const authorize = require('../middleware/authorize');
const {Rental} = require('../models/rental');

exports.postReturn = async (req, res) => {
    if(!req.body.customerId) return await res.status(400).send('customerId is not provided!');
    if(!req.body.movieId) return await res.status(400).send('customerId is not provided!');
    const rental = await Rental.findOne({
        'customer._id' : req.body.customerId,
        'movie._id' : req.body.movieId
    });
    if(!rental) return await res.status(404).send('no rental with given customerId and movieId!');
    if(rental.dateReturned) return await res.status(400).send('return is already processed!');

    rental.dateReturned = new Date();
    rental.save();
    return await  res.status(200).send('Succesfully!');
}