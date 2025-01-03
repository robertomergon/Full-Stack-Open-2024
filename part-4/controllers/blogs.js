const blogRouter = require('express').Router();
const tokenExtractor = require('../middleware/token');
const Blog = require('../models/blogs');
const User = require('../models/users');

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
  return response
})

blogRouter.post('/', tokenExtractor, async (request, response) => {
  const token = request.token;

  const users = await User.find({});
  const user = users.find((user) => user.loginToken === token);

  const { title, author, url, likes } = request.body;

  if (!title || !url) {
    return response.status(400).json({ error: 'Title or URL missing' });
  }

  if (!user) {
    return response.status(400).json({ error: 'No users found to assign as creator' });
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogRouter.delete('/:id', tokenExtractor, async (request, response) => {
  const token = request.token;

  const users = await User.find({});
  const user = users.find((user) => user.loginToken === token);

  if (!user) {
    return response.status(401).json({ error: 'Unauthorized user' });
  }

  // Check if the user is the creator of the blog post
  const blog = await Blog.findById(request.params.id);
  if (blog.user.toString() !== user._id.toString()) {
    return response.status(401).json({ error: 'Unauthorized' });
  }

  user.blogs = user.blogs.filter((blog) => blog.id !== request.params.id);
  await user.save();
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