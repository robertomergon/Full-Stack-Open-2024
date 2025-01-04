const db = require('./index')

const blogSchema = new db.Schema(
    {
        url: String,
        title: String,
        author: String,
        likes: Number,
        user: {
            type: db.Schema.Types.ObjectId,
            ref: 'User'
        }
    }
)

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Blog = db.model('Blog', blogSchema)

module.exports = Blog