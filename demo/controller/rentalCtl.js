const   {Rental, validate} = require('../models/rental'),
        {Movie} = require('../models/movie'),
        {Customer} = require('../models/customer'); 

const   mongoose = require('mongoose');

const {logger} = require('../utils/logger')


//GET
exports.getRentals = async (req, res) => {
    const rentals = await Rental
            .find()
            .sort('-dateOut');
    res.send(rentals);  
}

exports.getRentalById = async (req, res) => {
    const rental = await Rental.findById(req.params.id);
  
    if (!rental) return res.status(404).send('The rental with the given ID was not found.');
  
    res.send(rental);
}

//POST
exports.postRental = async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid customer.');

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid movie.');

    if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');


    // Step 1: Start a Client Session   
    const session = await mongoose.startSession();

    //Step 2 : Optional. Define options to use for the transaction
    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
      };

    // Step 3: Use withTransaction to start a transaction, execute the callback, and commit (or abort on error)
    // Note: The callback for withTransaction MUST be async and/or return a Promise.
    try {
        await session.withTransaction(async () => {
            let rental = new Rental({ 
                customer: {
                _id: customer._id,
                name: customer.name, 
                phone: customer.phone
                },
                movie: {
                _id: movie._id,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate
                }
            }, );
            
            rental = await rental.save();
        
            movie.numberInStock--;
            await movie.save();
    
            res.send(rental);
        }, transactionOptions);
    } catch (error) {
        logger.error("Error: ", error);
        res.status(500).send('Somthing failed in transactions...')
    }  finally {
        await session.endSession();
        await client.close();
    }
}

