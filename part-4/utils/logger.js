const info = (...params) => {
    if (process.env.NODE_ENV !== 'test')
        console.log('\n[INFO]:', ...params, '\n');
}

const error = (...params) => {
    if (process.env.NODE_ENV !== 'test')
        console.error('\n[ERROR]:', ...params, '\n');
}

module.exports = {
    info,
    error
}; 