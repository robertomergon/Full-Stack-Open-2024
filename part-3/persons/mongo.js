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
    name: {
        type: String,
        required: true,
        validate: {
            validator: (name) => name.length >= 3,
            message: (props) => `${props.value} is shorter than the minimum allowed length (3)`
        }
    },
    number: {
        type: String,
        required: true,
        validate: {
            validator: (number) => number.length >= 8 && /^\d{2,3}-\d+$/.test(number),
            message: (props) => `${props.value} is shorter than the minimum allowed length (8) or does not match the pattern 123-4567`
        }
    }
});

module.exports = mongoose.model('Person', personSchema);

