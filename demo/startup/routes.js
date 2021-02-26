
const express = require('express');

const home = require('../routes/home'),
      genres = require('../routes/genres'),
      customers = require('../routes/customers'),
      movies = require('../routes/movies'),
      rentals = require('../routes/rentals');
      users = require('../routes/users'),
      auth = require('../routes/auth'),
      returns = require('../routes/returns');

const error = require('../middleware/error');

module.exports = function (app) {
    app.use(express.json());
    app.use('/api/auth', auth);
    app.use('/api/users', users);
    app.use('/api/rentals', rentals);
    app.use('/api/returns', returns);
    app.use('/api/movies', movies);
    app.use('/api/customers', customers);
    app.use('/api/genres', genres); 
    app.use('/', home);
    app.use(error);
}