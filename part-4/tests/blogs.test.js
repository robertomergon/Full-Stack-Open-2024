const { test, after, describe, beforeEach } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const initialBlogs = require('./test_initial_info');
const Blog = require('../models/blogs');

const api = supertest(app);

beforeEach(async () => {
    await Blog.deleteMany({});
    for (let blog of initialBlogs) {
        let blogObject = new Blog(blog);
        await blogObject.save();
    }
});

describe('testing the enpoint [GET] /api/blogs', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('the identifier property of the blog posts is named id', async () => {
        const response = await api.get('/api/blogs');
        assert(response.body[0].id);
    });

});

describe('testing the endpoint [POST] /api/blogs', () => {

    test('creating a new blog post', async () => {
        const newBlog = {
            title: 'New blog post',
            author: 'New author',
            url: 'http://newblog.com',
            likes: 0,
        };

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const response = await api.get('/api/blogs');
        assert.strictEqual(response.body.length, initialBlogs.length + 1);
    });

    test('if the "likes" property is missing, it will default to 0', async () => {
        const newBlog = {
            title: 'New blog post',
            author: 'New author',
            url: 'http://newblog.com',
        };

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);
    });

    describe('if the title or url properties are missing', () => {
        test('title is missing, return 400 Bad Request', async () => {
            const newBlog = {
                author: 'New author',
                url: 'http://newblog.com',
                likes: 0,
            };

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(400);
        });

        test('url is missing, return 400 Bad Request', async () => {
            const newBlog = {
                title: 'New blog post',
                author: 'New author',
                likes: 0,
            };

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(400);
        });

    });

});

describe('testing the endpoint [DELETE] /api/blogs/:id', () => {
    test('deleting a blog post', async () => {
        const response = await api.get('/api/blogs');
        const blogToDelete = response.body[0];

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204);

        const blogsAtEnd = await api.get('/api/blogs');
        assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length - 1);
    });
});

describe('testing the endpoint [PUT] /api/blogs/:id', () => {
    test('updating a blog post', async () => {
        const response = await api.get('/api/blogs');
        const blogToUpdate = response.body[0];
        const updatedBlog = {
            likes: blogToUpdate.likes + 1,
        };

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedBlog)
            .expect(200);

        const blogsAtEnd = await api.get('/api/blogs');
        const updatedBlogAtEnd = blogsAtEnd.body[0];
        assert.strictEqual(updatedBlogAtEnd.likes, blogToUpdate.likes + 1);
    });
});

after(() => {
    mongoose.connection.close();
});