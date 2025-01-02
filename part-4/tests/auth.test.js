const { test, after, describe, beforeEach } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const app = require('../app');
const db = require('../models')
const User = require('../models/users');
const { oneUser } = require('./user_data');
const bcryptjs = require('bcryptjs');

const api = supertest(app);

beforeEach(async () => {
    await User.deleteMany({});
    const user = new User(oneUser[0]);
    user.passwordHash = await bcryptjs.hash("root", 10);
    await user.save();
});

describe("TEST SUITE FOR USER AUTHENTICATION", () => {
    describe('testing the endpoint [POST] /api/auth/login', () => {
        test('logging in a user', async () => {
            const user = {
                username: oneUser[0].username,
                password: oneUser[0].password,
            };

            const response = await api
                .post('/api/auth/login')
                .send(user)
                .expect(200)
                .expect('Content-Type', /application\/json/);

            assert(response);
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