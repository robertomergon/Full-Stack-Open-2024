const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const Person = require('./mongo');

const app = express();

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>');
});

// Get the info of the whole phonebook
app.get('/api/persons', (req, res) => {
    console.log('Getting persons...');
    Person.find({}).then(persons => {
        res.json(persons);
    }).catch(error => {
        console.log('Error getting persons:', error);
        res.status(500).end();
    });
});

// Get the info of the length of the phonebook and the current date
app.get('/info', (req, res) => {
    const date = new Date();
    Person.find({}).then(persons => {
        res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`);
    }).catch(error => {
        console.log('Error getting persons:', error);
        res.status(500).end();
    });
});

// Get the info of a single person by id
app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    Person.findById(id).then(person => {
        if (person) {
            res.json(person);
        } else {
            res.status(404).end();
        }
    });
});

// Delete a person by id
app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    Person.deleteOne({ _id: id }).then(() => {
        res.status(204).end();
    }).catch(error => {
        console.log('Error deleting person:', error);
        res.status(500).end();
    });
});

// Add a new person to the phonebook
app.post('/api/persons', (req, res) => {
    const body = req.body;
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'name or number is missing'
        });
    }
    Person.find({ name: body.name }).then(persons => {
        if (persons.length > 0) {
            Person.updateOne({ number: body.number }).then(() => {
                res.status(204).end();
            }).catch(error => {
                console.log('Error updating person:', error);
                res.status(500).end();
            });
        }
    });
    const person = {
        name: body.name,
        number: body.number
    };
    Person.create(person).then(newPerson => {
        res.json(newPerson);
    }).catch(error => {
        console.log('Error creating person:', error);
        res.status(500).end();
    });
});

// Update a person's number
app.put('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const person = {
        number: body.number
    };
    Person.findByIdAndUpdate(id, person, { new: true }).then(updatedPerson => {
        res.json(updatedPerson);
    }).catch(error => {
        console.log('Error updating person:', error);
        res.status(500).end();
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});