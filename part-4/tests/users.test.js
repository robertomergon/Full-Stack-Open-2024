const { test, after, describe, beforeEach } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const initialUsers = require('./test_initial_info').initialUsers;
const User = require('../models/users');

const api = supertest(app);

beforeEach(async () => {
    await User.deleteMany({});
    for (let user of initialUsers) {
        await api.post('/api/users').send(user);
    }
});

describe('testing the endpoint [POST] /api/users', () => {
    test('creating a new user', async () => {
        const newUser = {
            username: 'root' + Math.floor(Math.random() * 1000),
            name: 'Superuser',
            password: 'password',
        }

        await api.post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);
    });

    test('correct error code and message when creating a user with invalid credentials', async () => {
        const newUser = {
            username: 'rob',
            name: 'Superuser',
            password: 'pa',
        }

        const response = await api.post('/api/users').send(newUser);

        assert.strictEqual(response.status, 400);
        assert.strictEqual(response.body.error, 'password missing or too short');
    });
});

describe('testing the endpoint [POST] /api/login', () => {
    test('logging in with valid credentials', async () => {

        const response = await api.post('/api/auth').send({
            username: "root",
            password: "password"
        });

        assert(response.body.token);
    });

    test('logging in with invalid credentials', async () => {
        const user = {
            username: 'invalid',
            password: '12',
        };

        const response = await api.post('/api/auth').send(user);

        assert.strictEqual(response.status, 401);
    });
});

after(() => {
    mongoose.connection.close();
});