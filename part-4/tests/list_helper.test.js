const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const { emptyList, listWithOneBlog, listWithMultipleBlogs } = require('./blog_data')

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
})

describe('total likes', () => {
    test('of empty list is zero', () => {
        const result = listHelper.totalLikes(emptyList)
        assert.strictEqual(result, 0)
    })



    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        assert.strictEqual(result, 5)
    })

    test('when list has multiple blogs, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithMultipleBlogs)
        assert.strictEqual(result, 36)
    })
})

describe('favorite blog', () => {
    const emptyList = []
    test('of empty list is undefined', () => {
        const result = listHelper.favoriteBlog(emptyList)
        assert.deepStrictEqual(result, undefined)
    })

    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.favoriteBlog(listWithOneBlog)
        assert.deepStrictEqual(result, listWithOneBlog[0])
    })

    test('when list has multiple blogs, equals the likes of that', () => {
        const result = listHelper.favoriteBlog(listWithMultipleBlogs)
        assert.deepStrictEqual(result, listWithMultipleBlogs[2])
    })
})

describe('most blogs', () => {
    test('of empty list is undefined', () => {
        const result = listHelper.mostBlogs(emptyList)
        assert.deepStrictEqual(result, null)
    })

    const expectedBlogWithOne = {
        author: 'Edsger W. Dijkstra',
        blogs: 1
    }

    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.mostBlogs(listWithOneBlog)
        assert.deepStrictEqual(result, expectedBlogWithOne)
    })

    const expectedBlog = {
        author: "Robert C. Martin",
        blogs: 3
    }

    test('when list has multiple blogs, equals the likes of that', () => {
        const result = listHelper.mostBlogs(listWithMultipleBlogs)
        assert.deepStrictEqual(result, expectedBlog)
    })
})

describe('most likes', () => {
    test('of empty list is undefined', () => {
        const result = listHelper.mostLikes(emptyList)
        assert.deepStrictEqual(result, null)
    })

    const expectedBlogWithOne = {
        author: 'Edsger W. Dijkstra',
        likes: 5
    }

    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.mostLikes(listWithOneBlog)
        assert.deepStrictEqual(result, expectedBlogWithOne)
    })

    const expectedBlog = {
        author: "Edsger W. Dijkstra",
        likes: 17
    }

    test('when list has multiple blogs, equals the likes of that', () => {
        const result = listHelper.mostLikes(listWithMultipleBlogs)
        assert.deepStrictEqual(result, expectedBlog)
    })

})

