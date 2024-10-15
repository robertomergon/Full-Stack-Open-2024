const mongoose = require('mongoose');
mongoose.set('strictQuery' , true)
const config = require('../utils/config');

const mongoUri = config.MONGODB_URI;

mongoose.connect(mongoUri, {})
    .then(() => {
        console.log('\nConnected to MongoDB\n');
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB:', error.message);
    });

module.exports = mongoose