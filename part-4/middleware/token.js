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

module.exports = tokenExtractor;