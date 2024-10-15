const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    } else if (
        error.name === 'ValidationError' ||
        error.number === 'ValidationError'
    ) {
        return response.status(400).json({
            error: error.message,
        });
    }
    next(error);
};

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

const requestLogger = (request, response, next) => {
    if (process.env.NODE_ENV !== 'test') {
        console.log('\n[REQUEST INFO]');
        console.log('Method:', request.method);
        console.log('Path:', request.path);
        console.log('Body:', request.body);
        console.log('---');
    }
    next();
};

module.exports = {
    errorHandler,
    unknownEndpoint,
    requestLogger
};