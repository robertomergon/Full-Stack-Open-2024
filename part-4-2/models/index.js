const mongoose = require('mongoose');
const config = require('../utils/config.js');

mongoose.set('strictQuery', true);

const mongoUri = config.MONGODB_URI;

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(mongoUri, {});
        if (process.env.NODE_ENV !== 'test')
            console.log('\nConnected to MongoDB\n');
    } catch (error) {
        console.log('Error connecting to MongoDB:', error.message);
    }
};

connectToMongoDB();

module.exports = mongoose;