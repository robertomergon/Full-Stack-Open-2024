const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('dummy', () => {
    test('dummy returns one', () => {
        const result = listHelper.dummy()
        assert.strictEqual(result, 1)
    })
})

describe('total likes (single object in the list)', () => {
    const listWithOneBlog = [
        {
            id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
        },
    ]

    test('of empty list is zero', () => {
        const result = listHelper.totalLikes([])
        assert.strictEqual(result, 0)
    })

    test('when list has only one blog equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        assert.strictEqual(result, 5)
    })

    test('of a bigger list is calculated right', () => {
        const result = listHelper.totalLikes(listWithOneBlog.concat(listWithOneBlog))
        assert.strictEqual(result, 10)
    })
})

describe('favorite blog', () => {
    const blogs = [
        {
            id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
        },
        {
            id: '5a422aa71b54a676234d17f8',
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
            likes: 12,
        }]

    test('favorite blog is the one with most likes', () => {
        const result = listHelper.favoriteBlog(blogs)
        assert.deepStrictEqual(result, blogs[1])
    })
})

describe('most blogs', () => {
    const blogs = [
        {
            id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
        },
        {
            id: '5a422aa71b54a678234d17f8',
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
            likes: 12,
        },
        {
            id: '5b422bc61b54a676234d17f9',
            title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
            author: 'Robert C. Martin',
            url: 'https://www.example.com/clean-code',
            likes: 4,
        },
        {
            id: '5b422bd21b54a676234d17fa',
            title: 'The Clean Coder: A Code of Conduct for Professional Programmers',
            author: 'Robert C. Martin',
            url: 'https://www.example.com/the-clean-coder',
            likes: 3,
        },
        {
            id: '5b422be31b54a676234d17fb',
            title: 'Clean Architecture: A Craftsman\'s Guide to Software Structure and Design',
            author: 'Robert C. Martin',
            url: 'https://www.example.com/clean-architecture',
            likes: 2,
        }
    ]

    test('author with most blogs is the one with most blogs', () => {
        const result = listHelper.mostBlogs(blogs)
        assert.deepStrictEqual(result, {
            author: 'Robert C. Martin',
            blogs: 3
        })
    })
})

describe('most likes', () => {
    const blogs = [
        {
            id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
        },
        {
            id: '5a422aa71b54a678234d17f8',
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
            likes: 12,
        },
        {
            id: '5b422bc61b54a676234d17f9',
            title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
            author: 'Robert C. Martin',
            url: 'https://www.example.com/clean-code',
            likes: 4,
        },
        {
            id: '5b422bd21b54a676234d17fa',
            title: 'The Clean Coder: A Code of Conduct for Professional Programmers',
            author: 'Robert C. Martin',
            url: 'https://www.example.com/the-clean-coder',
            likes: 3,
        },
        {
            id: '5b422be31b54a676234d17fb',
            title: 'Clean Architecture: A Craftsman\'s Guide to Software Structure and Design',
            author: 'Robert C. Martin',
            url: 'https://www.example.com/clean-architecture',
            likes: 2,
        }
    ]

    test('author with most likes is the one with most likes', () => {
        const result = listHelper.mostLikes(blogs)
        assert.deepStrictEqual(result, {
            author: 'Edsger W. Dijkstra',
            likes: 17
        })
    })
})