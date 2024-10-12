const blogRouter = require('express').Router();
const Blog = require('../models/blogs');

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
    response.json(blogs);
});

blogRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
        response.json(blog);
    } else {
        response.status(404).end();
    }
});

blogRouter.post('/', async (request, response) => {
    const body = request.body;

    console.log(body);
    if (!body.title || !body.url) {
        return response.status(400).json({ error: 'title or url missing' });
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: body.user || ""
    });

    const savedBlog = await blog.save()
    response.status(201).json(savedBlog);
});

blogRouter.delete('/:id', async (request, response) => {
    const blog = await Blog.findByIdAndDelete(request.params.id)
    if (blog) {
        response.status(204).end();
    } else {
        response.status(404).end();
    }
});

blogRouter.put('/:id', async (request, response) => {
    const body = request.body;

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: body.user
    };

    const blogUpdated = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(blogUpdated);
});

module.exports = blogRouter;