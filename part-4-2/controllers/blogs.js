const blogRouter = require('express').Router();
const { tokenExtractor, userExtractor } = require('../middleware/token');
const Blog = require('../models/blogs');

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
  return response
})

blogRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body;

  if (!title || !url) {
    return response.status(400).json({ error: 'Title or URL missing' });
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
  });

  const savedBlog = await blog.save();

  response.status(201).json(savedBlog);
});

blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
})

blogRouter.put('/:id', async (request, response) => {
  // Increase the likes of the blog post by one each time the endpoint is hit
  const blog = await Blog.findById(request.params.id)
  blog.likes = blog.likes + 1
  const result = await blog.save()
  response.json(result)
  return response
})

module.exports = blogRouter;