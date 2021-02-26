const { getGenres, 
        getGenreById, 
        postGenre,
        putGenreById, 
        deleteGenreById } = require('../controller/genreCtl');

const   authorize = require('../middleware/authorize'),
        checkAdmin = require('../middleware/admin'),
        validateObjectId = require('../middleware/validateObjectId');

const express = require('express');
const router = express.Router();

router.get('/', getGenres);

router.get('/:id',validateObjectId ,getGenreById);

router.post('/', authorize, postGenre);

router.put('/:id',validateObjectId, authorize, putGenreById);       

router.delete('/:id', validateObjectId, authorize, checkAdmin, deleteGenreById);

module.exports = router;