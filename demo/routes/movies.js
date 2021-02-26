const {getMovies, postMovie} = require('../controller/movieCtl');

const express = require('express');
const router = express.Router();

router.get('/', getMovies);

router.post('/', postMovie);

module.exports = router;