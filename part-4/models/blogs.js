const db = require('./index')

const blogSchema = new db.Schema(
    {
        title: String,
        author: String,
        url: String,
        likes: Number
      }
)

const Blog = db.model('Blog', blogSchema)

module.exports = Blog