const { test, after, describe, beforeEach } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const app = require('../app');
const db = require('../models')
const Blog = require('../models/blogs');
const User = require('../models/users');
const { listWithMultipleBlogs } = require('./blog_data');
const { usersList } = require('./user_data');

const api = supertest(app);

beforeEach(async () => {
    await User.deleteMany({});
    for (const user of usersList) {
        await api
            .post('/api/users')
            .send(user)
            .expect(201);
    }

    await api.post('/api/auth/login').send({ username: usersList[0].username, password: usersList[0].password }).expect(200);
    await api.post('/api/auth/login').send({ username: usersList[1].username, password: usersList[1].password }).expect(200);
    const users = await User.find({});

    await Blog.deleteMany({});
    for (const blog of listWithMultipleBlogs) {
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${users[0].loginToken}`)
            .send(blog)
            .expect(201);
    }
});

describe('TEST SUITE FOR BLOGS', () => {
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

        test('creating a new blog post without auth header (No logged)', async () => {
            const newBlog = {
                title: 'New blog post',
                author: 'New author',
                url: 'http://newblog.com',
                likes: 0,
            };

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(401)
                .expect('Content-Type', /application\/json/);

            const response = await api.get('/api/blogs');
            assert(response.body.length === listWithMultipleBlogs.length);
        });

        test('creating a new blog post with auth header (logged)', async () => {
            const users = await User.find({});
            const newBlog = {
                title: 'New blog post',
                author: 'New author',
                url: 'http://newblog.com',
                likes: 0
            };

            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${users[0].loginToken}`)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/);

            const response = await api.get('/api/blogs');
            assert(response.body.length === listWithMultipleBlogs.length + 1);
        });

        test('creating a new blog post with missing likes property, it is 0 if it´s missing', async () => {
            const users = await User.find({});

            const newBlog = {
                title: 'New blog post',
                author: 'New author',
                url: 'http://newblog.com',
            };

            const blog = await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${users[0].loginToken}`)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/);

            assert(blog.body.likes === 0);
        });

        describe('Try to create a blog with missing title or url', () => {
            test('missing title', async () => {
                const users = await User.find({});
                const newBlog = {
                    author: 'New author',
                    url: 'http://newblog.com',
                };

                await api
                    .post('/api/blogs')
                    .set('Authorization', `Bearer ${users[0].loginToken}`)
                    .send(newBlog)
                    .expect(400);
            });

            test('missing url', async () => {
                const users = await User.find({});
                const newBlog = {
                    title: 'New blog post',
                    author: 'New author',
                };

                await api
                    .post('/api/blogs')
                    .set('Authorization', `Bearer ${users[0].loginToken}`)
                    .send(newBlog)
                    .expect(400);
            });

        });

        test('creating a new blog post checking if the user is assigned to the blog post', async () => {
            const user = await User.findOne({});
            const newBlog = {
                title: 'New blog post',
                author: 'New author',
                url: 'http://newblog.com',
            };

            const blog = await api.post('/api/blogs').send(newBlog).set('Authorization', `Bearer ${user.loginToken}`).expect(201);
            const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
            assert(blogs[blogs.length - 1].user.id === user.id);
        });
    });

    describe('testing the endpoint [DELETE] /api/blogs/:id', () => {

        test('deleting a blog post without auth header (No logged)', async () => {
            const blogs = await Blog.find({});
            const blog = blogs[0];

            await api
                .delete(`/api/blogs/${blog.id}`)
                .expect(401);

            const response = await api.get('/api/blogs');
            assert(response.body.length === listWithMultipleBlogs.length);
        });

        test('deleting a blog post with auth header (logged)', async () => {
            const users = await User.find({});
            const blogs = await Blog.find({});
            const blog = blogs[0];

            await api
                .delete(`/api/blogs/${blog.id}`)
                .set('Authorization', `Bearer ${users[0].loginToken}`)
                .expect(204);

            const response = await api.get('/api/blogs');
            assert(response.body.length === listWithMultipleBlogs.length - 1);
        });

        test('deleting a blog post with a different user than the owner', async () => {
            const users = await User.find({});
            const blogs = await Blog.find({});
            const blog = blogs[0]; // The owner of this blog post is users[0]

            await api
                .delete(`/api/blogs/${blog.id}`)
                .set('Authorization', `Bearer ${users[1].loginToken}`)
                .expect(401);

            const response = await api.get('/api/blogs');
            assert(response.body.length === listWithMultipleBlogs.length);
        });

    });

    describe('testing the endpoint [PUT] /api/blogs/:id', () => {
        test('updating the likes of a blog post', async () => {
            const blogs = await Blog.find({});
            const blog = blogs[0];

            await api
                .put(`/api/blogs/${blog.id}`)
                .expect(200);

            const response = await api.get('/api/blogs');
            assert(response.body[0].likes === blog.likes + 1);
        });
    });

});

after(() => {
    db.connection.close();
});
