const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const mongoUri = process.env.MONGO_URI;

console.log('mongoUri:', mongoUri);

mongoose.connect(mongoUri, {})
    .then(() => {
        console.log('\nConnected to MongoDB\n');
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB:', error.message);
    });

const personSchema = new mongoose.Schema({
    name: String,
    number: String
});

module.exports = mongoose.model('Person', personSchema);

