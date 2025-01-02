const db = require('./index')

const userSchema = new db.Schema({
    _id: {
        type: db.Schema.Types.ObjectId,
        auto: true,
        required: false,
    },
    username: {
        minLength: 3,
        type: String,
        unique: true,
    },
    name: String,
    passwordHash: String,
    loginToken: {
        type: String,
        required: false,
    },
    blogs: [{
        type: db.Schema.Types.ObjectId,
        ref: 'Blog'
    }]
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

const User = db.model('User', userSchema)

module.exports = User