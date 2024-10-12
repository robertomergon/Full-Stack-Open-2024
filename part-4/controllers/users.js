const bcryptjs = require('bcryptjs');
const usersRouter = require('express').Router();
const User = require('../models/users');

usersRouter.post('/', async (request, response) => {
    const body = request.body;

    if (!body.password || body.password.length < 3) {
        return response.status(400).json({ error: 'password missing or too short' });
    }

    const saltRounds = 10;
    const passwordHash = await bcryptjs.hash(body.password, saltRounds);

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash: passwordHash,
    });

    const savedUser = await user.save();
    if (!savedUser) {
        return response.status(500).json({ error: 'An error occurred while saving the user' });
    }
    response.status(201).json(savedUser);
});

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users);
});

module.exports = usersRouter;