const User = require('../models/users');

function tokenExtractor(request, response, next) {
    const authorization = request.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        request.token = authorization.substring(7);
        next();
    }
    else {
        response.status(401).json({ error: 'Token missing or invalid' });
    }
}

async function userExtractor(request, response, next) {
    const token = request.token;
    const users = await User.find({});
    const user = users.find((user) => user.loginToken === token);
    if (!user) {
        return response.status(401).json({ error: 'Unauthorized user' });
    }
    request.user = user;
    next();
}

module.exports = { tokenExtractor, userExtractor };