const {Movie, validate} = require('../models/movie'),
      {Genre} = require('../models/genre');

//Get all movies from db
exports.getMovies = async (req, res) => {
    const movies = await Movie
        .find()
        .sort('title');
    res.send(movies);
}

//Post movie to the endpoint
exports.postMovie = async (req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(404).send('Invalid genre...');

    let movie = new Movie({
        title: req.body.title, 
        genre: {
            _id : genre._id, 
            name: genre.name
        },
        numberInStock :req.body.numberInStock,
        dailyRentalRate :req.body.dailyRentelRate, 
    });

    movie = await movie.save();
    res.send(movie);
}


