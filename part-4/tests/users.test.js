const { test, after, describe, beforeEach } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const app = require('../app');
const db = require('../models')
const Blog = require('../models/blogs');
const User = require('../models/users');
const { listWithMultipleBlogs } = require('./blog_data');
const { oneUser } = require('./user_data');

const api = supertest(app);

beforeEach(async () => {
    await User.deleteMany({});
    const user = new User(oneUser[0]);
    await user.save();
    await Blog.deleteMany({});
    for (const blog of listWithMultipleBlogs) {
        await api
            .post('/api/blogs')
            .send(blog)
            .expect(201);
    }
});


describe("TEST SUITE FOR USERS", () => {

    describe('testing the endpoint [GET] /api/users', () => {
        test('users are returned as json', async () => {
            await api
                .get('/api/users')
                .expect(200)
                .expect('Content-Type', /application\/json/);
        });

        test('the identifier property of the user is named id', async () => {
            const response = await api.get('/api/users');
            assert(response.body[0].id);
        });

        test('check that the blogs property is populated', async () => {
            const response = await api.get('/api/users');
            assert(response.body[0].blogs[0].id);
        });

        test('check that the blogs property is populated with the correct number of blogs', async () => {
            const response = await api.get('/api/users');
            assert(response.body[0].blogs.length === listWithMultipleBlogs.length);
        });
    });

    describe('testing the endpoint [POST] /api/users', () => {
        test('creating a new user', async () => {
            const newUser = {
                username: 'newUser',
                name: 'New User',
                password: 'newUser',
            };

            await api
                .post('/api/users')
                .send(newUser)
                .expect(201)
                .expect('Content-Type', /application\/json/);

            const response = await api.get('/api/users');
            assert(response.body.length === 2);
        });

        test('creating a new user with a password less than 3 characters', async () => {
            const newUser = {
                username: 'newUser',
                name: 'New User',
                password: 'ne',
            };

            await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/);

            const response = await api.get('/api/users');
            assert(response.body.length === 1);
        });

        test('creating a new user with a username that already exists', async () => {
            const newUser = {
                username: 'root',
                name: 'Root',
                password: 'root',
            };

            await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/);

            const response = await api.get('/api/users');
            assert(response.body.length === 1);
        });
    });

});

after(() => {
    db.connection.close();
});