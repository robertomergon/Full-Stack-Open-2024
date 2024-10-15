const { test, after, describe, beforeEach } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const app = require('../app');
const db = require('../models')
const Blog = require('../models/blogs');
const { listWithMultipleBlogs } = require('./blog_data');

const api = supertest(app);

beforeEach(async () => {
    await Blog.deleteMany({});
    for (let blog of listWithMultipleBlogs) {
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
        assert(response.body.length === listWithMultipleBlogs.length + 1);
    });

    test('creating a new blog post with missing likes property, it is 0 if it´s missing', async () => {
        const newBlog = {
            title: 'New blog post',
            author: 'New author',
            url: 'http://newblog.com',
        };

        const blog = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        assert(blog.body.likes === 0);
    });

    describe('Try to create a blog with missing title or url', () => {
        test('missing title', async () => {
            const newBlog = {
                author: 'New author',
                url: 'http://newblog.com',
            };

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(400);
        });

        test('missing url', async () => {
            const newBlog = {
                title: 'New blog post',
                author: 'New author',
            };

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(400);
        });

    });

});
        

after(() => {
    db.connection.close();
});
