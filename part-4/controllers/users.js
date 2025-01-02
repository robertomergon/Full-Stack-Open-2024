const userRouter = require('express').Router();
const User = require('../models/users');
const bcryptjs = require('bcryptjs');

userRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 });
    response.json(users);
});

userRouter.post('/', async (request, response) => {
    const body = request.body;
    if (body.password.length < 3) {
        return response.status(400).json({ error: 'Password must be at least 3 characters long' });
    }

    const saltRounds = 10;

    const passwordHash = await bcryptjs.hash(body.password, saltRounds);

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash: passwordHash
    });

    try {
        const savedUser = await user.save();
        response.status(201).json(savedUser);
    } catch (error) {
        response.status(400).json({ error: "Username must be unique" });
    }
});

userRouter.delete('/:id', async (request, response) => {
    await User.findByIdAndRemove(request.params.id);
    response.status(204).end();
});

module.exports = userRouter;