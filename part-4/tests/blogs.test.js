const { test, after, describe, beforeEach } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const app = require('../app');
const db = require('../models')
const Blog = require('../models/blogs');

const api = supertest(app);

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

after(() => {
    db.connection.close();
});
