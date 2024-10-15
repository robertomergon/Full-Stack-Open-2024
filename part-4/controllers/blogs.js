const blogRouter = require('express').Router();
const Blog = require('../models/blogs');

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
    return response
  })
  
blogRouter.post('/', async (request, response) => {
    if (!request.body.likes) {
      request.body.likes = 0
    }

    if (!request.body.title || !request.body.url) {
      response.status(400).end()
      return response
    }

    const blog = new Blog(request.body)
  
    const result = await blog
      .save()
      response.status(201).json(result)
      return response
  })

module.exports = blogRouter;