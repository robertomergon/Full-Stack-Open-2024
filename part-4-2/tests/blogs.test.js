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

    test('if the likes property is missing, it will default to 0', async () => {
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

    describe('when the title and url properties are missing', () => {
        test('the server responds with status code 400 wether the title is missing', async () => {
            const newBlog = {
                author: 'New author',
                url: 'http://newblog.com',
                likes: 0
            };

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(400);
        });

        test('the server responds with status code 400 wether the url is missing', async () => {
            const newBlog = {
                title: 'New blog',
                author: 'New author',
                likes: 0
            };

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(400);
        });
    });
});

describe('[DELETE] /api/blogs/:id', () => {
    test('a blog post can be deleted', async () => {
        const blog = await Blog.findOne({});

        await api
            .delete(`/api/blogs/${blog.id}`)
            .expect(204);

        const response = await api.get('/api/blogs');
        expect(response.body).toHaveLength(BlogData.listWithMultipleBlogs.length - 1);
        expect(response.body).not.toContainEqual(expect.objectContaining(blog));
    });
})

describe('[PUT] /api/blogs/:id', () => {
    test.only('a blog post likes can be updated', async () => {
        const blog = await Blog.findOne({});

        await api
            .put(`/api/blogs/${blog.id}`)
            .send({
                likes: blog.likes + 1
            })
            .expect(200);

        const response = await api.get('/api/blogs');
        const blogUpdated = response.body.find(b => b.id === blog.id);
        expect(blogUpdated.likes).toBe(blog.likes + 1);
    });
});
