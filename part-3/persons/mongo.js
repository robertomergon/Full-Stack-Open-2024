const mongoose = require('mongoose');

const db_password = process.argv[2];
const mongoUri = `mongodb+srv://robertomergon:${db_password}@cluster0.oxxeh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const name = process.argv[3];
const number = process.argv[4];

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

const Person = mongoose.model('Person', personSchema);

if (name && number) {
    const person = new Person({
        name: name,
        number: number
    });

    person.save().then(result => {
        console.log(`Added ${name} number ${number} to phonebook`);
        mongoose.connection.close().then(() => {
            console.log('\nConnection closed\n');
        });
    });
} else {
    Person.find({}).then(result => {
        console.log('Phonebook:');
        result.forEach(person => {
            console.log(`• ${person.name} ${person.number}`);
        });
        mongoose.connection.close().then(() => {
            console.log('\nConnection closed\n');
        });
    });
}

