const { test, after, describe, beforeEach } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const app = require('../app');
const db = require('../models')
const User = require('../models/users');
const { usersList } = require('./user_data');

const api = supertest(app);

beforeEach(async () => {
    await User.deleteMany({});
    const user = await api
        .post('/api/users')
        .send(usersList[0])
        .expect(201);
});

describe("TEST SUITE FOR USER AUTHENTICATION", () => {
    describe('testing the endpoint [POST] /api/auth/login', () => {
        test('logging in a user', async () => {
            const user = {
                username: usersList[0].username,
                password: usersList[0].password,
            };

            const response = await api
                .post('/api/auth/login')
                .send(user)
                .expect(200)
                .expect('Content-Type', /application\/json/);
            assert(response.body.token);
        });

        test('logging in a user with invalid credentials', async () => {
            const user = {
                username: 'invalidUser',
                password: 'invalidPassword',
            };

            const response = await api
                .post('/api/auth/login')
                .send(user)
                .expect(401)
                .expect('Content-Type', /application\/json/);

            assert(response.body.error);
        });
    });
});

after(async () => {
    await db.connection.close();
});