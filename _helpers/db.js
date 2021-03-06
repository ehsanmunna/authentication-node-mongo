const config = require('config.json');
const mongoose = require('mongoose');
mongoose.connect(config.connectionString, { useNewUrlParser: true, useCreateIndex: true });
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../users/user.model')
};