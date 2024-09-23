const mongoose = require('mongoose');
const config = require('../utils/config');

const mongoUri = config.MONGO_URI;

mongoose.connect(mongoUri, {})
    .then(() => {
        console.log('\nConnected to MongoDB\n');
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB:', error.message);
    });

module.exports = mongoose
