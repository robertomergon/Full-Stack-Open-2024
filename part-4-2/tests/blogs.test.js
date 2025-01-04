const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const BlogData = require('./blog_data');
const UserData = require('./user_data');
const mongoose = require('mongoose');
const Blog = require('../models/blogs');
const User = require('../models/users');

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

describe('[POST] /api/blogs', () => {
    test('a valid blog can be added', async () => {
        const newBlog = {
            title: 'New blog',
            author: 'New author',
            url: 'http://newblog.com',
            likes: 0
        };

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const response = await api.get('/api/blogs');
        expect(response.body).toHaveLength(BlogData.listWithMultipleBlogs.length + 1);
        expect(response.body).toContainEqual(expect.objectContaining(newBlog))
    });

    test.only('if the likes property is missing, it will default to 0', async () => {
        const newBlog = {
            title: 'New blog',
            author: 'New author',
            url: 'http://newblog.com'
        };

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const response = await api.get('/api/blogs');
        const blog = response.body.find(blog => blog.title === newBlog.title);
        expect(blog.likes).toBe(0);
    });
});
