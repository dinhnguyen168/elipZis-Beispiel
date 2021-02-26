const mongoose = require('mongoose');
const {logger} = require('../utils/logger');
const config = require('config')

module.exports = function() {
    const db = config.get('db');

    mongoose.connect(db, { useUnifiedTopology: true, useCreateIndex: true, useNewUrlParser: true, useFindAndModify: false })
    .then(() => logger.info(`Connected to ${db}...`));
}