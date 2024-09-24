const blogRouter = require('express').Router();
const Blog = require('../models/blogs');

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs);
});

blogRouter.get('/:id', (request, response, next) => {
    Blog.findById(request.params.id)
        .then(blog => {
            if (blog) {
                response.json(blog);
            } else {
                response.status(404).end();
            }
        })
        .catch(error => next(error));
});

blogRouter.post('/', async (request, response, next) => {
    const body = request.body;
    if (!body.title || !body.url) {
        return response.status(400).json({ error: 'title or url missing' });
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0
    });

    const savedBlog = await blog.save()
    response.status(201).json(savedBlog);
});

blogRouter.delete('/:id', (request, response, next) => {
    Blog.findByIdAndDelete(request.params.id)
        .then(() => {
            response.status(204).end();
        })
        .catch(error => next(error));
});

blogRouter.put('/:id', (request, response, next) => {
    const body = request.body;

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    };

    Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
        .then(updatedBlog => {
            response.json(updatedBlog);
        })
        .catch(error => next(error));
});

module.exports = blogRouter;