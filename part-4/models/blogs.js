const db = require('./index')

const blogSchema = new db.Schema(
    {
        title: String,
        author: String,
        url: String,
        likes: Number
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