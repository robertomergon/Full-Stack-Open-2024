const info = (...params) => {
    console.log('\n[INFO]:', ...params, '\n');
}

const error = (...params) => {
    console.error('\n[ERROR]:', ...params, '\n');
}

module.exports = {
    info,
    error
};