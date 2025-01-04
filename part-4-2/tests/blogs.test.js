const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const BlogData = require('./blog_data');
const mongoose = require('mongoose');
const Blog = require('../models/blogs');

beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(BlogData.listWithMultipleBlogs);
});

afterAll(() => {
    mongoose.connection.close();
});

describe('[GET] /api/blogs', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs');
        expect(response.body).toHaveLength(BlogData.listWithMultipleBlogs.length);
    });

    test('check that the identifier is named id instead of _id', async () => {
        const response = await api.get('/api/blogs');
        expect(response.body[0].id).toBeDefined();
    });
});