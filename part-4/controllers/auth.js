const authRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

const User = require('../models/users');

authRouter.post('/login', async (request, response) => {
    const { username, password } = request.body;
    const user = await User.findOne({ username });

    if (!user) {
        return response.status(401).json({ error: 'invalid username or password' });
    }

    const passwordCorrect = await bcryptjs.compare(password, user.passwordHash);

    if (!passwordCorrect) {
        return response.status(401).json({ error: 'invalid username or password' });
    }

    const userForToken = {
        username: user.username,
        id: user._id,
    };

    const token = jwt.sign(userForToken, process.env.SECRET);

    user.loginToken = token;
    await user.save();

    response.set('Authorization', `Bearer ${token}`);
    response.status(200).send({ token, username: user.username, name: user.name });
});

module.exports = authRouter;