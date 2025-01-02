const userRouter = require('express').Router();
const User = require('../models/users');

userRouter.get('/', async (request, response) => {
    const users = await User.find({});
    response.json(users);
});

userRouter.post('/', async (request, response) => {
    const body = request.body;

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash: body.passwordHash
    });

    const savedUser = await user.save();
    response.status(201).json(savedUser);
});

module.exports = userRouter;