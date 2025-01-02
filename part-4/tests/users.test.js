const { test, after, describe, beforeEach } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const app = require('../app');
const db = require('../models')
const User = require('../models/users');

const api = supertest(app);

beforeEach(async () => {
    await User.deleteMany({});
    const user = new User({ username: 'root', name: 'Root', passwordHash: 'root' });
    await user.save();
});

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
});

describe('testing the endpoint [POST] /api/users', () => {
    test('creating a new user', async () => {
        const newUser = {
            username: 'newUser',
            name: 'New User',
            passwordHash: 'newUser',
        };

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const response = await api.get('/api/users');
        assert(response.body.length === 2);
    });
});

after(() => {
    db.connection.close();
});